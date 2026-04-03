import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Star, Trash2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Message from './Message';
import './ReviewSection.css';

const ReviewSection = ({ productId, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/reviews',
        {
          productId,
          rating: formData.rating,
          comment: formData.comment,
        },
        config
      );

      setReviews([data, ...reviews]);
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete(`/api/reviews/${reviewId}`, config);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return <div className="reviews-section loading">Loading reviews...</div>;
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const userHasReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="reviews-summary">
          <div className="avg-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(parseFloat(avgRating)) ? '#f59e0b' : 'none'}
                  color={i < Math.floor(parseFloat(avgRating)) ? '#f59e0b' : '#CBD5E1'}
                />
              ))}
            </div>
            <span className="rating-value">{avgRating}</span>
            <span className="review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <Message variant="success">Review submitted successfully!</Message>
      )}

      {submitError && (
        <Message variant="danger">{submitError}</Message>
      )}

      {error && <Message variant="warning">{error}</Message>}

      {user ? (
        <div className="review-form-container">
          {userHasReviewed ? (
            <p className="already-reviewed">
              <AlertCircle size={16} />
              You have already reviewed this product
            </p>
          ) : (
            <>
              {!showForm ? (
                <button
                  className="btn btn-outline btn-write-review"
                  onClick={() => setShowForm(true)}
                >
                  Write a Review
                </button>
              ) : (
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="star-label">
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            checked={formData.rating === star}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          />
                          <Star
                            size={24}
                            fill={formData.rating >= star ? '#f59e0b' : 'none'}
                            color={formData.rating >= star ? '#f59e0b' : '#CBD5E1'}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Comment (Optional)</label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={4}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="login-prompt">
          <a href="/login">Sign in</a> to write a review
        </p>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <h5 className="reviewer-name">{review.name}</h5>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? '#f59e0b' : 'none'}
                        color={i < review.rating ? '#f59e0b' : '#CBD5E1'}
                      />
                    ))}
                    <span className="rating-badge">{review.rating}.0</span>
                  </div>
                </div>
                {user?._id === review.user?._id && (
                  <button
                    className="btn-delete-review"
                    onClick={() => handleDeleteReview(review._id)}
                    title="Delete review"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
