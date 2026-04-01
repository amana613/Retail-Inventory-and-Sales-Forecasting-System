import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        <div className="product-image-wrapper">
          <img 
            src={product.image || 'https://via.placeholder.com/400x400'} 
            alt={product.name} 
            className="product-image"
          />
          {product.countInStock === 0 && (
            <span className="out-of-stock-badge">Out of Stock</span>
          )}
          {/* Quick Actions Hover Overlay */}
          <div className="product-actions-overlay">
            <button className="btn btn-primary action-btn" title="Add to Cart">
              <ShoppingCart size={18} />
            </button>
            <span className="btn btn-secondary action-btn" title="View Details">
              <Eye size={18} />
            </span>
          </div>
        </div>
      </Link>
      
      <div className="product-info">
        <div className="product-category">
          {product.category || 'General'}
        </div>
        <Link to={`/product/${product._id}`} className="product-title-link">
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <div className="product-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                size={14} 
                fill={product.rating >= star ? '#F59E0B' : 'transparent'} 
                color={product.rating >= star ? '#F59E0B' : '#CBD5E1'}
              />
            ))}
          </div>
          <span className="reviews-count">({product.numReviews || 0})</span>
        </div>

        <div className="product-footer">
          <div className="price-section">
            <span className="current-price">Rs. {Number(product.price).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;