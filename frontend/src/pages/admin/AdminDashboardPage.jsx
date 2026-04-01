import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders', config),
          axios.get('http://localhost:5000/api/products')
        ]);
        
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoading(false);
      }
    };
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const lowStockProducts = products.filter(p => p.countInStock < 5);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        {/* Stat Cards */}
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info-blue)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">Rs. {totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success-green)' }}>
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{orders.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-red)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-details">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{lowStockProducts.length} Products</p>
            {lowStockProducts.length > 0 && <span className="stat-change negative">Needs Immediate Attention</span>}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-orange)' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>Active Customers</h3>
            <p className="stat-value">System Active</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tables-container">
        {/* Recent Orders */}
        <div className="card recent-orders-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="btn btn-outline">View All</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order._id}>
                  <td>...{order._id.substring(order._id.length - 5)}</td>
                  <td>{order.user?.name || 'Guest'}</td>
                  <td>
                    <span className={`status-badge ${order.isDelivered ? 'success' : 'warning'}`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td>Rs. {order.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="4">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts */}
        <div className="card low-stock-card">
          <div className="card-header">
            <h3 style={{ color: 'var(--danger-red)' }}>Inventory Alerts</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock left</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr className="low-stock-row" key={product._id}>
                  <td>{product.name}</td>
                  <td><strong>{product.countInStock}</strong> left</td>
                </tr>
              ))}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan="2">Inventory stock levels are stable.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;