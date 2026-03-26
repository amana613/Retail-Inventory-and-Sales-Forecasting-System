import { useEffect, useState } from "react";
import api from "../services/api";

const RiderDashboardPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [message, setMessage] = useState("");

  const loadDeliveries = async () => {
    try {
      const response = await api.get("/deliveries/my");
      setDeliveries(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load deliveries");
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const updateStatus = async (deliveryId, status) => {
    try {
      await api.patch(`/deliveries/${deliveryId}/status`, { status });
      setMessage("Delivery status updated");
      loadDeliveries();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update status");
    }
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Rider Dispatch Board</h2>
        <p>View assigned deliveries and move orders from processing to delivered.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}
      <div className="grid">
        {deliveries.map((delivery) => (
          <article className="card" key={delivery._id}>
            <p><span className="label">Order</span> {delivery.order_id?._id}</p>
            <p><span className="label">Status</span> {delivery.status}</p>
            <div className="action-row">
              <button type="button" onClick={() => updateStatus(delivery._id, "processing")}>
                Processing
              </button>
              <button type="button" onClick={() => updateStatus(delivery._id, "dispatched")}>
                Dispatched
              </button>
              <button type="button" onClick={() => updateStatus(delivery._id, "delivered")}>
                Delivered
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RiderDashboardPage;
