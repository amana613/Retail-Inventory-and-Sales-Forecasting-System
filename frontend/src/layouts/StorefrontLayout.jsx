import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StorefrontLayout = () => {
  return (
    <div className="storefront-layout">
      <Navbar />
      <main className="storefront-main">
        <Outlet />
      </main>
      <footer style={{ backgroundColor: 'var(--dark-ui)', color: 'white', padding: '40px 0', marginTop: '40px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '15px' }}>RETAIL<span style={{ color: 'var(--primary-red)' }}>PRO</span></h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Your neighborhood store with a global spirit.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: 0, color: 'white' }}>Quick Links</h4>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About Us</a>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact</a>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>FAQ</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: 0, color: 'white' }}>Support</h4>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Delivery Info</a>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Returns</a>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
