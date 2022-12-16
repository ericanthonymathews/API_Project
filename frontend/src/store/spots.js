import { csrfFetch } from './csrf';

/* action constants */
const LOAD_SPOTS = 'spots/loadSpots';
const LOAD_SPOT = 'spots/loadSpot';
const ADD_SPOT = 'spots/addSpot';
const EDIT_SPOT = 'spots/editSpot';
const DELETE_SPOT = 'spots/deleteSpot'

/* action creators */
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

const loadSpot = (spot) => ({
  type: LOAD_SPOT,
  spot
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot
});

const editSpot = (spot) => ({
  type: EDIT_SPOT,
  spot
});

const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId
});

/* thunk action creators */
export const getSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
  }
}

export const getSingleSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSpot(spot));
  }
}

export const createSpot = (spot, url) => async (dispatch) => {

  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot)
  });

  const data = await response.json();

  if (response.ok) {
    const response2 = await csrfFetch(`/api/spots/${data.id}/images`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        preview: true
      })
    });

    const data2 = await response2.json();

    if (response2.ok) {
      const newSpot = { ...data, avgRating: "N/A", previewImage: data2.url };
      dispatch(addSpot(newSpot));
    }
  }
  return data;
}

export const changeSpot = (editedSpot, spotId) => async (dispatch) => {

  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    body: JSON.stringify(editedSpot)
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(editSpot(data));
  }
  return data;
}

export const removeSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(deleteSpot(spotId));
  }
  return data;
}

/* state helpers */
const initialState = {
  allSpots: {},
  singleSpot: {}
};

/* reducer */
const spotsReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { allSpots: {}, singleSpot: {} };
      action.spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      return newState;
    }
    case LOAD_SPOT: {
      const newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot;
      return newState;
    }
    case ADD_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots } };
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    }
    case EDIT_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } };
      newState.allSpots[action.spot.id] = { ...state.allSpots[action.spot.id], ...action.spot };
      if (Object.values(newState.singleSpot).length) {
        newState.singleSpot = { ...newState.singleSpot, ...action.spot };
      }
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: {} };
      delete newState.allSpots[action.spotId];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
