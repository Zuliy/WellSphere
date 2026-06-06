import { query } from '../config/db.js';
import crypto from 'crypto';

export const getRecords = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await query(
      'SELECT id, hospital_name as "hospitalName", date, diagnosis, medication, notes, created_at as "createdAt" FROM medical_records WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get Records Error:', err);
    res.status(500).json({ message: 'Internal server error fetching records' });
  }
};

export const addRecord = async (req, res) => {
  const userId = req.user.id;
  const { hospitalName, date, diagnosis, medication, notes } = req.body;

  if (!hospitalName || !date || !diagnosis) {
    return res.status(400).json({ message: 'Hospital name, date, and diagnosis are required' });
  }

  try {
    const recordId = crypto.randomUUID();
    await query(
      `INSERT INTO medical_records (id, user_id, hospital_name, date, diagnosis, medication, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [recordId, userId, hospitalName, date, diagnosis, medication || '', notes || '']
    );

    // Fetch the inserted record to return it
    const insertedResult = await query(
      'SELECT id, hospital_name as "hospitalName", date, diagnosis, medication, notes, created_at as "createdAt" FROM medical_records WHERE id = $1',
      [recordId]
    );

    res.status(201).json(insertedResult.rows[0]);
  } catch (err) {
    console.error('Add Record Error:', err);
    res.status(500).json({ message: 'Internal server error adding medical record' });
  }
};

// Doctor Access Endpoint
export const getDoctorAccess = async (req, res) => {
  const { authId } = req.params;

  if (!authId) {
    return res.status(400).json({ message: 'Auth ID is required' });
  }

  try {
    // Find user by authId
    const userResult = await query('SELECT * FROM users WHERE auth_id = $1', [authId.trim().toUpperCase()]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found for the provided Auth ID' });
    }

    const user = userResult.rows[0];

    // Fetch allergies
    const allergiesResult = await query('SELECT allergy FROM allergies WHERE user_id = $1', [user.id]);
    const allergiesString = allergiesResult.rows.map(r => r.allergy).join(', ');

    // Format passport details to match doctor portal expectations
    const passport = {
      fullName: user.name,
      dateOfBirth: user.date_of_birth,
      gender: user.gender,
      phoneNumber: user.phone_number,
      email: user.email,
      bloodType: user.blood_type,
      allergies: allergiesString,
      currentMedications: user.current_medications || '',
      chronicConditions: user.chronic_conditions || '',
      emergencyContactName: user.emergency_contact_name || '',
      emergencyContactPhone: user.emergency_contact_phone || '',
      patientId: user.patient_id,
      authId: user.auth_id,
      createdAt: user.created_at,
    };

    // Fetch medical records
    const recordsResult = await query(
      'SELECT id, hospital_name as "hospitalName", date, diagnosis, medication, notes, created_at as "createdAt" FROM medical_records WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [user.id]
    );

    res.json({
      passport,
      medicalRecords: recordsResult.rows,
    });
  } catch (err) {
    console.error('Doctor Access Error:', err);
    res.status(500).json({ message: 'Internal server error fetching patient records' });
  }
};
