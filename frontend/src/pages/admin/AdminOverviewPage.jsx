import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminOverviewPage = () => {
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0,
    suppliers: 0,
    orders: 0,
    pendingOrders: 0,
    deliveries: 0,
    delivered: 0,
    revenue: 0
  });

  useEffect(() => {
    const loadOverview = async () => {
      const [productsRes, suppliersRes, ordersRes, deliveriesRes, paymentsRes] = await Promise.all([
        api.get("/products"),
        api.get("/suppliers"),
        api.get("/orders"),
        api.get("/deliveries"),
        api.get("/payments")
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const deliveries = deliveriesRes.data;
      const payments = paymentsRes.data;

      setStats({
        products: products.length,
        lowStock: products.filter((item) => item.low_stock_alert).length,
        suppliers: suppliersRes.data.length,
        orders: orders.length,
        pendingOrders: orders.filter((order) => order.status === "pending").length,
        deliveries: deliveries.length,
        delivered: deliveries.filter((delivery) => delivery.status === "delivered").length,
        revenue: payments
          .filter((payment) => payment.status === "success")
          .reduce((sum, payment) => sum + payment.amount, 0)
      });
    };

    loadOverview();
  }, []);

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Overview</h2>
        <p>Key metrics for inventory, orders, delivery, and revenue.</p>
      </header>

      <div className="kpi-grid">
        <article className="kpi-card"><h3>Products</h3><p>{stats.products}</p></article>
        <article className="kpi-card"><h3>Low Stock</h3><p>{stats.lowStock}</p></article>
        <article className="kpi-card"><h3>Suppliers</h3><p>{stats.suppliers}</p></article>
        <article className="kpi-card"><h3>Orders</h3><p>{stats.orders}</p></article>
        <article className="kpi-card"><h3>Pending Orders</h3><p>{stats.pendingOrders}</p></article>
        <article className="kpi-card"><h3>Deliveries</h3><p>{stats.deliveries}</p></article>
        <article className="kpi-card"><h3>Delivered</h3><p>{stats.delivered}</p></article>
        <article className="kpi-card"><h3>Revenue</h3><p>${stats.revenue.toFixed(2)}</p></article>
      </div>
    </section>
  );
};

export default AdminOverviewPage;
