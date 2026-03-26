import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [ordersRes, deliveriesRes] = await Promise.all([
        api.get("/admin/orders/history"),
        api.get("/deliveries")
      ]);
      setOrders(ordersRes.data);
      setDeliveries(deliveriesRes.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadForecast = async () => {
    try {
      const response = await api.get("/admin/forecast");
      setForecast(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load forecast");
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/confirm`);
      setMessage("Order confirmed");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not confirm order");
    }
  };

  const loadRiders = async () => {
    try {
      const response = await api.get("/auth/mock-riders");
      setRiders(response.data);
    } catch (_error) {
      setRiders([]);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  const assignDelivery = async (order_id, rider_id) => {
    if (!rider_id) {
      setMessage("Select a rider first");
      return;
    }

    try {
      await api.post("/deliveries/assign", { order_id, rider_id });
      setMessage("Rider assigned");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not assign rider");
    }
  };

  return (
    <section>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}

      <section className="card">
        <h3>Sales Forecast</h3>
        <button type="button" onClick={loadForecast}>
          Run Forecast
        </button>
        {forecast && (
          <pre>{JSON.stringify(forecast, null, 2)}</pre>
        )}
      </section>

      <section>
        <h3>All Orders</h3>
        <div className="grid">
          {orders.map((order) => (
            <article className="card" key={order._id}>
              <p>Customer: {order.user_id?.name}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total_amount}</p>
              {order.status === "pending" && (
                <button type="button" onClick={() => confirmOrder(order._id)}>
                  Confirm Order
                </button>
              )}
              <button
                type="button"
                onClick={() => assignDelivery(order._id, riders[0]?._id)}
                disabled={riders.length === 0}
              >
                Assign First Rider
              </button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3>Deliveries</h3>
        <div className="grid">
          {deliveries.map((delivery) => (
            <article className="card" key={delivery._id}>
              <p>Order ID: {delivery.order_id?._id}</p>
              <p>Rider: {delivery.rider_id?.name}</p>
              <p>Status: {delivery.status}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default AdminDashboardPage;
