import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = { name: "", contact_email: "", phone: "", address: "" };

const AdminSuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const loadSuppliers = async () => {
    const response = await api.get("/suppliers");
    setSuppliers(response.data);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const saveSupplier = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, form);
        setMessage("Supplier updated");
      } else {
        await api.post("/suppliers", form);
        setMessage("Supplier created");
      }
      setForm(initialForm);
      setEditingId("");
      loadSuppliers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save supplier");
    }
  };

  const editSupplier = (supplier) => {
    setForm({
      name: supplier.name || "",
      contact_email: supplier.contact_email || "",
      phone: supplier.phone || "",
      address: supplier.address || ""
    });
    setEditingId(supplier._id);
  };

  const deleteSupplier = async (id) => {
    await api.delete(`/suppliers/${id}`);
    loadSuppliers();
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Suppliers</h2>
        <p>Create, edit, and remove suppliers.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}
      <section className="card">
        <h3>{editingId ? "Edit Supplier" : "Create Supplier"}</h3>
        <form onSubmit={saveSupplier}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          <input placeholder="Email" value={form.contact_email} onChange={(e) => setForm((prev) => ({ ...prev, contact_email: e.target.value }))} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
          <button type="submit">{editingId ? "Update" : "Create"}</button>
        </form>
      </section>
      <div className="grid">
        {suppliers.map((supplier) => (
          <article className="card" key={supplier._id}>
            <h3>{supplier.name}</h3>
            <p>{supplier.contact_email || "No email"}</p>
            <p>{supplier.phone || "No phone"}</p>
            <div className="action-row">
              <button type="button" onClick={() => editSupplier(supplier)}>Edit</button>
              <button type="button" onClick={() => deleteSupplier(supplier._id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminSuppliersPage;
