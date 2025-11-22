import React from "react";
import Navbar from "../components/Shared/Navbar";
import PatientList from "../components/Patients/PatientList";

const DoctorDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Doctor Dashboard</h2>
        <div className="card">
          <h3>Anonymized Patients</h3>
          <PatientList doctorView />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
