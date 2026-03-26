import { useEffect, useState } from "react";
import api from "../../services/api";

const RiderOverviewPage = () => {
  const [stats, setStats] = useState({ total: 0, processing: 0, dispatched: 0, delivered: 0 });

  useEffect(() => {
    const load = async () => {
      const response = await api.get("/deliveries/my");
      const deliveries = response.data;
      setStats({
        total: deliveries.length,
        processing: deliveries.filter((item) => item.status === "processing").length,
        dispatched: deliveries.filter((item) => item.status === "dispatched").length,
        delivered: deliveries.filter((item) => item.status === "delivered").length
      });
    };

    load();
  }, []);

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Rider Overview</h2>
        <p>Track your active and completed deliveries.</p>
      </header>
      <div className="kpi-grid">
        <article className="kpi-card"><h3>Total</h3><p>{stats.total}</p></article>
        <article className="kpi-card"><h3>Processing</h3><p>{stats.processing}</p></article>
        <article className="kpi-card"><h3>Dispatched</h3><p>{stats.dispatched}</p></article>
        <article className="kpi-card"><h3>Delivered</h3><p>{stats.delivered}</p></article>
      </div>
    </section>
  );
};

export default RiderOverviewPage;
