import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './PlaceOrderPage.css'; // Reusing layout css
import { MapPin, CreditCard, Package, User, Camera, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrder();
    }
  }, [id, user]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('receiptImage', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/orders/${id}/receipt`, formData, config);
      setOrder({ ...order, receiptImage: data.receiptImage });
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setError('Image upload failed');
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div style={{color: 'red', margin:'20px'}}>{error}</div>;

  const renderStatusTracker = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    
    let config = { icon: <Clock size={40} />, color: '#854d0e', bg: '#fef3c7', text: 'Pending', desc: 'Your order has been received and is awaiting processing.' };
    
    if (s === 'processing') {
      config = { icon: <Package size={40} />, color: '#1e40af', bg: '#dbeafe', text: 'Processing', desc: 'We are preparing your order for shipment.' };
    } else if (s === 'dispatched') {
      config = { icon: <Truck size={40} />, color: '#92400e', bg: '#fef08a', text: 'Dispatched', desc: 'Your order is on the way! Handed over to our rider.' };
    } else if (s === 'delivered') {
      config = { icon: <CheckCircle size={40} />, color: '#166534', bg: '#dcfce3', text: 'Delivered', desc: 'Order was successfully completed.' };
    } else if (s === 'cancelled') {
      config = { icon: <AlertCircle size={40} />, color: '#991b1b', bg: '#fee2e2', text: 'Cancelled', desc: 'This order was cancelled.' };
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: config.bg, color: config.color, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div>{config.icon}</div>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>Order {config.text}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>{config.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="place-order-container container">
      <h2>Order {order._id}</h2>
      
      <div className="place-order-content">
        <div className="order-details-col">
          {renderStatusTracker(order.status)}

          <div className="order-section">
            <h2 className="section-title"><MapPin size={20} /> Shipping</h2>
            <p>
              <strong>Name: </strong> {order.user.name} <br/>
              <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a> <br/>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}
            </p>
            {order.isDelivered ? (
              <div style={{color: 'green', background: '#d1fae5', padding: '10px', borderRadius:'4px'}}>
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div style={{color: '#991b1b', background: '#fee2e2', padding: '10px', borderRadius:'4px'}}>
                Not Delivered (Status: {order.status})
              </div>
            )}
          </div>

          <div className="order-section">
            <h2 className="section-title"><CreditCard size={20} /> Payment Method</h2>
            <p>
              <strong>Method: </strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div style={{color: 'green', background: '#d1fae5', padding: '10px', borderRadius:'4px'}}>
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            ) : (
              <div style={{color: '#991b1b', background: '#fee2e2', padding: '10px', borderRadius:'4px'}}>
                Not Paid
              </div>
            )}
          </div>

          <div className="order-section">
            <h2 className="section-title"><Package size={20} /> Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Order is empty</p>
            ) : (
              <ul className="order-item-list">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="order-list-item">
                    <img src={item.image} alt={item.name} className="item-thumbnail" />
                    <Link to={`/product/${item.product}`} className="item-link">
                      {item.name}
                    </Link>
                    <div className="item-calc">
                      {item.qty} x Rs. {item.price} = <strong>Rs. {(item.qty * item.price).toFixed(2)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="order-summary-col">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items</span>
              <span>Rs. {order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs. {order.shippingPrice?.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rs. {order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-card" style={{ marginTop: '20px' }}>
            <h3><Camera size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Payment Receipt</h3>
            {order.receiptImage ? (
              <div style={{ marginTop: '10px' }}>
                <p style={{ color: 'green', marginBottom: '10px' }}>Receipt Uploaded!</p>
                <img src={order.receiptImage} alt="Payment Receipt" style={{ width: '100%', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            ) : (
              <div style={{ marginTop: '10px' }}>
                <p style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>Please upload your transaction receipt to verify payment.</p>
                <input 
                  type="file" 
                  id="receipt-upload" 
                  onChange={uploadFileHandler} 
                  disabled={uploading}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                <label 
                  htmlFor="receipt-upload" 
                  style={{ 
                    display: 'inline-block', 
                    padding: '10px 15px', 
                    background: '#2563eb', 
                    color: 'white', 
                    borderRadius: '5px', 
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Receipt Image'}
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
