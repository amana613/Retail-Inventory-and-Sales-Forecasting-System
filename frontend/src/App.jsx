import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import StorefrontLayout from "./layouts/StorefrontLayout";
import AdminLayout from "./layouts/AdminLayout";
import RiderLayout from "./layouts/RiderLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/OrdersPage";
import AccountPage from "./pages/AccountPage";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminSuppliersPage from "./pages/admin/AdminSuppliersPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminDeliveriesPage from "./pages/admin/AdminDeliveriesPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminForecastPage from "./pages/admin/AdminForecastPage";
import RiderOverviewPage from "./pages/rider/RiderOverviewPage";
import RiderDeliveriesPage from "./pages/rider/RiderDeliveriesPage";

const App = () => {
  return (
    <div className="app-container">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute roles={["customer"]}>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["customer"]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute roles={["customer"]}>
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="suppliers" element={<AdminSuppliersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="deliveries" element={<AdminDeliveriesPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="forecast" element={<AdminForecastPage />} />
        </Route>

        <Route
          path="/rider"
          element={
            <ProtectedRoute roles={["rider"]}>
              <RiderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RiderOverviewPage />} />
          <Route path="deliveries" element={<RiderDeliveriesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
