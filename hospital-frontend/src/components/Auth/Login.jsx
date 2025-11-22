import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiLogin(form.username, form.password);
      if (res.token) {
        login(res.token);
        // route by role if provided
        const role = res.role;
        if (role === "admin") navigate("/admin");
        else if (role === "doctor") navigate("/doctor");
        else if (role === "receptionist") navigate("/reception");
        else navigate("/");
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"40px auto"}}>
        <h2>Login</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="input" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          </div>
          <div className="form-row">
            <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
