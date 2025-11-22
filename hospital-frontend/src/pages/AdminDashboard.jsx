import React from "react";
import Navbar from "../components/Shared/Navbar";
import PatientList from "../components/Patients/PatientList";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Admin Dashboard</h2>
        <div className="card">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3>Patients</h3>
            <div>
              <Link to="/patients/new" className="btn">Add Patient</Link>
              <button className="btn ghost" style={{marginLeft:8}} onClick={() => window.location.reload()}>Refresh</button>
            </div>
          </div>
          <PatientList adminView />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
