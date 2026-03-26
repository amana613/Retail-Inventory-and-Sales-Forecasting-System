import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const [productRes, reviewRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`)
      ]);
      setProduct(productRes.data);
      setReviews(reviewRes.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load product details");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();

    try {
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}`, {
          rating: Number(review.rating),
          comment: review.comment
        });
        setMessage("Review updated");
      } else {
        await api.post("/reviews", {
          product_id: id,
          rating: Number(review.rating),
          comment: review.comment
        });
        setMessage("Review submitted");
      }

      setReview({ rating: 5, comment: "" });
      setEditingReviewId("");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit review");
    }
  };

  const startEditReview = (item) => {
    setReview({ rating: item.rating, comment: item.comment || "" });
    setEditingReviewId(item._id);
  };

  const removeReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setMessage("Review deleted");
      if (editingReviewId === reviewId) {
        setEditingReviewId("");
        setReview({ rating: 5, comment: "" });
      }
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete review");
    }
  };

  if (!product) return <p className="info-banner">Loading product details...</p>;

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Product Details</h2>
        <p>Product information, ratings, and customer reviews.</p>
      </header>

      <article className="card product-hero">
        <h2>{product.name}</h2>
        <p className="muted">{product.category}</p>
        <p className="metric">${product.price}</p>
        <p><span className="label">Stock</span> {product.stock_qty}</p>
        {product.low_stock_alert && <p className="warning">Low stock alert</p>}
        {!product.low_stock_alert && <p className="deal-pill">Everyday low price</p>}
      </article>

      {message && <p className="info-banner">{message}</p>}

      <section className="card">
        <h3>Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((item) => (
          <div key={item._id} className="list-item">
            <p>
              <strong>{item.user_id?.name || "Unknown"}</strong> • {item.rating}/5
            </p>
            <p>{item.comment}</p>
            {(user?._id === item.user_id?._id || user?.role === "admin") && (
              <div className="action-row">
                <button type="button" onClick={() => startEditReview(item)}>
                  Edit
                </button>
                <button type="button" onClick={() => removeReview(item._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {user?.role === "customer" && (
        <section className="card">
          <h3>{editingReviewId ? "Edit Review" : "Write a Review"}</h3>
          <form onSubmit={submitReview}>
            <select
              value={review.rating}
              onChange={(e) => setReview((prev) => ({ ...prev, rating: e.target.value }))}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Review comment"
              value={review.comment}
              onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
            />
            <button type="submit">Submit Review</button>
            {editingReviewId && (
              <button
                type="button"
                onClick={() => {
                  setEditingReviewId("");
                  setReview({ rating: 5, comment: "" });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>
      )}
    </section>
  );
};

export default ProductDetailsPage;
