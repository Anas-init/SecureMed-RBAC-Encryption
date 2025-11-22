import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import PatientForm from "./components/Patients/PatientForm";
import PatientDetails from "./components/Patients/PatientDetails";
import UsersList from "./components/Users/UsersList";
import AddUser from "./components/Users/AddUser";      // NEW
import LogsPage from "./components/Logs/LogsPage";
import HealthCheck from "./components/Health/HealthCheck";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import Navbar from "./components/Shared/Navbar";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/reception" element={
        <ProtectedRoute allowedRoles={["receptionist"]}>
          <ReceptionDashboard />
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <>
            <Navbar />
            <UsersList />
          </>
        </ProtectedRoute>
      } />

      <Route path="/users/new" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <>
            <Navbar />
            <AddUser />
          </>
        </ProtectedRoute>
      } />

      <Route path="/logs" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <>
            <Navbar />
            <LogsPage />
          </>
        </ProtectedRoute>
      } />

      <Route path="/patients/new" element={
        <ProtectedRoute allowedRoles={["admin","receptionist"]}>
          <>
            <Navbar />
            <PatientForm />
          </>
        </ProtectedRoute>
      } />

      <Route path="/patients/:id/edit" element={
        <ProtectedRoute allowedRoles={["admin","receptionist"]}>
          <>
            <Navbar />
            <PatientForm />
          </>
        </ProtectedRoute>
      } />

      <Route path="/patients/:id" element={
        <ProtectedRoute allowedRoles={["admin","doctor","receptionist"]}>
          <>
            <Navbar />
            <PatientDetails />
          </>
        </ProtectedRoute>
      } />

      <Route path="/health" element={
        <ProtectedRoute allowedRoles={["admin","doctor","receptionist"]}>
          <>
            <Navbar />
            <HealthCheck />
          </>
        </ProtectedRoute>
      } />

      <Route path="*" element={<div className="container card">Page not found</div>} />
    </Routes>
  );
}

export default App;
