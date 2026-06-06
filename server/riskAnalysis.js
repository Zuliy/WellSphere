export const analyzeRisk = (patientData) => {
    if (!patientData || !patientData.records) return null;

    const diagnoses = patientData.records.map(r => (r.diagnosis || '').toLowerCase());
    const allergies = patientData.allergies.map(a => (a.allergy || '').toLowerCase());
    
    const chronicConditionKeywords = ['diabetes', 'hypertension', 'asthma', 'arthritis', 'copd', 'heart disease'];
    const patientChronicConditions = new Set(
        diagnoses.filter(d => chronicConditionKeywords.some(keyword => d.includes(keyword)))
    );

    const hasDiabetes = diagnoses.some(d => d.includes('diabetes'));
    const hasHypertension = diagnoses.some(d => d.includes('hypertension'));
    
    if (hasDiabetes && hasHypertension) {
        return "High cardiovascular risk";
    }

    if (patientChronicConditions.size >= 3) {
        return "Complex patient profile";
    }

    if (diagnoses.some(d => d.includes('asthma'))) {
        return "Respiratory risk";
    }

    if (allergies.some(a => a.includes('penicillin'))) {
        return "Medication alert";
    }

    return null;
};
