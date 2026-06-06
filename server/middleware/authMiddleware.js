import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecrethealthpassportai2026jwtkey');
    
    // Check if user still exists
    const userResult = await query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: 'User no longer exists' });
    }

    // Attach user information to request
    req.user = userResult.rows[0];
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};
