import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecrethealthpassportai2026jwtkey';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const insertResult = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    const user = insertResult.rows[0];

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      passport: null,
      medicalRecords: [],
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Get user by email
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Fetch allergies for passport
    const allergiesResult = await query('SELECT allergy FROM allergies WHERE user_id = $1', [user.id]);
    const allergiesString = allergiesResult.rows.map(r => r.allergy).join(', ');

    // Format passport details to match the frontend expectations
    let passport = null;
    if (user.patient_id) {
      passport = {
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
    }

    // Fetch medical records
    const recordsResult = await query(
      'SELECT id, hospital_name as "hospitalName", date, diagnosis, medication, notes, created_at as "createdAt" FROM medical_records WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [user.id]
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      passport,
      medicalRecords: recordsResult.rows,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};
