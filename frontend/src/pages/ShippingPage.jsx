import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin, Building2, Map, Globe } from 'lucide-react';
import './AuthPage.css'; // Reusing form styles

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Sri Lanka');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="shipping-container">
      <div className="checkout-steps-wrapper" style={{ margin: '2rem auto', maxWidth: '800px' }}>
        <CheckoutSteps step1 step2 />
      </div>
      <div className="auth-card" style={{ margin: '0 auto 4rem auto', maxWidth: '600px' }}>
        <div className="auth-header">
          <h2>Shipping Address</h2>
          <p>Where should we deliver your order?</p>
        </div>
        
        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon" />
              <input
                type="text"
                id="address"
                placeholder="E.g. 123 Main St, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="city">City</label>
              <div className="input-with-icon">
                <Building2 size={18} className="input-icon" />
                <input
                  type="text"
                  id="city"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="postalCode">Postal Code</label>
              <div className="input-with-icon">
                <Map size={18} className="input-icon" />
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Postal/ZIP code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <div className="input-with-icon">
              <Globe size={18} className="input-icon" />
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block auth-btn" style={{ marginTop: '2rem' }}>
            Continue To Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
