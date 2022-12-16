import { csrfFetch } from './csrf';

/* action constants */
const LOAD_SPOT_REVIEWS = 'reviews/loadSpotReviews';
const ADD_SPOT_REVIEW = 'reviews/addSpotReview';
const DELETE_SPOT_REVIEW = 'reviews/deleteSpotReview';

/* action creators */
const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews
});

const addSpotReview = (review) => ({
  type: ADD_SPOT_REVIEW,
  review
})

const deleteSpotReview = (reviewId) => ({
  type: DELETE_SPOT_REVIEW,
  reviewId
});

/* thunk action creators */
export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  const data = await response.json();
  if (response.ok) {
    dispatch(loadSpotReviews(data.Reviews));
  }
};

export const createReview = (newReview, spotId, user) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(newReview)
  });
  if (response.ok) {
    const data = await response.json();
    data.User = user;
    dispatch(addSpotReview(data));
    return data;
  }
}

export const removeSpotReview = (reviewId, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    dispatch(deleteSpotReview(reviewId));
  }
  return response;
};
/* state helpers */
const initialState = {
  spot: {},
  user: {}
}
/* reducer */
const reviewsReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const newState = { spot: {}, user: {} };
      action.reviews.forEach((review) => {
        newState.spot[review.id] = review;
      })
      return newState;
    }
    case ADD_SPOT_REVIEW: {
      const newState = { spot: { ...state.spot, [action.review.id]: action.review }, user: {} };
      return newState;
    }
    case DELETE_SPOT_REVIEW: {
      const newState = { spot: { ...state.spot }, user: { ...state.user } };
      delete newState.spot[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
