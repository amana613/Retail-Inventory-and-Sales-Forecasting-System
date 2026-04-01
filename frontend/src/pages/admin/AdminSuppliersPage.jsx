import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import './AdminProductsPage.css'; // Reusing styles

const AdminSuppliersPage = () => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/suppliers', config);
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createSupplierHandler = async () => {
    const name = prompt('Enter Supplier Name:');
    if (!name) return;
    const contactPerson = prompt('Enter Contact Person:');
    const email = prompt('Enter Email:');
    const phone = prompt('Enter Phone:');

    try {
      setCreating(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/suppliers', { name, contactPerson, email, phone }, config);
      fetchSuppliers();
    } catch (error) {
      console.error('Failed to create supplier', error);
      alert('Failed to create supplier');
    } finally {
      setCreating(false);
    }
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
        <button className="btn btn-primary" onClick={createSupplierHandler} disabled={creating}>
          <Plus size={18} style={{ marginRight: '8px' }} /> 
          {creating ? 'Creating...' : 'Add Supplier'}
        </button>
      </div>

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
              <td>{supplier._id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.contactPerson}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phone}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-icon danger" onClick={() => deleteHandler(supplier._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan="6">No suppliers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSuppliersPage;
