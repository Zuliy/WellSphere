import { generatePatientQRCode } from './qrService.js';

export const getPatientQRCode = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId || patientId.trim() === '') {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        const cleanPatientId = patientId.trim();
        const { url, qrCode } = await generatePatientQRCode(cleanPatientId);

        return res.json({ success: true, patientId: cleanPatientId, url, qrCode });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).json({ success: false, message: 'Internal server error while generating QR code' });
    }
};

export const downloadPatientQRCode = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId || patientId.trim() === '') {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        const cleanPatientId = patientId.trim();
        const { buffer } = await generatePatientQRCode(cleanPatientId);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="health-passport-${cleanPatientId}.png"`);
        
        return res.send(buffer);
    } catch (error) {
        console.error('Error downloading QR code:', error);
        return res.status(500).json({ success: false, message: 'Internal server error while generating QR code download' });
    }
};
