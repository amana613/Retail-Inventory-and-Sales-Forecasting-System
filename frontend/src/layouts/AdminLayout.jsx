import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Truck, ShoppingBag, LogOut, Settings, PackageOpen, UserPlus } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Restocking', path: '/admin/restock', icon: <PackageOpen size={20} /> },
    { name: 'Riders', path: '/admin/admins', icon: <UserPlus size={20} /> },
    { name: 'Suppliers', path: '/admin/suppliers', icon: <Users size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Deliveries', path: '/admin/deliveries', icon: <Truck size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar side-nav">
        <div className="admin-brand">
          <h2>RETAIL<span className="brand-accent" style={{ color: 'var(--primary-red)' }}>PRO</span></h2>
          <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', marginTop: '4px', display: 'inline-block' }}>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-logout">
          <Link to="/" className="admin-nav-link text-danger" style={{ color: '#fca5a5' }}>
            <LogOut size={20} />
            <span>Logout / Exit</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-breadcrumbs">
            {/* Simple breadcrumb logic based on path */}
            <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--dark-ui)' }}>Dashboard {location.pathname.replace('/admin', '').replace('/', ' > ')}</h3>
          </div>
          <div className="header-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span className="profile-name" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark-ui)' }}>System Admin</span>
              <span className="profile-role" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</span>
            </div>
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=E53935&color=fff" alt="Admin Profile" className="profile-img" style={{ width: '40px', borderRadius: '50%' }} />
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
