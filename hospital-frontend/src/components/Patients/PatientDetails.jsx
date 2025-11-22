import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { anonymizePatient } from "../../api/patientService";
import { useAuth } from "../../context/AuthContext";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/patients");
        const p = res.data.find(x => String(x.patient_id) === String(id));
        if (!p) {
          const r2 = await api.get("/api/patients/masked");
          const p2 = r2.data.find(x => String(x.patient_id) === String(id));
          setPatient(p2 || null);
        } else setPatient(p);
      } catch (err) {
        setError("Failed to retrieve patient");
      }
    })();
  }, [id]);

  const handleAnonymize = async () => {
    if (!window.confirm("Anonymize this patient?")) return;
    try {
      await anonymizePatient(id);
      alert("Anonymized");
      // reload
      const res = await api.get("/api/patients");
      setPatient(res.data.find(x => String(x.patient_id) === String(id)) || null);
    } catch (err) {
      alert("Anonymize failed");
    }
  };

  if (error) return <div className="container"><div className="card alert">{error}</div></div>;
  if (!patient) return <div className="container card">Loading...</div>;

  return (
    <div className="container">
      <div className="card" style={{maxWidth:700, margin:"20px auto"}}>
        <h3>Patient #{patient.patient_id}</h3>
        <p><strong>Name:</strong> {patient.anonymized_name ?? patient.name}</p>
        <p><strong>Contact:</strong> {patient.anonymized_contact ?? patient.contact}</p>
        <p><strong>Diagnosis:</strong> {patient.diagnosis ?? "-"}</p>
        <p><strong>Date Added:</strong> {patient.date_added ?? "-"}</p>
        <div style={{display:"flex", gap:8}}>
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
          {user?.role === "admin" && (
            <button className="btn ghost" onClick={handleAnonymize}>Anonymize</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
