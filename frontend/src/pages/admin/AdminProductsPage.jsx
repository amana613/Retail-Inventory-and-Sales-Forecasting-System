import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProducts();
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

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        setCreating(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // The backend POST /api/products creates a sample product.
        await axios.post('/api/products', {}, config);
        fetchProducts(); // Refresh list to see the new product
      } catch (error) {
        console.error('Failed to create product', error);
        alert('Failed to create product');
      } finally {
        setCreating(false);
      }
    }
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
        <button className="btn btn-primary" onClick={createProductHandler} disabled={creating}>
          <Plus size={18} style={{ marginRight: '8px' }} /> 
          {creating ? 'Creating...' : 'Create Product'}
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>Rs. {product.price ? Number(product.price).toFixed(2) : '0.00'}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-icon" title="Edit coming soon - Use MongoDB Compass for now">
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon danger" onClick={() => deleteHandler(product._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {(!Array.isArray(products) || products.length === 0) && (
            <tr>
              <td colSpan="6">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductsPage;
