import { csrfFetch } from "./csrf";

//Action types
const GET_ALL_REVIEWS = 'reviews/GET_ALL_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'

//Action creators
const getAllReviews = (review, spotId) => {
    return { type: GET_ALL_REVIEWS, review, spotId } };

const deleteAReview = reviewId => {
    return { type: DELETE_REVIEW, reviewId } }


// Thunk to create a review 
export const createReview = (review, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const review = await response.json();
        dispatch(getSpotReviews(review.spotId));
        return review;
    } else {
        const errors = await response.json();
        return errors;
    }
}

//Thunk to get all reviews for a spot based on spot id
export const getSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const review = await response.json();
        dispatch(getAllReviews(review));
        return review;
    } else {
        const errors = await response.json();
        return errors;
    }
}

//Thunk to delete a review based on review id
export const deleteReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        dispatch(deleteAReview(reviewId));
        return response;
    } else {
        const errors = await response.json();
        return errors;
    }
}

//Initial state for reducer
const initialState = { spot: {}, user: {} }

//Action Reducer
const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {

        case GET_ALL_REVIEWS:
            newState = { ...state, spot: { } };
            action.review.Reviews.forEach(review => {
                newState.spot[review.id] = review;
            })
            return newState;

        case DELETE_REVIEW:
            newState = { ...state, spot: { ...state.spot } }
            delete newState.spot[action.reviewId];
            return newState;

        default:
            return state;
    }
}

export default reviewReducer;
