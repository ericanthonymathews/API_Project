import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import { createReview } from '../../store/reviews';
import './CreateReview.css';

function CreateReviewModal() {
  const spot = useSelector((state) => state.spots.singleSpot);
  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    let user = {
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName

    }
    let newReview = {
      review,
      stars
    };

    return dispatch(createReview(newReview, spot.id, user))
      .then(
        async (data) => {
          if (data.id) {
            closeModal();
          }
        }
      )
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      )
  };



  return (
    <div className="create-review-form">
      <div className="modal-title-container">
        <i className="fa-solid fa-xmark" onClick={closeModal}></i>
        <div className="modal-title"><b>Sign Up</b></div>
        <div></div>
      </div>
      <form id="create-review-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <input
          id="review-input-top"
          className="modal-input-field"
          type="text"
          value={stars}
          placeholder="Stars: 1 - 5"
          onChange={(e) => setStars(e.target.value)}
          required
        />
        <input
          id="review-input-bottom"
          className="modal-input-field"
          type="text"
          value={review}
          placeholder="Tell us about your experience!"
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <button className="modal-bottom-button" type="submit">Create Review</button>
      </form>
    </div>
  )

}

export default CreateReviewModal;
