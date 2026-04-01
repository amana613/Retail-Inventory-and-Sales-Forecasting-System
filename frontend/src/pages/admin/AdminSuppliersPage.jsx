import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Plus, Trash2, X, Save } from 'lucide-react';
import './AdminProductsPage.css'; // Reusing styles

const AdminSuppliersPage = () => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/suppliers', config);
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitSupplierHandler = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Supplier name is required.');
      return;
    }

    try {
      setCreating(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (editId) {
        await axios.put(`/api/suppliers/${editId}`, formData, config);
      } else {
        await axios.post('/api/suppliers', formData, config);
      }
      
      fetchSuppliers();
      setShowForm(false);
      setEditId(null);
      setFormData({ name: '', contactPerson: '', email: '', phone: '' });
    } catch (error) {
      console.error('Failed to save supplier', error);
      alert('Failed to save supplier:\n' + (error.response?.data?.message || error.message));
    } finally {
      setCreating(false);
    }
  };

  const editSupplierHandler = (supplier) => {
    setEditId(supplier._id);
    setFormData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
    });
    setShowForm(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/suppliers/${id}`, config);
        fetchSuppliers();
      } catch (error) {
        console.error('Failed to delete supplier', error);
        alert('Failed to delete supplier');
      }
    }
  };

  if (loading) return <div>Loading Suppliers...</div>;

  return (
    <div className="admin-products-page">
      <div className="header-actions">
        <h1>Supplier Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => {
            setEditId(null);
            setFormData({ name: '', contactPerson: '', email: '', phone: '' });
            setShowForm(true);
          }} disabled={creating} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 16px', borderRadius: '6px', border: '1px solid #000', backgroundColor: '#000', color: '#fff' }}>
            <Plus size={18} />
            <span style={{color: '#fff'}}>Add Supplier</span>
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: '24px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>{editId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
            <button className="btn-icon" onClick={() => setShowForm(false)} title="Close">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={submitSupplierHandler}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Supplier Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  placeholder="e.g. Acme Corp" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Contact Person</label>
                <input 
                  type="text" 
                  name="contactPerson" 
                  value={formData.contactPerson} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  placeholder="e.g. info@acme.com" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  placeholder="e.g. 555-0198" 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', color: '#475569' }}>
                Cancel
              </button>
              <button type="submit" disabled={creating} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#10b981', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Save size={16} /> {creating ? 'Saving...' : 'Save Supplier'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>CONTACT PERSON</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td><span style={{ fontFamily: 'monospace', color: '#64748b' }}>#{supplier._id.substring(supplier._id.length - 6).toUpperCase()}</span></td>
              <td style={{ fontWeight: 500 }}>{supplier.name}</td>
              <td>{supplier.contactPerson}</td>
              <td>{supplier.email || '-'}</td>
              <td>{supplier.phone || '-'}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-icon" onClick={() => editSupplierHandler(supplier)} title="Edit Supplier">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                  <button className="btn-icon danger" onClick={() => deleteHandler(supplier._id)} title="Delete Supplier">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No suppliers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSuppliersPage;
