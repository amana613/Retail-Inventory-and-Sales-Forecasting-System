import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, ArrowLeft, Star, Truck } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, Number(qty));
    navigate('/cart');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-details-container">
      <div className="breadcrumb">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to Store</Link>
      </div>

      <div className="product-details-card">
        <div className="product-image-section">
          <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} className="main-product-image" />
        </div>
        
        <div className="product-info-section">
          <div className="product-header">
            <span className="product-brand">{product.brand}</span>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating || 0) ? "var(--color-warning)" : "none"} 
                    color={i < Math.floor(product.rating || 0) ? "var(--color-warning)" : "#CBD5E1"} 
                  />
                ))}
              </div>
              <span className="reviews-count">({product.numReviews || 0} Reviews)</span>
            </div>
          </div>

          <div className="product-pricing">
            <h2 className="current-price">Rs. {product.price?.toFixed(2)}</h2>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <div className="meta-item">
              <Truck size={18} />
              <span>Available for Fast Delivery</span>
            </div>
            <div className="meta-item">
              <span className="stock-status" style={{ color: product.countInStock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}>-</button>
              <input type="number" readOnly value={qty} />
              <button 
                onClick={() => setQty((prev) => Math.min(product.countInStock, prev + 1))}
              >
                +
              </button>
            </div>
            
            <button 
              className="btn btn-primary add-to-cart-btn" 
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="btn btn-outline wishlist-btn">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
