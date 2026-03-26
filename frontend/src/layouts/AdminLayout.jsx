import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <p>Operations and insights</p>
        <nav>
          <NavLink to="/admin" end>
            Overview
          </NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/suppliers">Suppliers</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/deliveries">Deliveries</NavLink>
          <NavLink to="/admin/payments">Payments</NavLink>
          <NavLink to="/admin/forecast">Forecast</NavLink>
        </nav>
        <div className="dashboard-sidebar-actions">
          <NavLink to="/">Storefront</NavLink>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
