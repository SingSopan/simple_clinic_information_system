export const matchesPatientSearch = (patient, query) => `${patient.name} ${patient.nik} ${patient.mrn}`.toLowerCase().includes(query.trim().toLowerCase())
