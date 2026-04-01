import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin, CreditCard, Package } from 'lucide-react';
import axios from 'axios';
import './PlaceOrderPage.css';

const PlaceOrderPage = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add Decimals function
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = addDecimals(itemsPrice > 5000 ? 0 : 350); // Free shipping over 5000 Rs
  const taxPrice = addDecimals(Number((0.05 * itemsPrice).toFixed(2))); // 5% tax
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress.address, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      clearCart();
      // Normally we'd navigate to the order detail page here
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Error occurred while placing the order');
    }
  };

  return (
    <div className="place-order-container">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="place-order-content">
        <div className="order-details-col">
          <div className="order-section">
            <h2 className="section-title"><MapPin size={20} /> Shipping</h2>
            <p>
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="order-section">
            <h2 className="section-title"><CreditCard size={20} /> Payment Method</h2>
            <p>
              <strong>Method:</strong> {paymentMethod}
            </p>
          </div>

          <div className="order-section">
            <h2 className="section-title"><Package size={20} /> Order Items</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul className="order-item-list">
                {cartItems.map((item, index) => (
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
              <span>Rs. {itemsPrice}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs. {shippingPrice}</span>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>Rs. {taxPrice}</span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rs. {totalPrice}</span>
            </div>

            <button
              className="btn btn-primary place-order-btn"
              disabled={cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;