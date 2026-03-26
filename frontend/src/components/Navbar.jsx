import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <div className="brand-block storefront-brand">
        <h1>Retail Mart</h1>
        <p>Low prices, fresh finds, every day</p>
      </div>

      <div className="storefront-search">
        <input type="text" placeholder="Search products, categories and deals" />
        <button type="button">Search</button>
      </div>

      <nav className="nav-links storefront-nav-links">
        <Link to="/">Shop</Link>
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/wishlist">Wishlist</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/orders">Orders</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/account">My Details</Link>}
        {isAuthenticated && user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {isAuthenticated && user?.role === "rider" && <Link to="/rider">Rider</Link>}
        {isAuthenticated && <span className="role-pill">{user?.role}</span>}
        {isAuthenticated && (
          <button type="button" onClick={logout} className="link-button">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
