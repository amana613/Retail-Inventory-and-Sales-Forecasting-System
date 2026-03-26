import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  if (!product_id || !rating) {
    return res.status(400).json({ message: "product_id and rating are required" });
  }

  const review = await Review.create({
    user_id: req.user._id,
    product_id,
    rating,
    comment: comment || ""
  });

  res.status(201).json(review);
};

export const getReviewsByProduct = async (req, res) => {
  const reviews = await Review.find({ product_id: req.params.productId }).populate("user_id", "name");
  res.json(reviews);
};

export const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only edit your own review" });
  }

  if (req.body.rating != null) review.rating = req.body.rating;
  if (req.body.comment != null) review.comment = req.body.comment;

  await review.save();
  res.json(review);
};

export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const isOwner = review.user_id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to delete this review" });
  }

  await review.deleteOne();
  res.json({ message: "Review deleted" });
};
