import api from "./axiosConfig";

// GET /api/patients
export const fetchAllPatients = () => api.get("/api/patients");

// GET /api/patients/Anonymize
export const fetchMaskedPatients = () => api.get("/api/patients/Anonymize");

// POST /api/patients
export const addPatient = (data) => api.post("/api/patients", data);

// PUT /api/patients/{id}
export const updatePatient = (id, data) =>
  api.put(`/api/patients/${id}`, data);

// DELETE /api/patients/{id}
export const deletePatient = (id) =>
  api.delete(`/api/patients/${id}`);

// POST /api/patients/Anonymize/{id}
export const anonymizePatient = (id) =>
  api.post(`/api/patients/Anonymize/${id}`);

// POST /api/patients/Anonymize/All
export const anonymizeAll = () =>
  api.post(`/api/patients/Anonymize/All`);
