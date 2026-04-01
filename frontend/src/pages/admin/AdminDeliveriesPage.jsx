import React from 'react';
import { Truck } from 'lucide-react';
import './AdminDashboardPage.css'; // Reusing styles

const AdminDeliveriesPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Delivery Management</h2>
      </div>
      
      <div className="admin-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', marginTop: '2rem' }}>
        <Truck size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: '#475569' }}>Deliveries Module</h3>
        <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
          This section allows administrators to assign drivers to orders, track current shipment locations, and confirm delivery fulfillment times.
        </p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Assign Rider (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default AdminDeliveriesPage;
