import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RiderLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar rider">
        <h2>Rider Panel</h2>
        <p>Delivery workflow</p>
        <nav>
          <NavLink to="/rider" end>
            Overview
          </NavLink>
          <NavLink to="/rider/deliveries">My Deliveries</NavLink>
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

export default RiderLayout;
