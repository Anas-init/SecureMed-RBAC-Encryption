import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data || []);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter(u => u.user_id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Users</h3>
        {error && <div className="alert">{error}</div>}
        <table className="table">
          <thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  {/* Ideally add edit user/role UI */}
                  <button className="btn ghost" onClick={() => handleDelete(u.user_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
