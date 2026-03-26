import { useEffect, useState } from "react";
import api from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [selection, setSelection] = useState({ product_id: "", quantity: 1 });

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

  const payOrder = async (orderId) => {
    try {
      await api.post("/payments", { order_id: orderId, method: "simulated" });
      setMessage("Payment successful (simulated)");
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <section>
      <h2>My Orders</h2>
      {message && <p>{message}</p>}

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
            <p>Status: {order.status}</p>
            <p>Total: ${order.total_amount}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.product_id?.name} x {item.quantity}
                </li>
              ))}
            </ul>
            {order.status !== "cancelled" && (
              <button type="button" onClick={() => cancelOrder(order._id)}>
                Cancel
              </button>
            )}
            <button type="button" onClick={() => payOrder(order._id)}>
              Pay
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OrdersPage;
