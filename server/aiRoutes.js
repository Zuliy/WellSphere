import express from 'express';
import { getAiSummary } from './aiController.js';

const router = express.Router();

router.get('/:patientId', getAiSummary);

export default router;
