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
        const { data } = await axios.get('/api/products'); 
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
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
      <section className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 20px'
      }}>
        <div className="hero-content">
          <h1>Welcome to RETAIL<span className="brand-accent" style={{color: 'var(--primary-red)'}}>PRO</span></h1>   
          <p>Unbeatable Prices & Freshness Guaranteed, Delivered directly to your door.</p>
          <Link to="/shop" className="btn btn-primary hero-btn">Shop Fresh Deals</Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories container">
        <h2>Shop By Category</h2>
        <div className="category-grid">
          <Link to="/shop?category=Fresh+Produce" className="category-card" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400)', backgroundSize: 'cover', color: 'white', textDecoration: 'none' }}>
            <h3>Fresh Produce</h3>
          </Link>
          <Link to="/shop?category=Household" className="category-card" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400)', backgroundSize: 'cover', color: 'white', textDecoration: 'none' }}>
            <h3>Household</h3>
          </Link>
          <Link to="/shop?category=Beauty" className="category-card" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1596462502278-27bf85033c44?auto=format&fit=crop&q=80&w=400)', backgroundSize: 'cover', color: 'white', textDecoration: 'none' }}>
            <h3>Health & Beauty</h3>
          </Link>
          <Link to="/shop?category=Beverages" className="category-card" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400)', backgroundSize: 'cover', color: 'white', textDecoration: 'none' }}>
            <h3>Beverages</h3>
          </Link>
        </div>
      </section>

      {/* SPAR Great Savings Simulation */}
      <section className="savings-section container">
        <div className="section-header">
          <h2>Latest Products</h2>
          <Link to="/shop" className="view-all">View all products &rarr;</Link>
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
                  <div className="product-image-container" style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'} 
                      alt={product.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="price-section">
                      <span className="sale-price">Rs. {Number(product.price).toFixed(2)}</span>
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