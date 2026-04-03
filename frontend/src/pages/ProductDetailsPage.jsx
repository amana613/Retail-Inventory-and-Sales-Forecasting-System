import { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Star,
  Truck,
  Check,
  AlertCircle,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ReviewSection from "../components/ReviewSection";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
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
    navigate("/cart");
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        setWishlistMessage("Removed from wishlist");
      } else {
        await addToWishlist(product);
        setWishlistMessage("Added to wishlist");
      }
      setTimeout(() => setWishlistMessage(null), 2000);
    } catch (err) {
      setWishlistMessage(
        err instanceof Error ? err.message : "Please login to use wishlist",
      );
    }
  };

  if (loading)
    return (
      <div style={{ height: "50vh", display: "flex", alignItems: "center" }}>
        <Loader text="Loading product details..." />
      </div>
    );
  if (error)
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <Message variant="danger">{error}</Message>
      </div>
    );

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="product-details-container container">
      <div className="breadcrumb">
        <Link className="back-link" to="/shop">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>

      <div className="product-details-card">
        <div className="product-image-section">
          <img
            src={
              product.image_url ||
              product.image ||
              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
            }
            alt={product.name}
            className="main-product-image"
          />
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <span className="product-brand">
              {product.brand || product.category}
            </span>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.floor(product.rating || 0)
                        ? "var(--warning-orange)"
                        : "none"
                    }
                    color={
                      i < Math.floor(product.rating || 0)
                        ? "var(--warning-orange)"
                        : "#CBD5E1"
                    }
                  />
                ))}
              </div>
              <span className="reviews-count">
                ({product.numReviews || 0} Reviews)
              </span>
            </div>
          </div>

          <div className="product-pricing">
            <h2 className="current-price">
              Rs. {product.price ? Number(product.price).toFixed(2) : "0.00"}
            </h2>
          </div>

          <p className="product-description">
            {product.description ||
              "No description available for this product."}
          </p>

          <div className="product-meta">
            <div className="meta-item">
              <Truck size={18} />
              <span>Available for Fast Delivery</span>
            </div>
            <div className="meta-item">
              <span
                className="stock-status"
                style={{
                  color:
                    product.stock_qty > 0
                      ? "var(--color-success)"
                      : "var(--color-danger)",
                }}
              >
                {product.stock_qty > 0
                  ? `In Stock (${product.stock_qty} available)`
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}>
                -
              </button>
              <input type="number" readOnly value={qty} />
              <button
                onClick={() =>
                  setQty((prev) => Math.min(product.stock_qty, prev + 1))
                }
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary add-to-cart-btn"
              disabled={product.stock_qty === 0}
              onClick={addToCartHandler}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              className="btn btn-outline wishlist-btn"
              onClick={handleWishlistToggle}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
            </button>
            {wishlistMessage && (
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "#f59e0b",
                  fontSize: "0.85rem",
                }}
              >
                {wishlistMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <ReviewSection productId={id} />
    </div>
  );
};

export default ProductDetailsPage;
