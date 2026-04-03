import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Trash2, UserPlus } from 'lucide-react';
import './AdminDashboardPage.css'; // Reuse existing admin styles

const SuperAdminAdminsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('/api/admins', config);
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
      };
      await axios.post('/api/admins', isAdmin ? { ...formData, role: 'rider' } : formData, config);
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this admin/rider?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        await axios.delete(`/api/admins/${id}`, config);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{isAdmin ? 'Manage Riders' : 'Manage Personnel (Admins & Riders)'}</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={16} /> 
          {showAddForm ? 'Cancel' : isAdmin ? 'Add Rider' : 'Add Personnel'}
        </button>
      </div>

      <p style={{ marginTop: '-8px', marginBottom: '20px', color: '#64748b' }}>
        {isAdmin
          ? 'Admins can add and manage delivery riders from this page.'
          : 'Super admins can add or manage both administrators and riders.'}
      </p>

      {showAddForm && (
        <div className="admin-form-card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3>{isAdmin ? 'Create New Rider' : 'Create New Administrator or Rider'}</h3>
          <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label>Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Temporary Password</label>
              <input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Role Assignment</label>
              {isAdmin ? (
                <select value="rider" disabled style={{ width: '100%', padding: '8px' }}>
                  <option value="rider">Delivery Rider</option>
                </select>
              ) : (
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                  <option value="admin">Administrator</option>
                  <option value="rider">Delivery Rider</option>
                </select>
              )}
            </div>
            <button type="submit" className="btn-primary" style={{ justifySelf: 'start', backgroundColor: '#e53935' }}>Create Account</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading personnel...</p>
      ) : error ? (
        <p style={{color: 'red'}}>{error}</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id.substring(0, 8)}...</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: u.role === 'admin' ? '#dbe1ff' : '#dcfce7',
                      color: u.role === 'admin' ? '#1e3a8a' : '#166534'
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon danger" onClick={() => handleDelete(u._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No administrators or riders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAdminsPage;



