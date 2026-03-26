import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);

  const loadDeliveries = async () => {
    const response = await api.get("/deliveries");
    setDeliveries(response.data);
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const updateStatus = async (deliveryId, status) => {
    await api.patch(`/deliveries/${deliveryId}/status`, { status });
    loadDeliveries();
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Deliveries</h2>
        <p>Track and update delivery workflow.</p>
      </header>
      <div className="grid">
        {deliveries.map((delivery) => (
          <article className="card" key={delivery._id}>
            <p><span className="label">Order</span> {delivery.order_id?._id}</p>
            <p><span className="label">Rider</span> {delivery.rider_id?.name}</p>
            <p><span className="label">Status</span> {delivery.status}</p>
            <select value={delivery.status} onChange={(e) => updateStatus(delivery._id, e.target.value)}>
              <option value="processing">processing</option>
              <option value="dispatched">dispatched</option>
              <option value="delivered">delivered</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminDeliveriesPage;
