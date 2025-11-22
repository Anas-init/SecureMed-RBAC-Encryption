import React, { useEffect, useState } from "react";
import { fetchAllPatients, fetchMaskedPatients, deletePatient } from "../../api/patientService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientList = ({ adminView=false, doctorView=false, receptionistView=false }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setError("");
    try {
      let res;
      if (adminView) {
        res = await fetchAllPatients();
      } else if (doctorView) {
        res = await fetchMaskedPatients();
      } else if (receptionistView) {
        // receptionists add/edit but cannot view sensitive fields; backend should enforce
        res = await fetchMaskedPatients(); // receptionist likely can't view masked - but we call masked so they get minimal info
      } else {
        // default based on role
        if (user?.role === "admin") res = await fetchAllPatients();
        else res = await fetchMaskedPatients();
      }
      setPatients(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load patients");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete patient? This action is irreversible.")) return;
    try {
      await deletePatient(id);
      setPatients(patients.filter(p => p.patient_id !== id));
    } catch (err) {
      alert("Delete failed: " + (err?.response?.data?.detail || err.message));
    }
  };

  return (
    <div>
      {error && <div className="alert">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Diagnosis</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td>{p.anonymized_name || p.name}</td>
              <td>{p.anonymized_contact || p.contact}</td>
              <td>{p.diagnosis || "-"}</td>
              <td>{p.date_added ? new Date(p.date_added).toLocaleString() : "-"}</td>
              <td>
                <Link className="link" to={`/patients/${p.patient_id}`}>View</Link>
                { (user?.role === "admin" || user?.role === "receptionist") && (
                  <Link style={{marginLeft:8}} className="link" to={`/patients/${p.patient_id}/edit`}>Edit</Link>
                )}
                { user?.role === "admin" && (
                  <button style={{marginLeft:8}} className="btn ghost" onClick={() => handleDelete(p.patient_id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
