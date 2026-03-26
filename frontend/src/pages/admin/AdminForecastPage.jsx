import { useState } from "react";
import api from "../../services/api";

const AdminForecastPage = () => {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const runForecast = async () => {
    try {
      const response = await api.get("/admin/forecast");
      setResult(response.data);
      setMessage("Forecast generated");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not run forecast");
    }
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Sales Forecast</h2>
        <p>Generate predicted demand from sales history.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}
      <section className="card">
        <button type="button" onClick={runForecast}>Run Forecast</button>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </section>
    </section>
  );
};

export default AdminForecastPage;
