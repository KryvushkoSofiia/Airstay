import { csrfFetch, restoreCSRF } from "./csrf";

// Action Types
const LOAD = 'spot/LOAD';
const LOAD_ONE = 'spot/LOAD_ONE';
const CREATE_SPOT = 'spot/CREATE_SPOT';
const UPLOAD_IMAGE = 'spot/UPLOAD_IMAGE';
const UPDATE_SPOT = 'spot/UPDATE_SPOT';
const DELETE_SPOT = 'spot/DELETE_SPOT';

// Action Creators
const loadSpot = (spot) => ({
  type: LOAD,
  spot
});

const loadOneSpot = (spot) => ({
  type: LOAD_ONE,
  spot
});

const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const uploadImageAction = (imageData) => ({
  type: UPLOAD_IMAGE,
  imageData,
});

const updateSpotAction = (updatedSpot) => ({
  type: UPDATE_SPOT,
  updatedSpot,
});

const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

// Thunk Action to fetch all spots
export const getSpot = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
      const spot = await response.json();
      console.log("SPOT", spot);
      dispatch(loadSpot(spot));
    } else {
      throw new Error('Failed to fetch spot');
    }

};

// Thunk Action to fetch a single spot by spotId
export const getSingleSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
      const spot = await response.json();
      console.log("SPOT for single spot", spot);
      dispatch(loadOneSpot(spot));
    } else {
      throw new Error('Failed to fetch spot');
    }
};


export const createSpot = (spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotData),
    });

    if (response.ok) {
      const createdSpot = await response.json();
      const spotId = createdSpot.id;
      //dispatch(createSpotAction(createdSpot));
      return spotId;
    } else {
      throw new Error('Failed to create spot');
    }
};

//thunk to upload image
export const uploadImage = (imageData, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });

    if (response.ok) {
      const uploadedImage = await response.json();
      dispatch(uploadImageAction(uploadedImage));
      return uploadedImage;
    } else {
      throw new Error('Failed to upload image');
    }
};

//Thunk to update a spot 
export const updateSpot = (spotData) => async (dispatch) => {
    const { address, city, state, country, name, description, price, id } = spotData;

    const response = await csrfFetch(`/api/spots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        city,
        state,
        country,
        name,
        description,
        price,
      }),
    });

    if (response.ok) {
      const updatedSpot = await response.json();
      //dispatch(updateSpotAction(updatedSpot));
      return updatedSpot;
    } else {
      throw new Error('Failed to update spot');
    }
};

// Thunk to delete a spot by spotId
export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteSpotAction(spotId));
    } else {
      const errorData = await response.json();
      throw new Error(`Failed to delete spot: ${errorData.message}`);
    }
};

//Initial state for reducer
const initialState = {
  spot: {},
};

// Action Reducer
const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        spot: action.spot,
      };
    case LOAD_ONE:
      return {
        ...state,
        singleSpot: action.spot,
      };
    case CREATE_SPOT:
      return {
        ...state,
        spot: [...state.spot, action.spot],
      };
    case UPLOAD_IMAGE:
      return {
        ...state,
        singleSpot: {
          ...state.singleSpot,
          SpotImages: [...state.singleSpot.SpotImages, action.imageData],
        },
      };
    case UPDATE_SPOT:
      return {
        ...state,
        singleSpot: action.updatedSpot,
      };
    case DELETE_SPOT:
      const { [action.spotId]: deletedSpot, ...restSpots } = state.spot;
      return {
        ...state,
        spot: restSpots,
      };
    default:
      return state;
  }
};

export default spotReducer;
