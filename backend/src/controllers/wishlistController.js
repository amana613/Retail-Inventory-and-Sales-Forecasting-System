import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const items = await Wishlist.find({ user_id: req.user._id }).populate("product_id");
  res.json(items);
};

export const addToWishlist = async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) {
    return res.status(400).json({ message: "product_id is required" });
  }

  try {
    const item = await Wishlist.create({ user_id: req.user._id, product_id });
    res.status(201).json(item);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    throw error;
  }
};

export const removeFromWishlist = async (req, res) => {
  const removed = await Wishlist.findOneAndDelete({
    user_id: req.user._id,
    product_id: req.params.productId
  });

  if (!removed) {
    return res.status(404).json({ message: "Wishlist item not found" });
  }

  res.json({ message: "Removed from wishlist" });
};
