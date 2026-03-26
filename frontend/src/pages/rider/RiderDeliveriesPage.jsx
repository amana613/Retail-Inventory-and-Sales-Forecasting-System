import { useEffect, useState } from "react";
import api from "../../services/api";

const RiderDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [message, setMessage] = useState("");

  const loadDeliveries = async () => {
    const response = await api.get("/deliveries/my");
    setDeliveries(response.data);
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const updateStatus = async (deliveryId, status) => {
    try {
      await api.patch(`/deliveries/${deliveryId}/status`, { status });
      setMessage("Delivery updated");
      loadDeliveries();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update delivery");
    }
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>My Deliveries</h2>
        <p>Update each assigned delivery through the workflow.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}
      <div className="grid">
        {deliveries.map((delivery) => (
          <article className="card" key={delivery._id}>
            <p><span className="label">Order</span> {delivery.order_id?._id}</p>
            <p><span className="label">Status</span> {delivery.status}</p>
            <div className="action-row">
              <button type="button" onClick={() => updateStatus(delivery._id, "processing")}>Processing</button>
              <button type="button" onClick={() => updateStatus(delivery._id, "dispatched")}>Dispatched</button>
              <button type="button" onClick={() => updateStatus(delivery._id, "delivered")}>Delivered</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RiderDeliveriesPage;
