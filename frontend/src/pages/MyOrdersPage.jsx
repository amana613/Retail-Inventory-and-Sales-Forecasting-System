import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import './ShopPage.css'; // Just to get some table/btn styles if needed

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(Array.isArray(data) ? data : []);
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

  if (loading) return <div>Loading Your Orders...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ marginTop: '20px' }}>
          You have no orders yet. <Link to="/shop">Shop Now</Link>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>DATE</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>TOTAL</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>PAID</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>STATUS</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{order._id}</td>
                <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>Rs. {order.totalPrice.toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  <StatusBadge type="payment" status={order.isPaid ? 'paid' : 'unpaid'} />
                </td>
                <td style={{ padding: '12px' }}>
                  <StatusBadge type="order" status={order.status} />
                </td>
                <td style={{ padding: '12px' }}>
                  <Link to={`/order/${order._id}`} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrdersPage;
