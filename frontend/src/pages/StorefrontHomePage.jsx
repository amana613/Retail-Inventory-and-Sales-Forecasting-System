import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "./StorefrontHomePage.css";

const StorefrontHomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=2000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "120px 20px",
        }}
      >
        <div className="hero-content">
          <h1>
            Welcome to RETAIL
            <span
              className="brand-accent"
              style={{ color: "var(--primary-red)" }}
            >
              PRO
            </span>
          </h1>
          <p>
            Unbeatable Prices & Freshness Guaranteed, Delivered directly to your
            door.
          </p>
          <Link to="/shop" className="btn btn-primary hero-btn">
            Shop Fresh Deals
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories container">
        <h2>Shop By Category</h2>
        <div className="category-grid">
          <Link
            to="/shop?category=Fresh+Produce"
            className="category-card"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400)",
              backgroundSize: "cover",
              color: "white",
              textDecoration: "none",
            }}
          >
            <h3>Fresh Produce</h3>
          </Link>
          <Link
            to="/shop?category=Household"
            className="category-card"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400)",
              backgroundSize: "cover",
              color: "white",
              textDecoration: "none",
            }}
          >
            <h3>Household</h3>
          </Link>
          <Link
            to="/shop?category=Beauty"
            className="category-card"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=400)",
              backgroundSize: "cover",
              color: "white",
              textDecoration: "none",
            }}
          >
            <h3>Health & Beauty</h3>
          </Link>
          <Link
            to="/shop?category=Beverages"
            className="category-card"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400)",
              backgroundSize: "cover",
              color: "white",
              textDecoration: "none",
            }}
          >
            <h3>Beverages</h3>
          </Link>
        </div>
      </section>

      {/* SPAR Great Savings Simulation */}
      <section className="savings-section container">
        <div className="section-header">
          <h2>Latest Products</h2>
          <Link to="/shop" className="view-all">
            View all products &rarr;
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading fresh products..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : products.length === 0 ? (
          <Message variant="warning">
            No products found in the database. Please add some from the Admin
            Dashboard.
          </Message>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StorefrontHomePage;
