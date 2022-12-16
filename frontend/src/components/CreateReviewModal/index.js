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
  const [stars, setStars] = useState(5);
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
      <h1>Create Review</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Stars
          <input
            type="text"
            value={stars}
            placeholder="1 - 5"
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            value={review}
            placeholder="Tell us about your experience!"
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Review</button>
      </form>
    </div>
  )

}

export default CreateReviewModal;
