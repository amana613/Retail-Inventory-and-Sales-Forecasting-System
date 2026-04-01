import { Link } from 'react-router-dom';
import './CheckoutSteps.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="checkout-steps">
      <div className={`step ${step1 ? 'active' : 'disabled'}`}>
        {step1 ? <Link to="/login">Sign In</Link> : <span>Sign In</span>}
      </div>
      <div className={`step ${step2 ? 'active' : 'disabled'}`}>
        {step2 ? <Link to="/shipping">Shipping</Link> : <span>Shipping</span>}
      </div>
      <div className={`step ${step3 ? 'active' : 'disabled'}`}>
        {step3 ? <Link to="/payment">Payment</Link> : <span>Payment</span>}
      </div>
      <div className={`step ${step4 ? 'active' : 'disabled'}`}>
        {step4 ? <Link to="/placeorder">Place Order</Link> : <span>Place Order</span>}
      </div>
    </nav>
  );
};

export default CheckoutSteps;