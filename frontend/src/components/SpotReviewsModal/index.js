import React from "react";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import ReviewCard from "../ReviewCard";
import './SpotReviews.css';

function SpotReviewsModal() {
  const spotReviews = useSelector((state) => state.reviews.spot);
  const currentSpot = useSelector((state) => state.spots.singleSpot);
  const currentUser = useSelector((state) => state.session.user);
  const { closeModal } = useModal();

  if (!Object.keys(spotReviews).length ||
    !Object.keys(currentSpot).length) return null;
  return (
    <>
      <div className="spot-review-modal">
        <div className="spot-review-modal-top">
          <i className="fa-solid fa-xmark" onClick={closeModal}></i>
          <div></div>
          <div></div>
        </div>
        <div className="modal-heading-container">
          <i className="fa-solid fa-star"></i>
          <div className="modal-avg-star-rating">{currentSpot.avgRating}<li id="modal-dot"></li>{Object.keys(spotReviews).length} reviews</div>
        </div>
        <div className="modal-reviews-container">
          {
            Object.values(spotReviews).map(review => (
              <ReviewCard key={`${review.id}-modal`} user={currentUser} review={review} inModal={true} />
            ))
          }
        </div>
      </div>
    </>
  );
}

export default SpotReviewsModal;
