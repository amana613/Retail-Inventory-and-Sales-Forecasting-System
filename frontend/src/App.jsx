import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StorefrontLayout from './layouts/StorefrontLayout';
import StorefrontHomePage from './pages/StorefrontHomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSuppliersPage from './pages/admin/AdminSuppliersPage';

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
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart/:id?" element={<CartPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="placeorder" element={<PlaceOrderPage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="suppliers" element={<AdminSuppliersPage />} />
          {/* Other admin routes to be added */}
        </Route>

        {/* Rider Dashboard Routes */}
        <Route path="/rider" element={<RiderLayout />}>
          <Route index element={<RiderDashboard />} />
          {/* Other rider routes to be added */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
