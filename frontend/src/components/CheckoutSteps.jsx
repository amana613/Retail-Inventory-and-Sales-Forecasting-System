import { Link } from "react-router-dom";
import { User, MapPin, CreditCard, CheckCircle } from "lucide-react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="checkout-steps-container">
      <div className="checkout-progress">
        <div
          className={`progress-bar ${step2 ? "active" : ""} ${step3 ? "active-more" : ""} ${step4 ? "completed" : ""}`}
        ></div>
      </div>

      <nav className="checkout-steps">
        <div className={`step ${step1 ? "active" : "disabled"}`}>
          <div className="step-icon">
            <User size={20} />
          </div>
          {step1 ? (
            <Link to="/login" className="step-label">
              Sign In
            </Link>
          ) : (
            <span className="step-label">Sign In</span>
          )}
        </div>

        <div className={`step ${step2 ? "active" : "disabled"}`}>
          <div className="step-icon">
            <MapPin size={20} />
          </div>
          {step2 ? (
            <Link to="/shipping" className="step-label">
              Shipping
            </Link>
          ) : (
            <span className="step-label">Shipping</span>
          )}
        </div>

        <div className={`step ${step3 ? "active" : "disabled"}`}>
          <div className="step-icon">
            <CreditCard size={20} />
          </div>
          {step3 ? (
            <Link to="/payment" className="step-label">
              Payment
            </Link>
          ) : (
            <span className="step-label">Payment</span>
          )}
        </div>

        <div className={`step ${step4 ? "active" : "disabled"}`}>
          <div className="step-icon">
            <CheckCircle size={20} />
          </div>
          {step4 ? (
            <Link to="/placeorder" className="step-label">
              Place Order
            </Link>
          ) : (
            <span className="step-label">Place Order</span>
          )}
        </div>
      </nav>
    </div>
  );
};

export default CheckoutSteps;
