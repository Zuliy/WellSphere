import { analyzeRisk } from './riskAnalysis.js';
import { query } from './config/db.js';

/**
 * Retrieves a patient by patient_id from the real database,
 * along with their medical records and allergies.
 */
const getPatientById = async (patientId) => {
    try {
        // 1. Get user by patient_id
        const userRes = await query('SELECT * FROM users WHERE patient_id = $1', [patientId]);
        if (userRes.rows.length === 0) return null;
        
        const user = userRes.rows[0];
        const userId = user.id; // DB primary key

        // 2. Get medical records by user_id
        const recordsRes = await query('SELECT * FROM medical_records WHERE user_id = $1', [userId]);
        
        // 3. Get allergies by user_id
        const allergiesRes = await query('SELECT * FROM allergies WHERE user_id = $1', [userId]);

        return {
            id: user.patient_id,
            name: user.name,
            age: calculateAge(user.date_of_birth),
            blood_type: user.blood_type,
            records: recordsRes.rows || [],
            allergies: allergiesRes.rows || []
        };
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

/**
 * Helper to calculate age from Date of Birth.
 */
const calculateAge = (dob) => {
    if (!dob) return "unknown age";
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return "unknown age";
    const diff = Date.now() - dobDate.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

/**
 * Simulates an LLM generating a professional medical summary.
 */
const generateMockSummary = (patientData) => {
    if (patientData.records.length === 0 && patientData.allergies.length === 0) {
        return `Patient ${patientData.name} has no significant past medical history, known allergies, or current medications reported on file. Routine preventative care is advised.`;
    }

    const diagnoses = patientData.records.map(r => r.diagnosis).filter(Boolean);
    const meds = patientData.records.map(r => r.medication).filter(Boolean);
    const allergies = patientData.allergies.map(a => a.allergy).filter(Boolean);

    let summary = `Patient ${patientData.name} `;
    if (patientData.age !== "unknown age") {
        summary += `is a ${patientData.age}-year-old `;
    }
    summary += `presenting `;
    
    if (diagnoses.length > 0) {
        summary += `with a medical history significant for ${diagnoses.join(', ')}. `;
    } else {
        summary += `with no major chronic illnesses reported. `;
    }

    if (meds.length > 0) {
        summary += `Current medication regimen includes ${[...new Set(meds)].join(', ')}. `;
    }

    if (allergies.length > 0) {
        summary += `Patient has documented severe allergies to ${allergies.join(', ')}. `;
    } else {
        summary += `There are no known drug allergies reported at this time. `;
    }

    return summary.trim();
};

/**
 * Generates simple health insights from patient data.
 */
const generateHealthInsights = (patientData) => {
    const insights = [];
    
    // Allergy insights
    if (patientData.allergies && patientData.allergies.length > 0) {
        patientData.allergies.forEach(a => insights.push(`Allergic to ${a.allergy}`));
    }
    
    // Medication insights
    const currentMedications = new Set();
    if (patientData.records) {
        patientData.records.forEach(r => {
            if (r.medication && !r.medication.includes('(past)')) {
                currentMedications.add(r.medication);
            }
        });
    }
    currentMedications.forEach(med => insights.push(`Currently using ${med}`));
    
    // Condition insights
    const diagnoses = patientData.records ? patientData.records.map(r => (r.diagnosis || '').toLowerCase()) : [];
    if (diagnoses.some(d => d.includes('asthma') || d.includes('copd'))) {
        insights.push('History of respiratory illness');
    }
    if (diagnoses.some(d => d.includes('diabetes'))) {
        insights.push('Requires blood sugar monitoring');
    }

    return insights;
};

/**
 * Main service method to retrieve the fully compiled AI Summary.
 */
export const getPatientSummary = async (patientId) => {
    // 1. Fetch real patient data from DB
    const patientData = await getPatientById(patientId);
    
    if (!patientData) {
        return null; // Patient not found
    }

    // 2. Generate summary
    const summary = generateMockSummary(patientData);
    
    // 3. Analyze risk
    const riskFlag = analyzeRisk(patientData);
    
    // 4. Generate insights
    const healthInsights = generateHealthInsights(patientData);
    
    // 5. Calculate records count
    const recordsCount = patientData.records ? patientData.records.length : 0;

    return {
        summary,
        riskFlag,
        recordsCount,
        healthInsights
    };
};
