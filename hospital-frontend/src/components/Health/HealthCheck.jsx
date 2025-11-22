import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const HealthCheck = () => {
  const [status, setStatus] = useState("Checking...");
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/healthcheck");
        setStatus(res.data?.status || "OK");
      } catch {
        setStatus("Down");
      }
    })();
  }, []);
  return (
    <div className="card">
      <h4>System Health</h4>
      <p>Status: <strong>{status}</strong></p>
    </div>
  );
};

export default HealthCheck;
