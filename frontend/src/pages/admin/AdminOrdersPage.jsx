import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './AdminProductsPage.css'; // Reusing styles

const AdminOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Orders...</div>;

  return (
    <div className="admin-products-page">
      <div className="header-actions">
        <h1>Order Management</h1>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>Rs. {order.totalPrice.toFixed(2)}</td>
              <td>
                {order.isPaid ? (
                  new Date(order.paidAt).toLocaleDateString()
                ) : (
                  <span style={{ color: 'var(--danger-red)' }}>Not Paid</span>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  new Date(order.deliveredAt).toLocaleDateString()
                ) : (
                  <span style={{ color: 'var(--danger-red)' }}>Not Delivered</span>
                )}
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn-icon">
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
