import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user?.token) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await axios.get("/api/wishlist", config);
      setWishlistItems(data.products || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user?.token) {
      throw new Error("Please login to add items to wishlist");
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await axios.post(
        "/api/wishlist/add",
        { productId: product._id },
        config,
      );
      setWishlistItems(data.products || []);
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add to wishlist";
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user?.token) {
      throw new Error("Please login to remove items from wishlist");
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await axios.delete(
        `/api/wishlist/remove/${productId}`,
        config,
      );
      setWishlistItems(data.products || []);
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Failed to remove from wishlist";
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const clearWishlist = async () => {
    if (!user?.token) {
      throw new Error("Please login to clear wishlist");
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete("/api/wishlist/clear", config);
      setWishlistItems([]);
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Failed to clear wishlist";
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
