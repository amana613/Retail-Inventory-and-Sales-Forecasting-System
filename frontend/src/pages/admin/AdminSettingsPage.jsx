import React from 'react';
import { Settings } from 'lucide-react';
import './AdminDashboardPage.css'; // Reusing styles

const AdminSettingsPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>System Settings</h2>
      </div>
      
      <div className="admin-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', marginTop: '2rem' }}>
        <Settings size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: '#475569' }}>Settings Module</h3>
        <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
          Configure global platform variables, adjust taxation rates, and manage local administrative preferences here.
        </p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
