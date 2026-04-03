import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating =
      numReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;

    await Product.findByIdAndUpdate(
      productId,
      { rating: avgRating, numReviews },
      { new: true },
    );
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

// @desc    Fetch reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validate input
    if (!productId || !rating) {
      return res
        .status(400)
        .json({ message: "Product ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Create review
    const review = new Review({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment || "",
    });

    const createdReview = await review.save();
    const populatedReview = await createdReview.populate("user", "name email");

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Create Review Error:", error.message);
    res
      .status(400)
      .json({ message: "Invalid review data", error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (user who created it or admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "superAdmin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (user who created it)
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();
    const populatedReview = await updatedReview.populate("user", "name email");

    // Update product rating
    await updateProductRating(review.product);

    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
