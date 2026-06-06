import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import passportRoutes from './routes/passport.js';
import recordRoutes from './routes/records.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/records', recordRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Health Passport AI API' });
});

// Start DB and Express server
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
