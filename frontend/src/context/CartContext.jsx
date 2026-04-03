import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  // Load from local storage
  useEffect(() => {
    const items = localStorage.getItem("cartItems");
    if (items) {
      setCartItems(JSON.parse(items));
    }
    const address = localStorage.getItem("shippingAddress");
    if (address) {
      setShippingAddress(JSON.parse(address));
    }
    const payment = localStorage.getItem("paymentMethod");
    if (payment) {
      setPaymentMethod(JSON.parse(payment));
    }
  }, []);

  const addToCart = (product, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image_url || product.image,
      price: product.price,
      countInStock: product.stock_qty || product.countInStock,
      qty,
    };

    const existItem = cartItems.find((x) => x.product === item.product);

    if (existItem) {
      const updatedCart = cartItems.map((x) =>
        x.product === existItem.product ? item : x,
      );
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      const newItems = [...cartItems, item];
      setCartItems(newItems);
      localStorage.setItem("cartItems", JSON.stringify(newItems));
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((x) => x.product !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem("shippingAddress", JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem("paymentMethod", JSON.stringify(data));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
