import React from "react";
import Navbar from "../components/Shared/Navbar";
import PatientList from "../components/Patients/PatientList";

const ReceptionDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Receptionist Dashboard</h2>
        <div className="card">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3>Patients</h3>
            <a href="/patients/new" className="btn">Add Patient</a>
          </div>
          <PatientList receptionistView />
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
