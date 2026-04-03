import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Activity,
  PackageOpen,
} from "lucide-react";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    {
      name: "Restocking",
      path: "/admin/restock",
      icon: <PackageOpen size={20} />,
    },
    { name: "Suppliers", path: "/admin/suppliers", icon: <Users size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    {
      name: "Deliveries",
      path: "/admin/deliveries",
      icon: <Truck size={20} />,
    },
  ];

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: "250px",
        padding: "24px 0",
        borderRight: "1px solid #1E293B",
      }}
    >
      <div
        className="sidebar-brand"
        style={{ padding: "0 24px", marginBottom: "40px" }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.25rem",
            color: "white",
            letterSpacing: "1px",
          }}
        >
          <span style={{ color: "var(--primary-red)" }}>RETAIL</span>ADMIN
        </h1>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`sidebar-link ${location.pathname === link.path ? "active" : ""}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
