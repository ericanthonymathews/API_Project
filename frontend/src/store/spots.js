import { csrfFetch } from './csrf';

/* action constants */
const LOAD_SPOTS = 'spots/loadSpots';
const LOAD_SPOT = 'spots/loadSpot';
const ADD_SPOT = 'spots/addSpot';

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
  console.log('this is the data!!!!!!!!!!!!!!!!!!!', data);
  if (response.ok) {
    const response2 = await csrfFetch(`/api/spots/${data.id}`, {
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
      const newState = { ...state, singleSpots: {} };
      newState.singleSpot = action.spot;
      return newState;
    }
    case ADD_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots } };
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
