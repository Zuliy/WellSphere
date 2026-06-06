import { getPatientSummary } from './aiSummaryService.js';

export const getAiSummary = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId || patientId.trim() === '') {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        const cleanPatientId = patientId.trim();
        const summaryData = await getPatientSummary(cleanPatientId);

        if (!summaryData) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        return res.json({
            success: true,
            summary: summaryData.summary,
            riskFlag: summaryData.riskFlag,
            recordsCount: summaryData.recordsCount,
            healthInsights: summaryData.healthInsights
        });

    } catch (error) {
        console.error('Error generating AI Summary:', error);
        return res.status(500).json({ success: false, message: 'Internal server error while generating AI summary' });
    }
};
