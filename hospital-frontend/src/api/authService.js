import api from "./axiosConfig";

export async function login(username, password) {
  const res = await api.post("/api/auth/Sign-In", { username, password });
  console.log(res);
  
  const token = res.data.token;

  // Save token
  if (token) {
    localStorage.setItem("token", token);
  }

  return res.data;
}

export async function getCurrentUser() {
  // Since backend has no "user" endpoint, decode token manually
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1])); 
  return {
    id: payload.id,
    username: payload.username,
    role: payload.role
  };
}

export async function logout() {
  try {
    // Backend route is "Log-Out"
    await api.post("/api/auth/Log-Out");
  } catch (e) {
    console.log("Logout error (ignored):", e);
  }

  localStorage.removeItem("token");
}
