import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout as apiLogout } from "../../api/authService";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiLogout().catch(()=>{});
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div style={{display:"flex",flexDirection:"column"}}>
        <strong>SecureHospital</strong>
        <small style={{color:"#6b7280"}}>Privacy & RBAC Demo</small>
      </div>
      <div className="nav">
        <Link className="link" to="/">Home</Link>
        {user && user.role === "admin" && <Link className="link" to="/admin">Admin</Link>}
        {user && user.role === "doctor" && <Link className="link" to="/doctor">Doctor</Link>}
        {user && user.role === "receptionist" && <Link className="link" to="/reception">Reception</Link>}

        {user && user.role === "admin" && <Link className="link" to="/users">Users</Link>}
        {user && user.role === "admin" && <Link className="link" to="/users/new">Add User</Link>}
        {user && user.role === "admin" && <Link className="link" to="/logs">Logs</Link>}

        <button className="logout" onClick={handleLogout}>
          {user ? `Logout (${user.username || user.user_id})` : <Link to="/login">Login</Link>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
