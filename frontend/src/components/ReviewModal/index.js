import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews';
import './ReviewModal.css'; 

export const ReviewModal = ({ spot }) => {
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [tempRating, setTempRating] = useState(starRating);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (starRating < 1) setErrors({ stars: "Please add star rating." });
    if (reviewText.length < 10)
      setErrors({ review: "Review must be at least 10 characters long" });

    return dispatch(
      reviewActions.createReview({
        review: reviewText,
        stars: starRating,
      }, spot.id))
      .then(closeModal)
      .catch((error) => {
        setErrors(error);
      });
  };

  return (
    <div className="review-modal">
      <h2 className="review-title">How was your stay?</h2>
      <div className="review-errors-text">
        {errors.stars && <span className="error">{errors.stars}</span>}
        {errors.review && <span className="error">{errors.review}</span>}
        {errors.error && <span className="error">{errors.error}</span>}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="review-input"
          type="textarea"
          placeholder="Leave your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <div className="star-rating-container">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div
              key={rating}
              onClick={() => setStarRating(rating)}
              className={`fa-${
                starRating >= rating ? "solid" : "regular"
              } fa-star ${
                tempRating >= rating ? "temp-solid" : "temp-regular"
              }`}
              onMouseEnter={() => setTempRating(rating)}
              onMouseLeave={() => setTempRating(starRating)}
            ></div>
          ))}
          <div className="stars-text">Stars</div>
        </div>
        <button
          className="submit-review-button"
          disabled={!starRating || reviewText.length < 10}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
};
