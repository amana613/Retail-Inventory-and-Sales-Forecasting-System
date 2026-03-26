import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboardPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [message, setMessage] = useState("");
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact_email: "",
    phone: "",
    address: ""
  });
  const [editingSupplierId, setEditingSupplierId] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock_qty: "",
    supplier_id: ""
  });
  const [editingProductId, setEditingProductId] = useState("");
  const [riderSelection, setRiderSelection] = useState({});
  const [stockInput, setStockInput] = useState({});

  const loadData = async () => {
    try {
      const [
        suppliersRes,
        productsRes,
        ordersRes,
        deliveriesRes,
        ridersRes,
        paymentsRes
      ] = await Promise.all([
        api.get("/suppliers"),
        api.get("/products"),
        api.get("/admin/orders/history"),
        api.get("/deliveries"),
        api.get("/auth/mock-riders"),
        api.get("/payments")
      ]);

      setSuppliers(suppliersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setDeliveries(deliveriesRes.data);
      setRiders(ridersRes.data);
      setPayments(paymentsRes.data);

      if (!productForm.supplier_id && suppliersRes.data.length > 0) {
        setProductForm((prev) => ({ ...prev, supplier_id: suppliersRes.data[0]._id }));
      }
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

  const saveSupplier = async (event) => {
    event.preventDefault();

    try {
      if (editingSupplierId) {
        await api.put(`/suppliers/${editingSupplierId}`, supplierForm);
        setMessage("Supplier updated");
      } else {
        await api.post("/suppliers", supplierForm);
        setMessage("Supplier created");
      }

      setSupplierForm({ name: "", contact_email: "", phone: "", address: "" });
      setEditingSupplierId("");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save supplier");
    }
  };

  const editSupplier = (supplier) => {
    setSupplierForm({
      name: supplier.name || "",
      contact_email: supplier.contact_email || "",
      phone: supplier.phone || "",
      address: supplier.address || ""
    });
    setEditingSupplierId(supplier._id);
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await api.delete(`/suppliers/${supplierId}`);
      setMessage("Supplier deleted");
      if (editingSupplierId === supplierId) {
        setEditingSupplierId("");
        setSupplierForm({ name: "", contact_email: "", phone: "", address: "" });
      }
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete supplier");
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock_qty: Number(productForm.stock_qty)
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        setMessage("Product updated");
      } else {
        await api.post("/products", payload);
        setMessage("Product created");
      }

      setProductForm({
        name: "",
        category: "",
        price: "",
        stock_qty: "",
        supplier_id: suppliers[0]?._id || ""
      });
      setEditingProductId("");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save product");
    }
  };

  const editProduct = (product) => {
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      stock_qty: product.stock_qty ?? "",
      supplier_id: product.supplier_id?._id || ""
    });
    setEditingProductId(product._id);
  };

  const deleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setMessage("Product deleted");
      if (editingProductId === productId) {
        setEditingProductId("");
      }
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete product");
    }
  };

  const updateStock = async (productId) => {
    const qty = Number(stockInput[productId]);
    if (Number.isNaN(qty) || qty < 0) {
      setMessage("Enter a valid stock quantity");
      return;
    }

    try {
      await api.patch(`/products/${productId}/stock`, { stock_qty: qty });
      setMessage("Stock updated");
      setStockInput((prev) => ({ ...prev, [productId]: "" }));
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update stock");
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

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setMessage("Order cancelled");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not cancel order");
    }
  };

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

  const updateDeliveryStatus = async (deliveryId, status) => {
    try {
      await api.patch(`/deliveries/${deliveryId}/status`, { status });
      setMessage("Delivery status updated");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update delivery status");
    }
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Admin Command Center</h2>
        <p>Oversee suppliers, inventory, orders, payments, riders, and demand forecasts.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}

      <section className="card">
        <h3>Sales Forecast</h3>
        <button type="button" onClick={loadForecast}>
          Run Forecast
        </button>
        {forecast && (
          <pre>{JSON.stringify(forecast, null, 2)}</pre>
        )}
      </section>

      <section className="split-grid">
        <article className="card">
          <h3>{editingSupplierId ? "Edit Supplier" : "Create Supplier"}</h3>
          <form onSubmit={saveSupplier}>
            <input
              placeholder="Name"
              value={supplierForm.name}
              onChange={(e) => setSupplierForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              placeholder="Email"
              value={supplierForm.contact_email}
              onChange={(e) =>
                setSupplierForm((prev) => ({ ...prev, contact_email: e.target.value }))
              }
            />
            <input
              placeholder="Phone"
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <input
              placeholder="Address"
              value={supplierForm.address}
              onChange={(e) => setSupplierForm((prev) => ({ ...prev, address: e.target.value }))}
            />
            <button type="submit">{editingSupplierId ? "Update Supplier" : "Add Supplier"}</button>
          </form>
        </article>

        <article className="card">
          <h3>{editingProductId ? "Edit Product" : "Create Product"}</h3>
          <form onSubmit={saveProduct}>
            <input
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              placeholder="Category"
              value={productForm.category}
              onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Stock"
              value={productForm.stock_qty}
              onChange={(e) => setProductForm((prev) => ({ ...prev, stock_qty: e.target.value }))}
              required
            />
            <select
              value={productForm.supplier_id}
              onChange={(e) => setProductForm((prev) => ({ ...prev, supplier_id: e.target.value }))}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <button type="submit">{editingProductId ? "Update Product" : "Add Product"}</button>
          </form>
        </article>
      </section>

      <section>
        <h3>Suppliers</h3>
        <div className="grid">
          {suppliers.map((supplier) => (
            <article className="card" key={supplier._id}>
              <p><strong>{supplier.name}</strong></p>
              <p className="muted">{supplier.contact_email || "No email"}</p>
              <p>{supplier.phone || "No phone"}</p>
              <button type="button" onClick={() => editSupplier(supplier)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteSupplier(supplier._id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3>Products</h3>
        <div className="grid">
          {products.map((product) => (
            <article className="card product-card" key={product._id}>
              <p><strong>{product.name}</strong></p>
              <p className="muted">{product.category}</p>
              <p className="metric">${product.price}</p>
              <p><span className="label">Stock</span> {product.stock_qty}</p>
              <p>Supplier: {product.supplier_id?.name || "Unknown"}</p>
              {product.low_stock_alert && <p className="warning">Low stock alert</p>}
              <div className="inline-form">
                <input
                  type="number"
                  min="0"
                  placeholder="New stock"
                  value={stockInput[product._id] || ""}
                  onChange={(e) =>
                    setStockInput((prev) => ({ ...prev, [product._id]: e.target.value }))
                  }
                />
                <button type="button" onClick={() => updateStock(product._id)}>
                  Update Stock
                </button>
              </div>
              <button type="button" onClick={() => editProduct(product)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteProduct(product._id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
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

              {order.status !== "cancelled" && (
                <button type="button" onClick={() => cancelOrder(order._id)}>
                  Cancel Order
                </button>
              )}

              <select
                value={riderSelection[order._id] || ""}
                onChange={(e) =>
                  setRiderSelection((prev) => ({ ...prev, [order._id]: e.target.value }))
                }
              >
                <option value="">Select Rider</option>
                {riders.map((rider) => (
                  <option key={rider._id} value={rider._id}>
                    {rider.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => assignDelivery(order._id, riderSelection[order._id])}>
                Assign Rider
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
              <select
                value={delivery.status}
                onChange={(e) => updateDeliveryStatus(delivery._id, e.target.value)}
              >
                <option value="processing">processing</option>
                <option value="dispatched">dispatched</option>
                <option value="delivered">delivered</option>
              </select>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3>Payments</h3>
        <div className="grid">
          {payments.map((payment) => (
            <article className="card" key={payment._id}>
              <p><strong>Order:</strong> {payment.order_id?._id}</p>
              <p><strong>Amount:</strong> ${payment.amount}</p>
              <p><strong>Method:</strong> {payment.method}</p>
              <p><strong>Status:</strong> {payment.status}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default AdminDashboardPage;
