import api from "./axiosConfig";

// Admin-only: create a user (username, password, role)
export const createUser = (payload) => api.post("/api/create-users", payload);

// fetch users (used in UsersList)
export const fetchUsers = () => api.get("/api/users");

// delete user
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
