import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getSingleSpot } from '../../store/spots';
import { getSpotReviews } from '../../store/reviews';
import ReviewCard from '../ReviewCard';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SpotReviewsModal from '../SpotReviewsModal';
import CreateReviewModal from '../CreateReviewModal';
import "./SpotShow.css";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [firstSixReviews, setFirstSixReviews] = useState([]);
  const [showReviewButton, setShowReviewButton] = useState(false);

  const singleSpot = useSelector((state) => {
    return state.spots.singleSpot;
  });

  const currentUser = useSelector((state) => {
    return state.session.user;
  });

  const spotReviews = useSelector((state) => {
    return state.reviews.spot;;
  });

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
    dispatch(getSpotReviews(spotId));
  }, [spotId, dispatch]);

  useEffect(() => {
    const allReviewsArray = Object.values(spotReviews);
    let firstSixArray = [];
    for (let i = 0; i < 6; i++) {
      let currentReview = allReviewsArray[i];
      if (currentReview) {
        firstSixArray.push(currentReview);
      }
    }
    setFirstSixReviews(firstSixArray);
  }, [spotReviews]);

  useEffect(() => {
    if (!currentUser || !singleSpot) {
      return setShowReviewButton(false);
    }
    if (currentUser && singleSpot) {
      if (currentUser === singleSpot.ownerId) {
        return setShowReviewButton(false);
      }
    }
    if (Object.keys(spotReviews).length) {
      const reviewsObjectArray = Object.values(spotReviews);
      for (let i = 0; i < reviewsObjectArray.length; i++) {
        if (reviewsObjectArray[i].userId === currentUser.id) {
          return setShowReviewButton(false);
        }
      }
    }
    return setShowReviewButton(true);
  }, [spotReviews, singleSpot, currentUser]);


  if (!Object.keys(singleSpot).length) return null;
  return (
    <div className="spot-data">
      <div className="spot-title">{singleSpot.name}</div>
      <div className="spot-header">
        <i className="fa-solid fa-star"></i>
        <div className="avg-star-rating">{singleSpot.avgStarRating}</div>
        <div className="number-of-reviews">{singleSpot.numReviews} reviews</div>
        <div className="spot-address">{singleSpot.city}, {singleSpot.state}, {singleSpot.country}</div>
      </div>
      {singleSpot && singleSpot.SpotImages && singleSpot.SpotImages.length > 0 &&
        <img
          className='first-img'
          src={`${singleSpot.SpotImages[0].url}`}
          alt={singleSpot.SpotImages[0].url}
        />
      }
      <div className="hosted-by">hosted by {singleSpot.Owner.firstName}</div>
      {currentUser && currentUser.id === singleSpot.Owner.id &&
        <div className="spotshow-host-actions">
          <NavLink className="spotshow-edit-spot-button" exact to={`/spots/${singleSpot.id}/edit`}>Edit Listing</NavLink>
          <NavLink className="spotshow-delete-spot-button" exact to={`/spots/${singleSpot.id}/delete`}>Delete Listing</NavLink>
        </div>
      }
      <div className="reviews-container">
        <div className="reviews-container-header">
          <i className="fa-solid fa-star"></i>
          <div className="avg-star-rating">{singleSpot.avgStarRating}</div>
          <div className="number-of-reviews">{singleSpot.numReviews} reviews</div>
        </div>
        <div className="reviews-list">
          {firstSixReviews.map((review) => (
            <ReviewCard key={`${review.id}-first-six`} user={currentUser} review={review} inModal={false} />
          ))
          }
          <OpenModalMenuItem
            itemText={`Show all ${singleSpot.numReviews} reviews`}
            modalComponent={<SpotReviewsModal />}
          />
          {showReviewButton &&
            <OpenModalMenuItem
              itemText={`Create a review for this listing`}
              modalComponent={<CreateReviewModal />}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default SpotShow;
