import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, ChevronDown, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSelect = (role) => {
    setIsDropdownOpen(false);
    navigate(`/login?role=${role}`);
  };

  return (
    <header className="store-header">
      {/* Top Banner - Utility */}
      <div className="top-banner">
        <div className="container banner-content">
          <span>Fast & Reliable Delivery within 24 Hours</span>
          <div className="banner-links">
            <Link to="/track-order">Track Your Order</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-nav container">
        {/* Brand / Logo */}
        <Link to="/" className="logo-section" style={{textDecoration: 'none'}}>
          <span style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: '1.8rem' }}>RETAIL</span>
          <span style={{ color: 'var(--dark-ui)', fontWeight: 800, fontSize: '1.8rem' }}>PRO</span>
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for products (e.g. Groceries, Electronics...)" 
            className="search-input"
          />
          <button className="search-btn">
            <Search size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Login Dropdown */}
          <div 
            className="login-dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="action-btn text-action">
              <User size={20} /> 
              <span>Login <ChevronDown size={14} /></span>
            </button>

            {isDropdownOpen && (
              <div className="login-dropdown-menu">
                <div className="dropdown-header">Login as:</div>
                <button onClick={() => handleLoginSelect('customer')} className="dropdown-item">Customer</button>
                <button onClick={() => handleLoginSelect('admin')} className="dropdown-item">Admin</button>
                <button onClick={() => handleLoginSelect('rider')} className="dropdown-item">Rider</button>
              </div>
            )}
          </div>

          <Link to="/register" className="btn" style={{ backgroundColor: 'var(--secondary-orange)', color: 'white', marginLeft: '10px' }}>
            Sign Up
          </Link>

          <Link to="/wishlist" className="action-btn icon-only" style={{ marginLeft: '15px' }}>
            <Heart size={24} color="var(--dark-ui)" />
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="action-btn cart-btn" style={{ marginLeft: '15px' }}>
            <ShoppingCart size={24} color="var(--dark-ui)" />
            <span className="cart-badge">0</span>
          </Link>
        </div>
      </div>

      {/* Categories Nav (Inspired by SPAR) */}
      <div className="category-nav">
        <div className="container category-list">
          <Link to="/shop" className="all-categories-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Menu size={20} /> Shop All
          </Link>
          <Link to="/shop?category=Groceries">Groceries</Link>
          <Link to="/shop?category=Health+%26+Beauty">Health & Beauty</Link>
          <Link to="/shop?category=Household">Household Essentials</Link>
          <Link to="/shop?category=Offers" className="offers-link" style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>Offers & Promotions</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
