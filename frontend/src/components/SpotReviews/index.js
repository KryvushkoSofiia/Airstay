import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSpotReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { DeleteReviewModal } from "../ReviewModal/DeleteReviewModal";
import { ReviewModal } from "../ReviewModal";
import { getSingleSpot } from "../../store/spot";
import "./SpotReviews.css";

const SpotReviews = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.review.spot);
  const spotReviews = Object.values(reviews).reverse();
  const singleSpot = useSelector((state) => state.spot.singleSpot);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(getSpotReviews(spotId));
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);

  if (!reviews) return null;

  const userHasReview = sessionUser && spotReviews.some((review) => review.User.id === sessionUser.id);

  const handlePostReviewClick = () => {
    if (!userHasReview) {
      setModalContent(<ReviewModal spot={singleSpot} />);
    }
  };

  return (
    <div className="reviews-wrapper">
      <div className="spot-reviews-container">
        {spotReviews.length === 0 && (
          <div>
            <h2 className="no-reviews-message">Be the first to post a review!</h2>
            {sessionUser && (
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
            {sessionUser && review.User.id === sessionUser.id && (
              <button
                className="delete-review-button"
                onClick={() => setModalContent(<DeleteReviewModal review={review} />)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {sessionUser && !userHasReview && spotReviews.length > 0 && (
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
