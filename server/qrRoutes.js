import express from 'express';
import { getPatientQRCode, downloadPatientQRCode } from './qrController.js';

const router = express.Router();

// Route to get QR code as JSON response
router.get('/:patientId', getPatientQRCode);

// Route to download QR code as a PNG file
router.get('/:patientId/download', downloadPatientQRCode);

export default router;
