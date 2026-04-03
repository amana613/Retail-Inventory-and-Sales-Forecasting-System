import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StorefrontLayout from './layouts/StorefrontLayout';
import StorefrontHomePage from './pages/StorefrontHomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';

// Route protections
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RiderRoute from './components/RiderRoute';
import SuperAdminRoute from './components/SuperAdminRoute';

// Super Admin Pages
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboardPage from './pages/admin/SuperAdminDashboardPage';
import SuperAdminAdminsPage from './pages/admin/SuperAdminAdminsPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSuppliersPage from './pages/admin/AdminSuppliersPage';
import AdminDeliveriesPage from './pages/admin/AdminDeliveriesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminRestockPage from './pages/admin/AdminRestockPage';

// Rider Pages
import RiderLayout from './layouts/RiderLayout';
import RiderDashboard from './pages/rider/RiderDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Storefront Routes */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<StorefrontHomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart/:id?" element={<CartPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="placeorder" element={<PlaceOrderPage />} />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="myorders" element={<MyOrdersPage />} />
          </Route>
        </Route>

        {/* Super Admin Dashboard Routes */}
        <Route path="/superadmin" element={<SuperAdminRoute />}>
          <Route element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboardPage />} />
            <Route path="admins" element={<SuperAdminAdminsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="restock" element={<AdminRestockPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="suppliers" element={<AdminSuppliersPage />} />
            <Route path="deliveries" element={<AdminDeliveriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="restock" element={<AdminRestockPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="suppliers" element={<AdminSuppliersPage />} />
            <Route path="deliveries" element={<AdminDeliveriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="admins" element={<SuperAdminAdminsPage />} />
            {/* Other admin routes to be added */}
          </Route>
        </Route>

        {/* Rider Dashboard Routes */}
        <Route path="/rider" element={<RiderRoute />}>
          <Route element={<RiderLayout />}>
            <Route index element={<RiderDashboard />} />
            {/* Other rider routes to be added */}
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
