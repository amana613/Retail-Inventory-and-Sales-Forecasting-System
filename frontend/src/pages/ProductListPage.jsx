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
    <section>
      <h2>Products</h2>
      {message && <p>{message}</p>}
      <div className="grid">
        {products.map((product) => (
          <article className="card" key={product._id}>
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock_qty}</p>
            {product.low_stock_alert && <p className="warning">Low stock alert</p>}
            <Link to={`/products/${product._id}`}>View Details</Link>
            {user?.role === "customer" && (
              <button type="button" onClick={() => addToWishlist(product._id)}>
                Add to Wishlist
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductListPage;
