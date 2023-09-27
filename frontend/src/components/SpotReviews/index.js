import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";

import { getSpotReviews } from "../../store/reviews";
import { DeleteReviewModal } from "../ReviewModal/DeleteReviewModal";
import { ReviewModal } from "../ReviewModal";

import "./SpotReviews.css";

const SpotReviews = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const userId = sessionUser ? sessionUser.id : null; // Check if sessionUser is null
  console.log("sessionUser", sessionUser); 
  console.log("USERID", userId);
  const reviews = useSelector((state) => state.review.spot);
  const spotReviews = Object.values(reviews).reverse();
  const singleSpot = useSelector((state) => state.spot.singleSpot);
  console.log("Single spot", singleSpot);

  console.log("Reviews", reviews);
  console.log("Typeof Reviews:", typeof reviews);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  // Check if the current user is the owner of the spot
  const isCurrentUserOwner = userId === singleSpot.ownerId; 

  const userHasReview = userId && spotReviews.some((review) => review.User.id === userId); 

  const handlePostReviewClick = () => {
    if (!isCurrentUserOwner && !userHasReview) {
      setModalContent(<ReviewModal spot={singleSpot} />);
    }
  };

  return (
    <div className="reviews-wrapper">
      <div className="spot-reviews-container">
        {isCurrentUserOwner && spotReviews.length === 0 && (
          <h2 className="owner-message">You are the owner of this spot</h2>
        )}
        {!isCurrentUserOwner && spotReviews.length === 0 && (
          <div>
            <h2 className="no-reviews-message">Be the first to post a review!</h2>
            {userId && (
              <button
                className="post-review-button"
                onClick={handlePostReviewClick}
              >
                Post your review
              </button>
            )}
          </div>
        )}
        {spotReviews.map((review) => (
          <div key={`${review.id}`} className="review">
            <span className="review-author">{`${review.User.firstName} ${review.User.lastName}`}</span>
            <span className="review-date">{formatDate(review.createdAt)}</span>
            <div className="review-body">{review.review}</div>
            {userId && review.User.id === userId && (
              <button
                className="delete-review-button"
                onClick={() => setModalContent(<DeleteReviewModal review={review} />)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {!isCurrentUserOwner && userId && !userHasReview && spotReviews.length > 0 && (
          <button
            className="add-review-button"
            onClick={handlePostReviewClick}
          >
            Add Review
          </button>
        )}
      </div>
    </div>
  );
};

export default SpotReviews;
