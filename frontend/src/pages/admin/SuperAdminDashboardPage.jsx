import React from 'react';
import { Package, Users, ShoppingBag, Truck, Flame, TrendingUp } from 'lucide-react';
import './AdminDashboardPage.css';

const SuperAdminDashboardPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 style={{ fontSize: '1.8rem', color: '#1f2937' }}>Super Admin Overview</h2>
        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>System Owner View</span>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#0369a1' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>Administrators</h3>
            <p className="stat-value">Active</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#059669' }}>
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>Products</h3>
            <p className="stat-value">System Wide</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#d97706' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details">
            <h3>Global Orders</h3>
            <p className="stat-value">Monitoring</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#e11d48' }}>
            <Flame size={24} />
          </div>
          <div className="stat-details">
            <h3>Financials</h3>
            <p className="stat-value">Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-card">
          <h3 className="card-title">
            <TrendingUp size={18} /> Administrative Activity
          </h3>
          <div className="chart-placeholder" style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b' }}>Super Admin Analytics graph will render here.</p>
          </div>
        </div>
        
        <div className="dashboard-card list-card">
          <h3 className="card-title">
            <Users size={18} /> Recent Personnel Logins
          </h3>
          <ul className="action-list">
            <li><span>Admin created new product rule</span><small>2 mins ago</small></li>
            <li><span>Rider status changed to unavailable</span><small>15 mins ago</small></li>
            <li><span>Admin refunded Order #10029</span><small>1 hr ago</small></li>
            <li><span>Account "manager.test" locked</span><small>3 hrs ago</small></li>
            <li><span>System configuration updated</span><small>1 day ago</small></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;