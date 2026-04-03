import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  Truck,
  ShoppingBag,
  LogOut,
  Settings,
  ShieldAlert,
  PackageOpen,
} from "lucide-react";
import "./AdminLayout.css";

const SuperAdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "S-Overview",
      path: "/superadmin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Manage Admins",
      path: "/superadmin/admins",
      icon: <ShieldAlert size={20} />,
    },
    {
      name: "Products",
      path: "/superadmin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Restocking",
      path: "/superadmin/restock",
      icon: <PackageOpen size={20} />,
    },
    {
      name: "Suppliers",
      path: "/superadmin/suppliers",
      icon: <Users size={20} />,
    },
    {
      name: "Orders",
      path: "/superadmin/orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      name: "Deliveries",
      path: "/superadmin/deliveries",
      icon: <Truck size={20} />,
    },
    {
      name: "Settings",
      path: "/superadmin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="admin-container">
      <aside
        className="admin-sidebar side-nav"
        style={{ backgroundColor: "#2d3748" }}
      >
        {" "}
        {/* Darker shade for super admin */}
        <div className="admin-brand">
          <h2>
            RETAIL
            <span className="brand-accent" style={{ color: "#fbbf24" }}>
              PRO
            </span>
          </h2>
          <span
            className="badge"
            style={{
              backgroundColor: "rgba(251, 191, 36, 0.2)",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              marginTop: "4px",
              display: "inline-block",
              color: "#fbbf24",
            }}
          >
            Super Admin Panel
          </span>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-logout">
          <Link
            to="/"
            className="admin-nav-link text-danger"
            style={{ color: "#fca5a5" }}
          >
            <LogOut size={20} />
            <span>Logout / Exit</span>
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-breadcrumbs">
            <h3 style={{ margin: 0, fontWeight: 700, color: "var(--dark-ui)" }}>
              Super Dashboard{" "}
              {location.pathname.replace("/superadmin", "").replace("/", " > ")}
            </h3>
          </div>
          <div
            className="header-profile"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                className="profile-name"
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--dark-ui)",
                }}
              >
                System Owner
              </span>
              <span
                className="profile-role"
                style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
              >
                Super Administrator
              </span>
            </div>
            <img
              src="https://ui-avatars.com/api/?name=Super+Admin&background=FBBF24&color=000"
              alt="Super Admin Profile"
              className="profile-img"
              style={{ width: "40px", borderRadius: "50%" }}
            />
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
