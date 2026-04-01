import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
    low_stock_threshold: '',
    supplier: '',
    image: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      if (!user) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/suppliers', config);
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch suppliers', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitProductHandler = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.supplier) {
      alert('Name, Price, and Supplier are required.');
      return;
    }

    try {
      setCreating(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (editId) {
        await axios.put(`/api/products/${editId}`, formData, config);
      } else {
        await axios.post('/api/products', formData, config);
      }
      
      fetchProducts();
      setShowForm(false);
      setEditId(null);
      setFormData({ name: '', brand: '', category: '', description: '', price: '', countInStock: '', low_stock_threshold: '', supplier: '', image: '' });
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product:\n' + (error.response?.data?.message || error.message) + '\n' + (error.response?.data?.error || ''));
    } finally {
      setCreating(false);
    }
  };

  const editProductHandler = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || '',
      countInStock: product.stock_qty || product.countInStock || '',
      low_stock_threshold: product.low_stock_threshold || '',
      supplier: product.supplier_id?._id || product.supplier_id || product.supplier || '',
      image: product.image_url || product.image || '',
    });
    setShowForm(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div>Loading Products...</div>;

  return (
    <div className="admin-products-page">
      <div className="header-actions">
        <h1>Product Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => {
            setEditId(null);
            setFormData({ name: '', brand: '', category: '', description: '', price: '', countInStock: '', low_stock_threshold: '', supplier: '', image: '' });
            setShowForm(true);
          }} disabled={creating} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 16px', borderRadius: '6px', border: '1px solid #000', backgroundColor: '#000', color: '#fff' }}>
            <Plus size={18} />
            <span style={{color: '#fff'}}>Create Product</span>
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: '24px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>{editId ? 'Edit Product' : 'Create New Product'}</h3>
            <button className="btn-icon" onClick={() => setShowForm(false)} title="Close">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={submitProductHandler}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. Wireless Mouse" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. Logitech" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. Electronics" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="0.00" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Stock Count</label>
                <input type="number" name="countInStock" value={formData.countInStock} onChange={handleInputChange} min="0" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. 100" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Low Stock Threshold</label>
                <input type="number" name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleInputChange} min="0" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. 10" title="The system will alert you when stock falls below this number" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Supplier *</label>
                <select name="supplier" value={formData.supplier} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff' }}>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Web Image URL</label>
                <input type="url" name="image" value={formData.image} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="https://example.com/image.jpg" />
                {formData.image && (
                  <div style={{ marginTop: '10px' }}>
                     <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Image Preview:</p>
                     <img src={formData.image} alt="Preview" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                     <p style={{ display: 'none', color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>Invalid Image URL</p>
                  </div>
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} placeholder="Product description..." />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', color: '#475569' }}>
                Cancel
              </button>
              <button type="submit" disabled={creating} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#10b981', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Save size={16} /> {creating ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>IMG</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>STOCK</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.map((product) => (
            <tr key={product._id}>
              <td><span style={{ fontFamily: 'monospace', color: '#64748b' }}>#{product._id.substring(product._id.length - 6).toUpperCase()}</span></td>
              <td>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product.image_url ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>None</span>}
                </div>
              </td>
              <td style={{ fontWeight: 500 }}>{product.name}</td>
              <td>Rs. {product.price ? Number(product.price).toFixed(2) : '0.00'}</td>
              <td>{product.category || '-'}</td>
              <td>{product.brand || '-'}</td>
              <td>
                <span className={`status-badge ${product.stock_qty > 10 ? 'success' : product.stock_qty > 0 ? 'warning' : 'danger'}`}>
                  {product.stock_qty || 0}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn-icon" onClick={() => editProductHandler(product)} title="Edit Product">
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon danger" onClick={() => deleteHandler(product._id)} title="Delete Product">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {(!Array.isArray(products) || products.length === 0) && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductsPage;
