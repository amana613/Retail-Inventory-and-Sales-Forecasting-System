import { useState, useEffect, useContext } from 'react';
import { MapPin, PhoneCall, CheckCircle, Navigation, Clock, Package, CheckSquare, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import StatusBadge from '../../components/StatusBadge';
import './RiderDashboard.css';

const RiderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders', config);
        // Only show orders that are placed and out for delivery
        setActiveDeliveries(data.filter(d => !d.isDelivered));
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Error fetching deliveries');
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
      setError('Failed to update status');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="rider-dashboard container mx-auto" style={{ maxWidth: '800px', padding: '1rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Active Assignments</h2>
        <StatusBadge status="warning" text={`${activeDeliveries.length} Pending`} />
      </div>

      <div className="delivery-list" style={{ display: 'grid', gap: '1rem' }}>
        {activeDeliveries.length === 0 ? (
           <Message variant="info">No active assignments found.</Message>
        ) : (
          activeDeliveries.map((delivery) => (
            <div key={delivery._id} className="delivery-card" style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--border-radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                    Order #{delivery._id.substring(delivery._id.length - 6).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                     {delivery.user ? delivery.user.name : 'Unknown User'}
                  </div>
                </div>
                <StatusBadge 
                    status={delivery.isPaid ? 'success' : 'danger'} 
                    text={delivery.isPaid ? 'Paid' : 'Unpaid'} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                   <MapPin size={18} color="var(--primary-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
                   <div>
                     <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{delivery.shippingAddress.address}</p>
                     <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                       {delivery.shippingAddress.city}, {delivery.shippingAddress.postalCode}
                     </p>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Package size={18} color="var(--text-light)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        {delivery.orderItems.length} items • Rs. {delivery.totalPrice.toFixed(2)}
                    </span>
                 </div>
              </div>


              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <a 
                   href={`tel:1234567890`} 
                   className="btn" 
                   style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#f3f4f6', color: '#1f2937' }}
                >
                  <PhoneCall size={16} /> Call
                </a>
                <a 
                  href={`https://maps.google.com/?q=${delivery.shippingAddress.address}, ${delivery.shippingAddress.city}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#f3f4f6', color: '#1f2937' }}
                >
                  <Navigation size={16} /> Route
                </a>
                <button 
                  className="btn btn-primary"
                  style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => handleUpdateStatus(delivery._id)}
                >
                  <CheckCircle size={16} /> Deliver
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
