import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "./CartPage.css"; // Reuse cart page styles

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, loading } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [error, setError] = useState(null);

  const handleRemove = async (productId) => {
    if (window.confirm("Remove from wishlist?")) {
      try {
        await removeFromWishlist(productId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove item");
      }
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div
        style={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader text="Loading wishlist..." />
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>My Wishlist</h2>
      <Link
        to="/shop"
        style={{
          marginBottom: "1rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#f59e0b",
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      {error && <Message variant="danger">{error}</Message>}

      {wishlistItems.length === 0 ? (
        <div className="empty-message">
          Your wishlist is empty{" "}
          <Link to="/shop" className="text-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {wishlistItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-image">
                  <img
                    src={
                      item.image_url ||
                      item.image ||
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"
                    }
                    alt={item.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item._id}`)}
                  />
                </div>
                <div className="item-details">
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                  <p className="item-price">
                    Rs. {item.price ? Number(item.price).toFixed(2) : "0.00"}
                  </p>
                  <p
                    style={{
                      color: item.stock_qty > 0 ? "#10b981" : "#ef4444",
                      fontSize: "0.85rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {item.stock_qty > 0
                      ? `In Stock (${item.stock_qty} available)`
                      : "Out of Stock"}
                  </p>
                </div>
                <div className="item-controls">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock_qty === 0}
                    style={{ minWidth: "120px" }}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button
                    className="btn btn-outline btn-remove"
                    onClick={() => handleRemove(item._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Wishlist Summary</h3>
              <p className="summary-detail">
                Total Items: {wishlistItems.length}
              </p>
              <p className="summary-detail">
                Total Value: Rs.{" "}
                {wishlistItems
                  .reduce((acc, item) => acc + (item.price || 0), 0)
                  .toFixed(2)}
              </p>
              <p className="summary-detail" style={{ color: "#10b981" }}>
                In Stock:{" "}
                {wishlistItems.filter((item) => item.stock_qty > 0).length}
              </p>
              <button
                className="btn btn-primary checkout-btn"
                onClick={() => {
                  if (wishlistItems.some((item) => item.stock_qty > 0)) {
                    navigate("/shop");
                  }
                }}
                style={{ marginTop: "1rem" }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
