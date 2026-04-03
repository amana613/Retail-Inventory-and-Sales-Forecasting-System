import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { Calendar, Filter, TrendingUp } from 'lucide-react';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupByMonth, setGroupByMonth] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
      } catch (error) {
        console.error('Failed to fetch user orders', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter orders based on selected filter type
  useEffect(() => {
    let filtered = [...orders];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterType) {
      case 'today':
        filtered = filtered.filter(
          (order) =>
            new Date(order.createdAt).toDateString() === today.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= monthAgo
        );
        break;
      case 'lastMonth':
        const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(currentMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate >= lastMonth && orderDate < currentMonth
          );
        });
        break;
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filtered = filtered.filter(
            (order) =>
              new Date(order.createdAt) >= start &&
              new Date(order.createdAt) <= end
          );
        }
        break;
      default:
        break;
    }

    setFilteredOrders(filtered);
  }, [filterType, startDate, endDate, orders]);

  // Group orders by month
  const groupOrdersByMonth = () => {
    const grouped = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = date.toLocaleString('default', {
        year: 'numeric',
        month: 'long',
      });
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(order);
    });
    return grouped;
  };

  // Calculate statistics
  const stats = {
    totalOrders: filteredOrders.length,
    totalSpent: filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0),
    paidOrders: filteredOrders.filter((order) => order.isPaid).length,
    deliveredOrders: filteredOrders.filter((order) => order.isDelivered).length,
  };

  if (loading) {
    return (
      <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading Your Orders...</div>
      </div>
    );
  }

  const groupedOrders = groupByMonth ? groupOrdersByMonth() : null;

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
      <div className="orders-header">
        <h1>My Orders</h1>
        <p className="orders-subtitle">View and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You have no orders yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          {/* Filters and Stats */}
          <div className="orders-controls">
            <div className="filters-section">
              <div className="filter-group">
                <label>
                  <Filter size={16} /> Filter Orders
                </label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="filter-select"
                >
                  <option value="all">All Orders</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {filterType === 'custom' && (
                <div className="custom-date-range">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                    className="date-input"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                    className="date-input"
                  />
                </div>
              )}

              <label className="group-checkbox">
                <input
                  type="checkbox"
                  checked={groupByMonth}
                  onChange={(e) => setGroupByMonth(e.target.checked)}
                />
                <span>Group by Month</span>
              </label>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">Rs. {stats.totalSpent.toFixed(2)}</div>
                <div className="stat-label">Total Spent</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.paidOrders}</div>
                <div className="stat-label">Paid</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.deliveredOrders}</div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>
          </div>

          {/* Orders Display */}
          {filteredOrders.length === 0 ? (
            <div className="no-results">
              <p>No orders found for the selected period.</p>
            </div>
          ) : groupByMonth ? (
            // Grouped by month view
            <div className="orders-grouped">
              {Object.entries(groupedOrders).map(([month, monthOrders]) => (
                <div key={month} className="month-group">
                  <h3 className="month-header">
                    <Calendar size={18} /> {month}
                  </h3>
                  <div className="orders-table-wrapper">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthOrders.map((order) => (
                          <tr key={order._id}>
                            <td>{order._id.substring(0, 8)}...</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>Rs. {order.totalPrice.toFixed(2)}</td>
                            <td>
                              <StatusBadge
                                type="payment"
                                status={order.isPaid ? 'paid' : 'unpaid'}
                              />
                            </td>
                            <td>
                              <StatusBadge
                                type="order"
                                status={order.isDelivered ? 'delivered' : 'pending'}
                              />
                            </td>
                            <td>
                              <Link
                                to={`/order/${order._id}`}
                                className="btn btn-outline btn-sm"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="month-summary">
                    <p>
                      <TrendingUp size={16} /> Month Total: Rs.{' '}
                      {monthOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Regular table view
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>Rs. {order.totalPrice.toFixed(2)}</td>
                      <td>
                        <StatusBadge
                          type="payment"
                          status={order.isPaid ? 'paid' : 'unpaid'}
                        />
                      </td>
                      <td>
                        <StatusBadge
                          type="order"
                          status={order.isDelivered ? 'delivered' : 'pending'}
                        />
                      </td>
                      <td>
                        <Link
                          to={`/order/${order._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrdersPage;
