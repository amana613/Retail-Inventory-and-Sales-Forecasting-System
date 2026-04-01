import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './ShopPage.css';
import './StorefrontHomePage.css'; // Reuse product card styles

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        let filteredData = Array.isArray(data) ? data : [];
        
        if (categoryFilter) {
          filteredData = filteredData.filter(
            p => p.category && p.category.toLowerCase() === categoryFilter.toLowerCase()
          );
        }
        
        setProducts(filteredData);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  return (
    <div className="shop-container">
      <div className="container">
        <div className="shop-header">
          <h1>{categoryFilter ? `${categoryFilter} Products` : 'All Products'}</h1>
          <p>{categoryFilter ? `Browse our selection of ${categoryFilter}.` : 'Browse our entire catalog and find what you need.'}</p>
        </div>

        <div className="shop-content">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="shop-grid product-grid">
              {products.length === 0 ? (
                <div className="no-products">
                  <h2>No products found</h2>
                  <p>Check back later or add products from the admin dashboard.</p>
                </div>
              ) : (
                products.map(product => (
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
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;