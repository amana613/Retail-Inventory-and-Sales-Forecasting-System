import { useEffect, useState } from "react";
import api from "../../services/api";

const initialProduct = { name: "", category: "", price: "", stock_qty: "", supplier_id: "" };

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialProduct);
  const [editingId, setEditingId] = useState("");
  const [stockInput, setStockInput] = useState({});
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [productsRes, suppliersRes] = await Promise.all([api.get("/products"), api.get("/suppliers")]);
    setProducts(productsRes.data);
    setSuppliers(suppliersRes.data);
    if (!form.supplier_id && suppliersRes.data[0]) {
      setForm((prev) => ({ ...prev, supplier_id: suppliersRes.data[0]._id }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price), stock_qty: Number(form.stock_qty) };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product updated");
      } else {
        await api.post("/products", payload);
        setMessage("Product created");
      }
      setForm({ ...initialProduct, supplier_id: suppliers[0]?._id || "" });
      setEditingId("");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save product");
    }
  };

  const editProduct = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock_qty: product.stock_qty,
      supplier_id: product.supplier_id?._id || ""
    });
    setEditingId(product._id);
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadData();
  };

  const updateStock = async (id) => {
    await api.patch(`/products/${id}/stock`, { stock_qty: Number(stockInput[id]) });
    setStockInput((prev) => ({ ...prev, [id]: "" }));
    loadData();
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Products</h2>
        <p>Manage product catalog and stock levels.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}
      <section className="card">
        <h3>{editingId ? "Edit Product" : "Create Product"}</h3>
        <form onSubmit={saveProduct}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required />
          <input type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} required />
          <input type="number" min="0" placeholder="Stock" value={form.stock_qty} onChange={(e) => setForm((prev) => ({ ...prev, stock_qty: e.target.value }))} required />
          <select value={form.supplier_id} onChange={(e) => setForm((prev) => ({ ...prev, supplier_id: e.target.value }))} required>
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option value={supplier._id} key={supplier._id}>{supplier.name}</option>
            ))}
          </select>
          <button type="submit">{editingId ? "Update" : "Create"}</button>
        </form>
      </section>
      <div className="grid">
        {products.map((product) => (
          <article className="card product-card" key={product._id}>
            <h3>{product.name}</h3>
            <p className="muted">{product.category}</p>
            <p className="metric">${product.price}</p>
            <p><span className="label">Stock</span> {product.stock_qty}</p>
            {product.low_stock_alert && <p className="warning">Low stock</p>}
            <p>Supplier: {product.supplier_id?.name || "Unknown"}</p>
            <div className="inline-form">
              <input type="number" min="0" placeholder="Stock" value={stockInput[product._id] || ""} onChange={(e) => setStockInput((prev) => ({ ...prev, [product._id]: e.target.value }))} />
              <button type="button" onClick={() => updateStock(product._id)}>Update Stock</button>
            </div>
            <div className="action-row">
              <button type="button" onClick={() => editProduct(product)}>Edit</button>
              <button type="button" onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminProductsPage;
