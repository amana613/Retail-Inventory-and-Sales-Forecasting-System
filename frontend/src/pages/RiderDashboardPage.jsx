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
    <section>
      <h2>Rider Dashboard</h2>
      {message && <p>{message}</p>}
      <div className="grid">
        {deliveries.map((delivery) => (
          <article className="card" key={delivery._id}>
            <p>Order: {delivery.order_id?._id}</p>
            <p>Status: {delivery.status}</p>
            <button type="button" onClick={() => updateStatus(delivery._id, "processing")}>
              Processing
            </button>
            <button type="button" onClick={() => updateStatus(delivery._id, "dispatched")}>
              Dispatched
            </button>
            <button type="button" onClick={() => updateStatus(delivery._id, "delivered")}>
              Delivered
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RiderDashboardPage;
