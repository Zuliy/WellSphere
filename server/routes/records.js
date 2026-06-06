import express from 'express';
import { getRecords, addRecord, getDoctorAccess } from '../controllers/recordController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getRecords);
router.post('/', authenticateToken, addRecord);
router.get('/doctor/:authId', getDoctorAccess);

export default router;
