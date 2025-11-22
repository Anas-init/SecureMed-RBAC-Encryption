import api from "./axiosConfig";

export const fetchAllPatients = () => api.get("/api/patients");
export const fetchMaskedPatients = () => api.get("/api/patients/masked");
export const addPatient = (data) => api.post("/api/patients", data);
export const updatePatient = (id, data) => api.put(`/api/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/api/patients/${id}`);
export const anonymizePatient = (id) => api.post(`/api/patients/anonymize/${id}`);
export const anonymizeAll = () => api.post(`/api/patients/anonymize/all`);
