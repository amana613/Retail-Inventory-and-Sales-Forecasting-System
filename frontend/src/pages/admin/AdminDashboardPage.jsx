import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Package, TrendingUp, ShoppingBag, Users, Clock, ArrowRight } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import './AdminDashboardPage.css';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSuppliers: 0,
    totalRevenue: 0,
    recentOrders: []
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
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="loading-spinner">Loading dashboard data...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h2 style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem' }}>Store Overview</h2>
      </div>

      <div className="dashboard-grid">
        {/* Stat Cards */}
        <div className="stat-card">
          <div className="stat-icon pulse-soft" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">Rs. {dashboardData.totalRevenue}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{dashboardData.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>Active Products</h3>
            <p className="stat-value">{dashboardData.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#a855f7' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>Registered Customers</h3>
            <p className="stat-value">{dashboardData.totalUsers}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tables-container">
        {/* Recent Orders */}
        <div className="card recent-orders-card">
          <div className="card-header">
            <h3><Clock size={18} style={{ marginRight: '8px' }} /> Recent Transactions</h3>
            <Link to="/admin/orders" className="btn-link">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentOrders?.map(order => (
                  <tr key={order._id}>
                    <td><span className="id-badge">#{order._id.substring(order._id.length - 6).toUpperCase()}</span></td>
                    <td className="font-medium">{order.user?.name || 'Guest'}</td>
                    <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.isDelivered ? 'success' : order.isPaid ? 'info' : 'warning'}`}>
                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="font-bold">Rs. {order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
                {(!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No recent orders found.</td>
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

export default AdminDashboardPage;
