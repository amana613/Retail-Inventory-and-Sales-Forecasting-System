import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: "" });
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
      await api.post("/reviews", {
        product_id: id,
        rating: Number(review.rating),
        comment: review.comment
      });
      setReview({ rating: 5, comment: "" });
      setMessage("Review submitted");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit review");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <section>
      <article className="card">
        <h2>{product.name}</h2>
        <p>Category: {product.category}</p>
        <p>Price: ${product.price}</p>
        <p>Stock: {product.stock_qty}</p>
        {product.low_stock_alert && <p className="warning">Low stock alert</p>}
      </article>

      {message && <p>{message}</p>}

      <section className="card">
        <h3>Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((item) => (
          <div key={item._id} className="list-item">
            <p>
              <strong>{item.user_id?.name || "Unknown"}</strong> - {item.rating}/5
            </p>
            <p>{item.comment}</p>
          </div>
        ))}
      </section>

      {user?.role === "customer" && (
        <section className="card">
          <h3>Write a Review</h3>
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
          </form>
        </section>
      )}
    </section>
  );
};

export default ProductDetailsPage;
