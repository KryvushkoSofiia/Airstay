import { csrfFetch, restoreCSRF } from "./csrf";

const GET_ALL_REVIEWS = "reviews/GET_REVIEWS";

const actionGetSpotReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        payload: reviews,
    }
}


export const getAllSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

   if (res.ok) {
      const data = await res.json();
      dispatch(actionGetSpotReviews(data.Reviews));
      return data;
   } else {
      const errors = await res.json();
      return errors;
   }
}

const initialState = {
    spot: {},
    user: {},
};
const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_REVIEWS:
            newState = { ...state, spot: {} };
            action.payload.forEach(
                (review) => (newState.spot[review.id] = review)
            );
            return newState;
        default:
            return state;
    }
}


export default reviewsReducer;
