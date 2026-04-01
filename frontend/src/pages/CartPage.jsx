import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-message">
          Your cart is empty <Link to="/" className="text-primary">Go Back</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <p className="item-price">Rs. {item.price.toFixed(2)}</p>
                </div>
                <div className="item-controls">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCart({ _id: item.product, ...item }, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-outline btn-remove"
                    onClick={() => removeFromCart(item.product)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>
                Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) items
              </h3>
              <p className="summary-total">
                Rs. {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </p>
              <button
                fullWidth
                className="btn btn-primary checkout-btn"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;