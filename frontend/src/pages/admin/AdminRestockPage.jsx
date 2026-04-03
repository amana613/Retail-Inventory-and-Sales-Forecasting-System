import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  PackageOpen,
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import "./AdminDashboardPage.css"; // Reuse styles

const AdminRestockPage = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/products");
      // Filter products that hit low stock threshold
      const lowStock = data
        .filter((p) => p.stock_qty <= p.low_stock_threshold)
        .sort((a, b) => a.stock_qty - b.stock_qty);
      setProducts(lowStock);
    } catch (error) {
      console.error("Failed to fetch products", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (id, value) => {
    setRestockAmounts({ ...restockAmounts, [id]: value });
  };

  const handleRestock = async (product) => {
    const amountToAdd = Number(restockAmounts[product._id]);
    if (!amountToAdd || amountToAdd <= 0) {
      alert("Please enter a valid amount to restock.");
      return;
    }

    if (window.confirm(`Restock ${product.name} with ${amountToAdd} units?`)) {
      setProcessing((prev) => ({ ...prev, [product._id]: true }));
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const updatedStock = product.stock_qty + amountToAdd;

        // We only update the stock count here instead of the entire product
        // Using existing updateProduct endpoint
        await axios.put(
          `/api/products/${product._id}`,
          { countInStock: updatedStock },
          config,
        );

        // Clear input
        setRestockAmounts({ ...restockAmounts, [product._id]: "" });

        // Refresh products list
        await fetchProducts();
      } catch (error) {
        console.error("Failed to restock product", error);
        alert("Failed to restock product");
      } finally {
        setProcessing((prev) => ({ ...prev, [product._id]: false }));
      }
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading restock data...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2
            style={{
              color: "#1e293b",
              fontWeight: 700,
              fontSize: "1.75rem",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <PackageOpen size={28} color="#f59e0b" /> Restocking Management
          </h2>
          <p className="text-muted">
            Review and restock products below their inventory thresholds.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={fetchProducts}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Restock Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={
                          product.image_url ||
                          product.image ||
                          "https://via.placeholder.com/40"
                        }
                        alt={product.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">
                    {product.supplier_id?.name || "Unknown"}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: product.stock_qty === 0 ? "#ef4444" : "#f59e0b",
                      }}
                    >
                      {product.stock_qty}
                    </span>
                  </td>
                  <td className="text-muted">{product.low_stock_threshold}</td>
                  <td>
                    {product.stock_qty === 0 ? (
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: "#fee2e2",
                          color: "#991b1b",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          width: "fit-content",
                        }}
                      >
                        <AlertTriangle size={14} /> Out of Stock
                      </span>
                    ) : (
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          width: "fit-content",
                        }}
                      >
                        <AlertTriangle size={14} /> Low Stock
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="number"
                        min="1"
                        placeholder="+ Qty"
                        value={restockAmounts[product._id] || ""}
                        onChange={(e) =>
                          handleAmountChange(product._id, e.target.value)
                        }
                        style={{
                          width: "80px",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                          outline: "none",
                        }}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRestock(product)}
                        disabled={processing[product._id]}
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        {processing[product._id] ? "Updating..." : "Add Stock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6"
                    style={{
                      color: "#10b981",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle size={48} opacity={0.5} />
                    <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                      All products are well stocked! No action needed.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRestockPage;
