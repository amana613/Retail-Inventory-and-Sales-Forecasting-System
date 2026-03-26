import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

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
    <section className="section-stack">
      <header className="page-header">
        <h2>Explore Products</h2>
        <p>Discover inventory across categories and quickly spot low stock signals.</p>
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
