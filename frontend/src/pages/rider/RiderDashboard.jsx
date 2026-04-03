import React, { useState, useEffect, useContext } from "react";
import {
  MapPin,
  PhoneCall,
  CheckCircle,
  Navigation,
  Package,
  DollarSign,
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import "../admin/AdminDashboardPage.css"; // Reusing admin dashboard styling
import "./RiderDashboard.css";

const RiderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/orders", config);
        setAllOrders(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching deliveries");
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) {
      fetchDeliveries();
    }
  }, [user]);

  const handleUpdateStatus = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      setAllOrders((orders) =>
        orders.map((o) =>
          o._id === id
            ? {
                ...o,
                isDelivered: true,
                status: "delivered",
                deliveredAt: new Date().toISOString(),
              }
            : o,
        ),
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      setAllOrders((orders) =>
        orders.map((o) => {
          if (o._id === id) {
            return {
              ...o,
              status,
              isDelivered: status === "delivered",
              deliveredAt:
                status === "delivered"
                  ? new Date().toISOString()
                  : o.deliveredAt,
            };
          }
          return o;
        }),
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  const pendingOrders = allOrders.filter((o) => !o.isDelivered);
  const completedOrders = allOrders.filter((o) => o.isDelivered);
  const cashToCollect = pendingOrders
    .filter((o) => !o.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className="admin-page rider-dashboard" style={{ padding: "20px" }}>
      <div className="admin-page-header">
        <div>
          <h2>Rider Overview</h2>
          <p>Welcome back, {user.name}. Here are your delivery assignments.</p>
        </div>
      </div>

      {/* Stats Overview comparable to Admin Dashboard */}
      <div
        className="dashboard-stats"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
            }}
          >
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Assigned</h3>
            <p className="stat-value">{allOrders.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              color: "#f59e0b",
            }}
          >
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <h3>Pending Deliveries</h3>
            <p className="stat-value">{pendingOrders.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
            }}
          >
            <CheckCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>Completed</h3>
            <p className="stat-value">{completedOrders.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
            }}
          >
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <h3>Cash to Collect</h3>
            <p className="stat-value">Rs. {cashToCollect.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{ gridTemplateColumns: "1fr", marginTop: "2rem" }}
      >
        <div className="recent-orders-card card">
          <div
            className="card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3>Active Assignments ({pendingOrders.length})</h3>
            <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
              Pull to refresh not supported
            </span>
          </div>

          <div
            className="delivery-list"
            style={{ display: "grid", gap: "1rem" }}
          >
            {pendingOrders.length === 0 ? (
              <Message variant="info">
                No active assignments right now. Take a break!
              </Message>
            ) : (
              pendingOrders.map((delivery) => (
                <div
                  key={delivery._id}
                  className="delivery-card"
                  style={{
                    background: "var(--bg-light)",
                    padding: "1.25rem",
                    borderRadius: "var(--border-radius)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-light)",
                          marginBottom: "0.25rem",
                          fontWeight: 600,
                        }}
                      >
                        Order #
                        {delivery._id
                          .substring(delivery._id.length - 6)
                          .toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          color: "#1e293b",
                        }}
                      >
                        {delivery.user ? delivery.user.name : "Unknown User"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        alignItems: "flex-end",
                      }}
                    >
                      <StatusBadge
                        status={delivery.isPaid ? "success" : "danger"}
                        text={delivery.isPaid ? "Paid" : "Unpaid (COD)"}
                      />
                      <select
                        value={delivery.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(delivery._id, e.target.value)
                        }
                        disabled={["pending", "processing"].includes(
                          delivery.status,
                        )}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          border: "1px solid var(--border-color)",
                          background: "var(--white)",
                          outline: "none",
                          cursor: ["pending", "processing"].includes(
                            delivery.status,
                          )
                            ? "not-allowed"
                            : "pointer",
                          fontWeight: 600,
                          color: "var(--text-dark)",
                          opacity: ["pending", "processing"].includes(
                            delivery.status,
                          )
                            ? 0.6
                            : 1,
                        }}
                        title={
                          ["pending", "processing"].includes(delivery.status)
                            ? "Waiting for Warehouse Dispatch"
                            : "Update Delivery Status"
                        }
                      >
                        {["pending", "processing"].includes(
                          delivery.status,
                        ) && (
                          <>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                          </>
                        )}
                        <option value="dispatched">Dispatched</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <MapPin
                        size={18}
                        color="var(--primary-red)"
                        style={{ marginTop: "2px", flexShrink: 0 }}
                      />
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: "#334155",
                          }}
                        >
                          {delivery.shippingAddress.address}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "var(--text-light)",
                          }}
                        >
                          {delivery.shippingAddress.city},{" "}
                          {delivery.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      <Package size={18} color="var(--text-light)" />
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-light)",
                          fontWeight: 500,
                        }}
                      >
                        {delivery.orderItems.length} items • Rs.{" "}
                        {delivery.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rider-actions"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <a
                      href={`tel:${delivery.user?.phone || "1234567890"}`}
                      className="btn btn-outline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        flex: 1,
                      }}
                    >
                      <PhoneCall size={16} /> Call
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${delivery.shippingAddress.address}, ${delivery.shippingAddress.city}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        flex: 1,
                      }}
                    >
                      <Navigation size={16} /> Route
                    </a>

                    {delivery.status === "in-transit" ? (
                      <button
                        className="btn btn-success"
                        style={{
                          gridColumn: "span 2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "12px",
                        }}
                        onClick={() => handleUpdateStatus(delivery._id)}
                      >
                        <CheckCircle size={18} /> Mark as Delivered
                      </button>
                    ) : delivery.status === "dispatched" ? (
                      <button
                        className="btn"
                        style={{
                          gridColumn: "span 2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          background: "#3b82f6",
                          color: "#fff",
                          padding: "12px",
                        }}
                        onClick={() =>
                          handleStatusChange(delivery._id, "in-transit")
                        }
                      >
                        <Clock size={18} /> Start Delivery (In Transit)
                      </button>
                    ) : (
                      <button
                        className="btn"
                        disabled
                        style={{
                          gridColumn: "span 2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          background: "#e2e8f0",
                          color: "#94a3b8",
                          padding: "12px",
                          cursor: "not-allowed",
                        }}
                      >
                        <Clock size={18} /> Waiting for Warehouse Dispatch
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Completed Deliveries */}
        {completedOrders.length > 0 && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Newly Completed Deliveries</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {completedOrders.slice(0, 5).map((delivery) => (
                <div
                  key={delivery._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: "#f8fafc",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      Order #
                      {delivery._id
                        .substring(delivery._id.length - 6)
                        .toUpperCase()}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {new Date(delivery.deliveredAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontWeight: "bold", color: "#10b981" }}>
                    Rs. {delivery.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
