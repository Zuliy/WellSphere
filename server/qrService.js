import QRCode from 'qrcode';

export const generatePatientQRCode = async (patientId) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const doctorViewUrl = `${baseUrl}/doctor-view?patientId=${patientId}`;

    try {
        const qrCodeDataUri = await QRCode.toDataURL(doctorViewUrl, {
            errorCorrectionLevel: 'H'
        });

        const qrCodeBuffer = await QRCode.toBuffer(doctorViewUrl, {
            errorCorrectionLevel: 'H'
        });

        return {
            url: doctorViewUrl,
            qrCode: qrCodeDataUri,
            buffer: qrCodeBuffer
        };
    } catch (error) {
        throw new Error('Failed to generate QR code');
    }
};
