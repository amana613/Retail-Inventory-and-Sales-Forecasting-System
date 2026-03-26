import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 8);

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToWishlist = async (product_id) => {
    try {
      await api.post("/wishlist", { product_id });
      setMessage("Product added to wishlist");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add to wishlist");
    }
  };

  return (
    <section className="section-stack storefront-home">
      <section className="hero-grid">
        <article className="hero-main card">
          <p className="eyebrow">Latest arrivals</p>
          <h2>Top picks at everyday low prices</h2>
          <p>Discover fresh products for home, lifestyle, and everyday essentials.</p>
          <Link to="/" className="btn-link">Shop now</Link>
        </article>
        <article className="hero-side card">
          <p className="eyebrow">Seasonal picks</p>
          <h3>Home refresh deals</h3>
          <p>Find practical style upgrades for every room.</p>
        </article>
        <article className="hero-side card">
          <p className="eyebrow">Fast & easy</p>
          <h3>Click & collect</h3>
          <p>Reserve online and collect in-store quickly.</p>
        </article>
      </section>

      <section className="card category-strip">
        <h3>Shop by category</h3>
        <div className="chip-row">
          {categories.map((category) => (
            <button type="button" key={category} className="chip-button">
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="service-icons">
        <article className="service-card card"><h4>Free Delivery over $65</h4></article>
        <article className="service-card card"><h4>Order Tracking</h4></article>
        <article className="service-card card"><h4>Returns & Exchange</h4></article>
        <article className="service-card card"><h4>Express Delivery</h4></article>
      </section>

      <header className="page-header">
        <h2>Trending Products</h2>
        <p>Popular customer picks across the store.</p>
      </header>

      {message && <p className="info-banner">{message}</p>}
      <div className="grid">
        {products.map((product) => (
          <article className="card product-card" key={product._id}>
            <h3>{product.name}</h3>
            <p className="muted">{product.category}</p>
            <p className="metric">${product.price}</p>
            <p>
              <span className="label">Stock</span> {product.stock_qty}
            </p>
            {product.low_stock_alert && <p className="warning">Low stock alert</p>}
            {!product.low_stock_alert && <p className="deal-pill">Online deal</p>}
            <div className="action-row">
              <Link to={`/products/${product._id}`} className="btn-link">
                View Details
              </Link>
              {user?.role === "customer" && (
                <button type="button" onClick={() => addToWishlist(product._id)}>
                  Add to Wishlist
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductListPage;
