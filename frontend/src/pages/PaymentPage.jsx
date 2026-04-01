import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard } from 'lucide-react';
import './AuthPage.css';

const PaymentPage = () => {
  const { shippingAddress, savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="auth-container">
      <CheckoutSteps step1 step2 step3 />
      <div className="auth-card">
        <div className="auth-header">
          <h2>Payment Method</h2>
          <p>Select how you want to pay</p>
        </div>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <div className="payment-options">
              <label className="payment-radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label">
                  <CreditCard size={18} />
                  Credit / Debit Card (Stripe)
                </span>
              </label>

              <label className="payment-radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash On Delivery"
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label">Cash On Delivery</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block auth-btn mt-4">
            Continue To Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;