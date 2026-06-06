import express from 'express';
import { getPassport, savePassport } from '../controllers/passportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getPassport);
router.post('/', authenticateToken, savePassport);

export default router;
