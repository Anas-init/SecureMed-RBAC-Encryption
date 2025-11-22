import React, { useState } from "react";
import { createUser } from "../../api/userService";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "receptionist" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // API expects { username, password, role }
      await createUser(form);
      setSuccess("User created successfully.");
      setTimeout(() => navigate("/users"), 800);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to create user");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600, margin: "24px auto" }}>
        <h3>Create New User (Admin)</h3>
        {error && <div className="alert">{error}</div>}
        {success && <div style={{padding:"8px", borderRadius:6, background:"#ecfccb", color:"#365314"}}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="input" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <select name="role" value={form.role} onChange={handleChange} className="input small">
              <option value="admin">admin</option>
              <option value="doctor">doctor</option>
              <option value="receptionist">receptionist</option>
            </select>
          </div>
          <div className="form-row">
            <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn" type="submit">Create</button>
            <button type="button" className="btn ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
