import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Package, Users, ShoppingBag, Truck, Flame, TrendingUp, DollarSign } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import './AdminDashboardPage.css';

const SuperAdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSuppliers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/dashboard', config);
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="loading-spinner">Loading dashboard data...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Super Admin Overview</h2>
        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>System Owner View</span>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>Registered Users</h3>
            <p className="stat-value">{dashboardData.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>Products Hosted</h3>
            <p className="stat-value">{dashboardData.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fdf4ff', color: '#9333ea' }}>
            <Truck size={24} />
          </div>
          <div className="stat-details">
            <h3>Global Suppliers</h3>
            <p className="stat-value">{dashboardData.totalSuppliers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">Rs. {dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tables-container" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#64748b" /> Revenue Analytics (Preview)
            </h3>
          </div>
          <div className="chart-placeholder" style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <DollarSign size={40} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#64748b' }}>Integration with live chart libraries incoming.</p>
          </div>
        </div>
        
        <div className="card list-card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#f59e0b" /> Active System Rules
            </h3>
          </div>
          <ul className="action-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: '#334155' }}>Global Order Tracking</span>
                <span className="status-badge success">Online</span>
              </div>
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: '#334155' }}>Rider Dispatches</span>
                <span className="status-badge success">Online</span>
              </div>
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: '#334155' }}>Supplier Imports</span>
                <span className="status-badge warning">Paused</span>
              </div>
            </li>
            <li style={{ padding: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: '#334155' }}>Payment Gateway</span>
                <span className="status-badge success">Testing</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="dashboard-tables-container" style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} /> Global Low Stock Alerts
            </h3>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.lowStockProducts?.map(product => (
                  <tr key={product._id}>
                    <td className="font-medium">{product.name}</td>
                    <td style={{ color: product.stock_qty === 0 ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>{product.stock_qty}</td>
                    <td className="text-muted">{product.low_stock_threshold}</td>
                    <td>
                      <span className={`status-badge`} style={{ backgroundColor: product.stock_qty === 0 ? '#fee2e2' : '#fef3c7', color: product.stock_qty === 0 ? '#991b1b' : '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {product.stock_qty === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!dashboardData?.lowStockProducts || dashboardData.lowStockProducts.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">All products have sufficient stock globally.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
