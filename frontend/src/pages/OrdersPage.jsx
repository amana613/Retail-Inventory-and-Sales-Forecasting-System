import { useEffect, useState } from "react";
import api from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [selection, setSelection] = useState({ product_id: "", quantity: 1 });
  const [qtyEdit, setQtyEdit] = useState({});

  const loadData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([api.get("/orders/my"), api.get("/products")]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      if (!selection.product_id && productsRes.data.length > 0) {
        setSelection((prev) => ({ ...prev, product_id: productsRes.data[0]._id }));
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createOrder = async (event) => {
    event.preventDefault();

    const selectedProduct = products.find((product) => product._id === selection.product_id);
    if (!selectedProduct) return;

    try {
      await api.post("/orders", {
        items: [
          {
            product_id: selectedProduct._id,
            quantity: Number(selection.quantity),
            price: selectedProduct.price
          }
        ]
      });
      setMessage("Order created");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not create order");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setMessage("Order cancelled");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not cancel order");
    }
  };

  const updateOrderQuantity = async (order) => {
    if (!order.items?.[0]) {
      setMessage("Only orders with items can be updated");
      return;
    }

    const newQty = Number(qtyEdit[order._id]);
    if (Number.isNaN(newQty) || newQty < 1) {
      setMessage("Enter a valid quantity");
      return;
    }

    const firstItem = order.items[0];
    const productId = firstItem.product_id?._id || firstItem.product_id;

    try {
      await api.put(`/orders/${order._id}`, {
        items: [
          {
            product_id: productId,
            quantity: newQty,
            price: firstItem.price
          }
        ]
      });
      setMessage("Order updated");
      setQtyEdit((prev) => ({ ...prev, [order._id]: "" }));
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update order");
    }
  };

  const payOrder = async (orderId) => {
    try {
      await api.post("/payments", { order_id: orderId, method: "simulated" });
      setMessage("Payment successful (simulated)");
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Order Center</h2>
        <p>Create, update, pay, and track all of your order activity.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}

      <section className="card">
        <h3>Create Order</h3>
        <form onSubmit={createOrder}>
          <select
            value={selection.product_id}
            onChange={(e) => setSelection((prev) => ({ ...prev, product_id: e.target.value }))}
          >
            {products.map((product) => (
              <option value={product._id} key={product._id}>
                {product.name} (${product.price})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={selection.quantity}
            onChange={(e) => setSelection((prev) => ({ ...prev, quantity: e.target.value }))}
          />
          <button type="submit">Place Order</button>
        </form>
      </section>

      <div className="grid">
        {orders.map((order) => (
          <article className="card" key={order._id}>
            <p><span className="label">Status</span> {order.status}</p>
            <p className="metric">${order.total_amount}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.product_id?.name} x {item.quantity}
                </li>
              ))}
            </ul>
            <div className="action-row">
              {order.status !== "cancelled" && (
                <button type="button" onClick={() => cancelOrder(order._id)}>
                  Cancel
                </button>
              )}
              <button type="button" onClick={() => payOrder(order._id)}>
                Pay
              </button>
            </div>
            {order.status === "pending" && (
              <div className="inline-form">
                <input
                  type="number"
                  min="1"
                  placeholder="Update qty (first item)"
                  value={qtyEdit[order._id] || ""}
                  onChange={(e) => setQtyEdit((prev) => ({ ...prev, [order._id]: e.target.value }))}
                />
                <button type="button" onClick={() => updateOrderQuantity(order)}>
                  Update
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default OrdersPage;
