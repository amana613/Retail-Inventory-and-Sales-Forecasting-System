import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selection, setSelection] = useState({});
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [ordersRes, ridersRes] = await Promise.all([api.get("/orders"), api.get("/auth/mock-riders")]);
    setOrders(ordersRes.data);
    setRiders(ridersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmOrder = async (id) => {
    await api.patch(`/orders/${id}/confirm`);
    setMessage("Order confirmed");
    loadData();
  };

  const cancelOrder = async (id) => {
    await api.patch(`/orders/${id}/cancel`);
    setMessage("Order cancelled");
    loadData();
  };

  const assignRider = async (orderId) => {
    if (!selection[orderId]) {
      setMessage("Select a rider first");
      return;
    }
    await api.post("/deliveries/assign", { order_id: orderId, rider_id: selection[orderId] });
    setMessage("Rider assigned");
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Orders</h2>
        <p>Confirm, cancel, and dispatch orders to riders.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}
      <div className="grid">
        {orders.map((order) => (
          <article className="card" key={order._id}>
            <p><span className="label">Customer</span> {order.user_id?.name}</p>
            <p><span className="label">Status</span> {order.status}</p>
            <p className="metric">${order.total_amount}</p>
            <div className="action-row">
              {order.status === "pending" && <button type="button" onClick={() => confirmOrder(order._id)}>Confirm</button>}
              {order.status !== "cancelled" && <button type="button" onClick={() => cancelOrder(order._id)}>Cancel</button>}
            </div>
            <select value={selection[order._id] || ""} onChange={(e) => setSelection((prev) => ({ ...prev, [order._id]: e.target.value }))}>
              <option value="">Select rider</option>
              {riders.map((rider) => <option key={rider._id} value={rider._id}>{rider.name}</option>)}
            </select>
            <button type="button" onClick={() => assignRider(order._id)}>Assign Rider</button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminOrdersPage;
