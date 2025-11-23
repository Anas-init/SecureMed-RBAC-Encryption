import React, { useEffect, useState } from "react";
import { fetchAllPatients, fetchMaskedPatients, deletePatient, anonymizePatient, anonymizeAll } from "../../api/patientService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientList = ({ adminView=false, doctorView=false, receptionistView=false }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      let res;
      if (adminView) res = await fetchAllPatients();
      else if (doctorView) res = await fetchMaskedPatients();
      else if (receptionistView) res = await fetchMaskedPatients();
      else {
        res = user?.role === "admin" ? await fetchAllPatients() : await fetchMaskedPatients();
      }

      console.log(res);
      
      setPatients(res.data.patients || []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete patient? This action is irreversible.")) return;
    try {
      await deletePatient(id);
      setPatients(patients.filter(p => p.id !== id));
    } catch (err) {
      alert("Delete failed: " + (err?.response?.data?.detail || err.message));
    }
  };

  const handleAnonymize = async (id) => {
    try {
      await anonymizePatient(id);
      alert("Patient anonymized");
      load();
    } catch (err) {
      alert("Anonymize failed: " + (err?.response?.data?.detail || err.message));
    }
  };

  const handleAnonymizeAll = async () => {
    if (!window.confirm("Anonymize all patient sensitive fields?")) return;
    try {
      await anonymizeAll();
      alert("All patients anonymized");
      load();
    } catch (err) {
      alert("Anonymize all failed: " + (err?.response?.data?.detail || err.message));
    }
  };

  return (
    <div>
      {error && <div className="alert">{error}</div>}
      {user?.role === "doctor" && (
        <div style={{marginBottom:12}} className="card">
          <strong>Note:</strong> All patient names and contacts are shown anonymized to protect privacy.
        </div>
      )}
      {loading ? <div>Loading...</div> : (
      <>
        {user?.role === "admin" && (
          <div style={{display:"flex", justifyContent:"flex-end", marginBottom:8}}>
            <button className="btn ghost" onClick={handleAnonymizeAll}>Anonymize All</button>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Contact</th><th>Diagnosis</th><th>Date Added</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.anonymizedName == "" ? p.name : p.anonymizedName}</td>
                <td>{p.anonymizedContact == "" ? p.contact : p.anonymizedContact}</td>
                <td>{p.diagnosis ?? "-"}</td>
                <td>{p.dateAdded ? new Date(p.dateAdded).toLocaleString() : "-"}</td>
                <td>
                  <Link className="link" to={`/patients/${p.id}`}>View</Link>
                  { (user?.role === "admin" || user?.role === "receptionist") && (
                    <Link style={{marginLeft:8}} className="link" to={`/patients/${p.id}/edit`}>Edit</Link>
                  )}
                  { user?.role === "admin" && (
                    <>
                      <button style={{marginLeft:8}} className="btn ghost" onClick={() => handleDelete(p.id)}>Delete</button>
                      <button style={{marginLeft:8}} className="btn" onClick={() => handleAnonymize(p.id)}>Anonymize</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      )}
    </div>
  );
};

export default PatientList;
