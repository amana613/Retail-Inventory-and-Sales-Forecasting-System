import { useState, useEffect, useContext } from 'react';
import { MapPin, PhoneCall, CheckCircle, Navigation, Clock } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './RiderDashboard.css';

const RiderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders', config);
        // Showing orders that are paid but not delivered. This is just an example filter.
        setActiveDeliveries(data.filter(d => !d.isDelivered));
      } catch (error) {
        console.error('Error fetching deliveries', error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) {
      fetchDeliveries();
    }
  }, [user]);

  const handleUpdateStatus = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      setActiveDeliveries(activeDeliveries.filter(d => d._id !== id));
    } catch (error) {
      console.error('Error marking delivered', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rider-dashboard">
      <div className="metric-cards">
        <div className="metric-card primary">
          <h3>Active Deliveries</h3>
          <p className="value">{activeDeliveries.length}</p>
        </div>
        <div className="metric-card success">
          <h3>Completed Today</h3>
          <p className="value">12</p>
        </div>
        <div className="metric-card warning">
          <h3>Pending Issues</h3>
          <p className="value">0</p>
        </div>
      </div>

      <div className="deliveries-section">
        <h2>Current Assignments</h2>
        
        <div className="delivery-list">
          {activeDeliveries.map((delivery) => (
            <div key={delivery._id} className="delivery-card active-transit">
              <div className="delivery-header">
                <div>
                  <h4>{delivery._id.substring(0, 8)}</h4>
                  <span className="status-badge status-transit">
                    {delivery.isDelivered ? 'Delivered' : 'Assigned'}
                  </span>
                </div>
                <div className="eta">
                  <Clock size={16} />
                  <span>{new Date(delivery.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="delivery-details">
                <div className="customer-info">
                  <p><strong>{delivery.user ? delivery.user.name : 'Unknown User'}</strong></p>
                  <p className="items-count">{delivery.orderItems.length} items • Rs. {delivery.totalPrice.toFixed(2)}</p>
                </div>
                
                <div className="address-container">
                  <MapPin size={18} className="address-icon" />
                  <p className="address-text">
                    {delivery.shippingAddress.address}, {delivery.shippingAddress.city}
                  </p>
                </div>
              </div>
              
              <div className="delivery-actions">
                <button className="btn btn-outline action-btn">
                  <PhoneCall size={18} />
                  Call Customer
                </button>
                <button className="btn btn-outline action-btn">
                  <Navigation size={18} />
                  Navigate
                </button>
                <button 
                  className="btn btn-primary action-btn finish-btn"
                  onClick={() => handleUpdateStatus(delivery._id)}
                >
                  <CheckCircle size={18} />
                  Mark Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;