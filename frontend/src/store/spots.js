/* action constants */
const LOAD_SPOTS = 'spots/loadSpots';
const LOAD_SPOT = 'spots/loadSpot';
const ADD_SPOT = 'spots/addSpot';

/* action creators */
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots: spots.Spots
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
    const spots = await response.json();
    dispatch(loadSpots(spots));
  }
}

export const getSingleSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSpot(spot));
  }
}

export const createSpot = (spot) => async (dispatch) => {
  // const {
  //   address,
  //   city,
  //   state,
  //   country,
  //   lat,
  //   lng,
  //   name,
  //   description,
  //   price
  // } = spot;
  const response = await fetch('api/spots', {
    method: 'POST',
    body: JSON.stringify(spot)
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(addSpot(data));
  }
  return response;
}

/* state helpers */
const initialState = {
  allSpots: {},
  singleSpot: {}
};

/* reducer */
const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      newState = { ...state };
      const allSpotsObject = {};
      action.spots.forEach((spot) => {
        allSpotsObject[spot.id] = spot;
      });
      newState.allSpots = allSpotsObject;
      return newState;
    case LOAD_SPOT:
      newState = { ...state };
      newState.singleSpot = action.spot;
      return newState;
    case ADD_SPOT:
      newState = { ...state };
      const newSpot = { ...action.spot, avgRating: "N/A", previewImage: "no preview image found" };
      const updatedSpotObject = { ...state.allSpots, [newSpot.id]: newSpot };
      newState.allSpots = updatedSpotObject;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
