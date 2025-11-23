import api from "./axiosConfig";

// POST /api/users  → Create a new user
export const createUser = (payload) => api.post("/api/users", payload);

// GET /api/users  → Fetch all users
export const fetchUsers = () => api.get("/api/users");

// PUT /api/users/{id}  → Update user
export const updateUser = (id, payload) =>
  api.put(`/api/users/${id}`, payload);

// DELETE /api/users/{id} → Delete user
export const deleteUser = (id) =>
  api.delete(`/api/users/${id}`);
