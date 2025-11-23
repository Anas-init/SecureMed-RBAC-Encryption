import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/api/logs");
      setLogs(res.data.logs || []);
    } catch (err) {
      setError("Failed to fetch logs");
    }
  };

  useEffect(() => { load(); }, []);

  const handleExport = async () => {
    try {
      const res = await api.get("/api/logs/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "logs.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Export failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Audit Logs</h3>
        {error && <div className="alert">{error}</div>}
        <button className="btn" onClick={handleExport}>Export CSV</button>
        <table className="table" style={{marginTop:12}}>
          <thead><tr><th>ID</th><th>User</th><th>Role</th><th>Action</th><th>Timestamp</th><th>Details</th></tr></thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.log_id}>
                <td>{l.log_id}</td>
                <td>{l.user_id}</td>
                <td>{l.role}</td>
                <td>{l.action}</td>
                <td>{new Date(l.timestamp).toLocaleString()}</td>
                <td>{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsPage;
