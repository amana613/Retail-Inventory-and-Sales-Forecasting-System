import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StorefrontHomePage.css';

const StorefrontHomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to RETAIL<span className="brand-accent">PRO</span></h1>
          <p>Unbeatable Prices & Freshness Guaranteed, Delivered directly to your door.</p>
          <button className="btn btn-primary hero-btn">Shop Fresh Deals</button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories container">
        <h2>Shop By Category</h2>
        <div className="category-grid">
          <div className="category-card"><p>Fresh Produce</p></div>
          <div className="category-card"><p>Household</p></div>
          <div className="category-card"><p>Health & Beauty</p></div>
          <div className="category-card"><p>Beverages</p></div>
        </div>
      </section>

      {/* SPAR Great Savings Simulation */}
      <section className="savings-section container">
        <div className="section-header">
          <h2>Latest Products</h2>
          <Link to="/products" className="view-all">View all products &rarr;</Link>
        </div>
        
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found in the database. Please add some from the Admin Dashboard.</p>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div className="product-card" key={product._id}>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
                  </div>
                  <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="price-section">
                      <span className="sale-price">Rs. {product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
                <div style={{ padding: '0 1rem 1rem' }}>
                  <Link to={`/product/${product._id}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default StorefrontHomePage;