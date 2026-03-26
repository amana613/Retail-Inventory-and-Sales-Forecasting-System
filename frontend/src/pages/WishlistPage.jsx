import { useEffect, useState } from "react";
import api from "../services/api";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const loadWishlist = async () => {
    try {
      const response = await api.get("/wishlist");
      setItems(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load wishlist");
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setMessage("Removed from wishlist");
      loadWishlist();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to remove item");
    }
  };

  return (
    <section>
      <h2>My Wishlist</h2>
      {message && <p>{message}</p>}
      <div className="grid">
        {items.map((item) => (
          <article className="card" key={item._id}>
            <h3>{item.product_id?.name}</h3>
            <p>Price: ${item.product_id?.price}</p>
            <button type="button" onClick={() => removeItem(item.product_id?._id)}>
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;
