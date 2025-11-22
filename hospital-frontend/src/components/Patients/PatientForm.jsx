import React, { useEffect, useState } from "react";
import { addPatient, updatePatient, fetchAllPatients } from "../../api/patientService";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

const PatientForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    diagnosis: "",
    date_added: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      // fetch single patient via /api/patients (backend can support single fetch but we don't have it specified)
      // We'll fetch all and pick by id as a fallback
      (async () => {
        try {
          const res = await api.get("/api/patients");
          const p = res.data.find(x => String(x.patient_id) === String(id));
          if (p) setForm({ name: p.name || "", contact: p.contact || "", diagnosis: p.diagnosis || "", date_added: p.date_added || ""});
        } catch (err) {
          setError("Failed to load patient for editing");
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await updatePatient(id, form);
        alert("Updated");
      } else {
        await addPatient(form);
        alert("Added");
      }
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.detail || "Operation failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:700, margin:"20px auto"}}>
        <h3>{isEdit ? "Edit Patient" : "Add Patient"}</h3>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="input" name="name" placeholder="Full name" value={form.name} onChange={handleChange}/>
            <input className="input" name="contact" placeholder="Contact" value={form.contact} onChange={handleChange}/>
          </div>
          <div className="form-row">
            <input className="input" name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange}/>
            <input className="input" name="date_added" placeholder="YYYY-MM-DD" value={form.date_added} onChange={handleChange}/>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn" type="submit">{isEdit ? "Update" : "Create"}</button>
            <button type="button" className="btn ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
