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
      if (currentUser.id === singleSpot.ownerId) {
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
      <div className="spot-header">
        <div className="spot-header-left">
          <div className="spot-title"><h1>{singleSpot.name}</h1></div>
          <div className="second-row">
            <div className="second-row-item"><i className="fa-solid fa-star"></i>{singleSpot.avgRating}</div>
            <li
              className="second-row-item-underline"
            >
              <OpenModalMenuItem
                itemText={`${Object.keys(spotReviews).length} reviews`}
                modalComponent={<SpotReviewsModal />}
              />
            </li>
            <div className="second-row-item-underline">{singleSpot.city}, {singleSpot.state}, {singleSpot.country}</div>
          </div>
        </div>
        <div className="spotshow-host-actions">
          {currentUser && currentUser.id === singleSpot.Owner.id &&
            <>
              <NavLink className="spotshow-edit-spot-button" exact to={`/spots/${singleSpot.id}/edit`}><i className="fa-solid fa-pen-to-square"></i>Edit</NavLink>
              <NavLink className="spotshow-delete-spot-button" exact to={`/spots/${singleSpot.id}/delete`}><i className="fa-solid fa-trash"></i>Delete</NavLink>
            </>
          }
        </div>
      </div>
      {singleSpot && singleSpot.SpotImages && singleSpot.SpotImages.length > 0 &&
        <img
          className='first-img'
          src={`${singleSpot.SpotImages[0].url}`}
          alt={"https://www.myaglender.com/assets/images/processed/NoCrop_2560x2560/292-framing-of-house-under-construction.png"}
        />
      }
      <div className="bottom-half">
        <div className="left-half">
          <div className="hosted-by">Listing hosted by {singleSpot.Owner.firstName}</div>
          <div className="spot-description">{singleSpot.description}</div>
        </div>
        <div className="right-half">
          <div className="spotshow-pricecard">
            <div className="pricecard-header-left">
              <div className="pricecard-header-price"><strong>${singleSpot.price}</strong> night</div>
            </div>
            <div className="pricecard-header-right">
              <div className="second-row-item"><i className="fa-solid fa-star"></i>{singleSpot.avgRating}</div>
              <li
                className="second-row-item-underline"
              >
                <OpenModalMenuItem
                  itemText={`${Object.keys(spotReviews).length} reviews`}
                  modalComponent={<SpotReviewsModal />}
                />
              </li>
            </div>
          </div>
        </div>
      </div>
      <div className="reviews-container">
        <div className="reviews-container-header">
          <i className="fa-solid fa-star"></i>
          <div className="avg-star-rating">  {singleSpot.avgRating}</div>
          <li className="number-of-reviews">{Object.keys(spotReviews).length} reviews</li>
        </div>
        <div className="reviews-list">
          {firstSixReviews.map((review) => (
            <ReviewCard key={`${review.id}-first-six`} user={currentUser} review={review} inModal={false} />
          ))
          }
        </div>
        <div id="spot-buttons">
          <div id="show-all-reviews-button">
            <OpenModalMenuItem
              itemText={`Show all ${Object.keys(spotReviews).length} reviews`}
              modalComponent={<SpotReviewsModal />}
            />
          </div>
          {showReviewButton &&
            <div id="create-review">
              <OpenModalMenuItem
                itemText={`Create a review for this listing`}
                modalComponent={<CreateReviewModal />}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default SpotShow;
