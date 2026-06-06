import { query } from '../config/db.js';

function generatePatientId() {
  return `HP-${Math.floor(10000 + Math.random() * 90000)}`;
}

function generateAuthId() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HP-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${suffix}`;
}

export const getPassport = async (req, res) => {
  const userId = req.user.id;

  try {
    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    if (!user.patient_id) {
      return res.json(null); // No passport created yet
    }

    // Fetch allergies
    const allergiesResult = await query('SELECT allergy FROM allergies WHERE user_id = $1', [userId]);
    const allergiesString = allergiesResult.rows.map(r => r.allergy).join(', ');

    res.json({
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
    });
  } catch (err) {
    console.error('Get Passport Error:', err);
    res.status(500).json({ message: 'Internal server error fetching passport' });
  }
};

export const savePassport = async (req, res) => {
  const userId = req.user.id;
  const {
    fullName,
    dateOfBirth,
    gender,
    phoneNumber,
    bloodType,
    allergies,
    currentMedications,
    chronicConditions,
    emergencyContactName,
    emergencyContactPhone,
  } = req.body;

  if (!fullName || !dateOfBirth || !gender || !phoneNumber || !bloodType) {
    return res.status(400).json({ message: 'Required passport fields are missing' });
  }

  try {
    // Check if patient_id and auth_id are already generated
    const userCheck = await query('SELECT patient_id, auth_id, created_at FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let patientId = userCheck.rows[0].patient_id;
    let authId = userCheck.rows[0].auth_id;

    if (!patientId) {
      patientId = generatePatientId();
    }
    if (!authId) {
      authId = generateAuthId();
    }

    // Update users table with profile information
    await query(
      `UPDATE users 
       SET name = $1, date_of_birth = $2, gender = $3, phone_number = $4, blood_type = $5,
           current_medications = $6, chronic_conditions = $7, 
           emergency_contact_name = $8, emergency_contact_phone = $9,
           patient_id = $10, auth_id = $11
       WHERE id = $12`,
      [
        fullName,
        dateOfBirth,
        gender,
        phoneNumber,
        bloodType,
        currentMedications || '',
        chronicConditions || '',
        emergencyContactName || '',
        emergencyContactPhone || '',
        patientId,
        authId,
        userId,
      ]
    );

    // Save allergies
    // First clear existing allergies for the user
    await query('DELETE FROM allergies WHERE user_id = $1', [userId]);

    // Parse and insert new allergies
    const allergyList = allergies
      ? allergies
          .split(/[,;\n]+/)
          .map(item => item.trim())
          .filter(Boolean)
      : [];

    for (const allergy of allergyList) {
      await query('INSERT INTO allergies (user_id, allergy) VALUES ($1, $2)', [userId, allergy]);
    }

    // Fetch updated user to return latest values
    const updatedUserResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
    const updatedUser = updatedUserResult.rows[0];

    res.json({
      fullName: updatedUser.name,
      dateOfBirth: updatedUser.date_of_birth,
      gender: updatedUser.gender,
      phoneNumber: updatedUser.phone_number,
      email: updatedUser.email,
      bloodType: updatedUser.blood_type,
      allergies: allergyList.join(', '),
      currentMedications: updatedUser.current_medications || '',
      chronicConditions: updatedUser.chronic_conditions || '',
      emergencyContactName: updatedUser.emergency_contact_name || '',
      emergencyContactPhone: updatedUser.emergency_contact_phone || '',
      patientId: updatedUser.patient_id,
      authId: updatedUser.auth_id,
      createdAt: updatedUser.created_at,
    });
  } catch (err) {
    console.error('Save Passport Error:', err);
    res.status(500).json({ message: 'Internal server error saving passport' });
  }
};
