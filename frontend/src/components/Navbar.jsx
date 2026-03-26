import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <h1>Retail Inventory System</h1>
      <nav>
        <Link to="/">Products</Link>
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/wishlist">Wishlist</Link>}
        {isAuthenticated && user?.role === "customer" && <Link to="/orders">My Orders</Link>}
        {isAuthenticated && user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
        {isAuthenticated && user?.role === "rider" && <Link to="/rider">Rider Dashboard</Link>}
        {isAuthenticated && (
          <button type="button" onClick={logout} className="link-button">
            Logout ({user?.name})
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
