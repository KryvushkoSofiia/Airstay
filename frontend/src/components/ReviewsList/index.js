import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllSpotReviews } from '../../store/reviews'; // Import your Redux action for fetching reviews
//import './Reviews.css';

const ReviewsList = ({ spotId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.spot[spotId] || []); // Assuming your Redux state structure matches the reducer's shape

  useEffect(() => {
      // Fetch reviews when the component mounts and when spotId changes
      dispatch(getAllSpotReviews(spotId));
  }, [dispatch, spotId]);

    if (!reviews || reviews.length === 0) {
        return <div className="reviews-container">No reviews available.</div>;
    }

    return (
        <div className="reviews-container">
            <h2>Reviews</h2>
            <ul className="review-list">
                {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                        <div className="user-info">
                            <span className="user-name">{review.user.name}</span>
                            <span className="user-rating">Rating: {review.stars} stars</span>
                        </div>
                        <p className="review-text">{review.review}</p>
                        {/* You can also display review images here if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewsList;
