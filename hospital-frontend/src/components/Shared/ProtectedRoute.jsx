import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user, loading } = useAuth();

  if (loading) return <div className="container card">Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles.length && (!user || !allowedRoles.includes(user.role))) {
    return <div className="container card"><h3>Access Denied</h3><p>You don't have permission to view this page.</p></div>;
  }

  return children;
};

export default ProtectedRoute;
