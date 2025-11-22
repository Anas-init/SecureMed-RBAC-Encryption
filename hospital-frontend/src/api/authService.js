import api from "./axiosConfig";

export async function login(username, password) {
  const res = await api.post("/api/auth/login", { username, password });
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/api/auth/user");
  return res.data;
}

export async function logout() {
  // optional endpoint
  try {
    await api.post("/api/auth/logout");
  } catch(e) {
    // ignore
  }
  localStorage.removeItem("token");
}
