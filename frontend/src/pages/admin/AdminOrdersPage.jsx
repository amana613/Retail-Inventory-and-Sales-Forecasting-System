import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Modal from "../../components/Modal";
import "./AdminProductsPage.css"; // Reusing styles

const AdminOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get("/api/orders", config);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      if (ridersLoaded) {
        setLoading(false);
      }
    }
  };

  const [ridersLoaded, setRidersLoaded] = useState(false);

  const fetchRiders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get("/api/admins/riders", config);
      setRiders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch riders", error);
    } finally {
      setRidersLoaded(true);
      setLoading(false); // Can be simplified
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        config,
      );
      fetchOrders(); // Refresh to reflect changes
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const handleRiderAssignment = async (orderId, riderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${orderId}/assign`, { riderId }, config);
      fetchOrders(); // Refresh to reflect changes
    } catch (error) {
      console.error("Failed to assign rider", error);
      alert("Failed to assign rider");
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    if (window.confirm("Are you sure you want to mark this order as paid?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`/api/orders/${orderId}/pay`, {}, config);
        fetchOrders();
      } catch (error) {
        console.error("Failed to mark as paid", error);
        alert("Failed to mark order as paid");
      }
    }
  };

  const handleViewReceipt = (receiptUrl) => {
    setSelectedReceipt(receiptUrl);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
        <Loader text="Loading order data..." />
      </div>
    );
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="admin-products-page">
      <div className="header-actions">
        <h1>Order Management</h1>
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <table className="admin-table">
          <thead>
            <tr style={{ background: "#f8fafc", color: "#64748b" }}>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYMENT / RECEIPT</th>
              <th>STATUS / DISPATCH</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ fontWeight: "500" }}>
                  #{order._id.substring(0, 8)}
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{ fontWeight: "500", color: "var(--text-dark)" }}
                    >
                      {order.user && order.user.name}
                    </span>
                  </div>
                </td>
                <td style={{ color: "var(--text-muted)" }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ fontWeight: "600" }}>
                  Rs. {order.totalPrice.toFixed(2)}
                </td>

                {/* PAYMENT BLOCK */}
                <td>
                  {order.isPaid ? (
                    <StatusBadge type="payment" status="paid" />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        alignItems: "flex-start",
                      }}
                    >
                      <StatusBadge type="payment" status="not paid" />
                      <div style={{ display: "flex", gap: "6px" }}>
                        {order.receiptImage ? (
                          <button
                            onClick={() =>
                              handleViewReceipt(order.receiptImage)
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                              background: "#f8fafc",
                              color: "#475569",
                              border: "1px solid #cbd5e1",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            title="View customer uploaded receipt"
                          >
                            <FileText size={14} /> View
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleMarkAsPaid(order._id)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Verify & Mark Paid
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                {/* DISPATCH BLOCK */}
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <StatusBadge type="order" status={order.status} />
                    <div style={{ display: "flex", gap: "6px" }}>
                      <select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={["in-transit", "delivered"].includes(
                          order.status,
                        )}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          border: "1px solid #cbd5e1",
                          background: "#f8fafc",
                          outline: "none",
                          cursor: ["in-transit", "delivered"].includes(
                            order.status,
                          )
                            ? "not-allowed"
                            : "pointer",
                          opacity: ["in-transit", "delivered"].includes(
                            order.status,
                          )
                            ? 0.7
                            : 1,
                        }}
                        title={
                          ["in-transit", "delivered"].includes(order.status)
                            ? "Status is now tracked by the assigned rider"
                            : "Update order status up to dispatch"
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="cancelled">Cancelled</option>
                        {["in-transit", "delivered"].includes(order.status) && (
                          <option value={order.status}>
                            {order.status === "in-transit"
                              ? "In Transit"
                              : "Delivered"}
                          </option>
                        )}
                      </select>

                      <select
                        value={
                          order.rider ? order.rider._id || order.rider : ""
                        }
                        onChange={(e) =>
                          handleRiderAssignment(order._id, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          border: "1px solid #cbd5e1",
                          background: "#f8fafc",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">+ Assign Rider</option>
                        {riders.map((rider) => (
                          <option key={rider._id} value={rider._id}>
                            {rider.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </td>

                {/* ACTIONS */}
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/order/${order._id}`)}
                      title="View Order Details"
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        padding: "6px",
                      }}
                    >
                      <Eye size={18} color="#64748b" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "4rem 2rem" }}
                >
                  <Message variant="info">
                    No orders found matching current criteria.
                  </Message>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Payment Receipt"
      >
        <div
          style={{ display: "flex", justifyContent: "center", padding: "10px" }}
        >
          {selectedReceipt ? (
            <img
              src={selectedReceipt}
              alt="Payment Receipt"
              style={{
                maxWidth: "100%",
                maxHeight: "600px",
                borderRadius: "8px",
                objectFit: "contain",
                border: "1px solid #f1f5f9",
              }}
            />
          ) : (
            <p>No valid receipt provided.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
