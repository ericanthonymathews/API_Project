/* action constants */
const LOAD_SPOTS = 'spots/loadSpots';
const LOAD_SPOT = 'spots/loadSpot';

/* action creators */
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots: spots.Spots
});

const loadSpot = (spot) => ({
  type: LOAD_SPOT,
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
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', spot)
    dispatch(loadSpot(spot));
  }
}

/* state helpers */
const initialState = {
  allSpots: {},
  singleSpot: {}
};

/* reducer */
const spotsReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case LOAD_SPOTS:
      const allSpotsObject = {};
      action.spots.forEach((spot) => {
        allSpotsObject[spot.id] = spot;
      });
      newState.allSpots = allSpotsObject;
      return newState;
    case LOAD_SPOT:
      newState.singleSpot = action.spot;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
