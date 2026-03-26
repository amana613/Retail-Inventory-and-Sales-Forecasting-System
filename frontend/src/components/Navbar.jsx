import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <div className="brand-block">
        <h1>Retail Nexus</h1>
        <p>Inventory intelligence, commerce flow, and demand forecasting</p>
      </div>
      <nav className="nav-links">
        <Link to="/">Products</Link>
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/wishlist">Wishlist</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/orders">My Orders</Link>}
        {isAuthenticated && user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
        {isAuthenticated && user?.role === "rider" && <Link to="/rider">Rider Dashboard</Link>}
        {isAuthenticated && <span className="role-pill">{user?.role}</span>}
        {isAuthenticated && (
          <button type="button" onClick={logout} className="link-button">
            Sign out {user?.name}
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
