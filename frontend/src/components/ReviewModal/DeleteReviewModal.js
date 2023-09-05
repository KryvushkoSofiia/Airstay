import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from '../../store/reviews'
import { useEffect } from "react";
import "./DeleteReviewModal.css"; 

export const DeleteReviewModal = ({ review }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleClick = (e) => {
        e.preventDefault();
        return dispatch(reviewActions.deleteReview(review.id)).then(closeModal)
    }

    useEffect(() => {
        dispatch(reviewActions.getSpotReviews(review.spotId))
    }, [dispatch])

    return (
        <div className="delete-review-modal">
            <div className="confirm-delete-title">
                <h2>Confirm Delete</h2>
                <p className="delete-paragraph">Are you sure you want to delete this review?</p>
            </div>
            <div className="delete-buttons">
                <button className="yes-button" onClick={handleClick}>Yes (Delete Review)</button>
                <button className="no-button" onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}
