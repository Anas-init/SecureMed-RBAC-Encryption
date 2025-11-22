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
          <p style={{color:"#374151"}}>To protect privacy, patient identifiers are anonymized for doctors. Contact admins if de-anonymization is required for clinical reasons.</p>
          <PatientList doctorView />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
