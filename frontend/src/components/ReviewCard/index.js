import { useDispatch } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SpotReviewsModal from '../SpotReviewsModal';
import { removeSpotReview } from '../../store/reviews';
import './ReviewCard.css';
// 183 > gets abbreviated if it's not in the modal;
const ReviewCard = ({ user, review, inModal }) => {
  const dispatch = useDispatch();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(removeSpotReview(review.id, review.spotId));
  };

  const dateInfo = review.createdAt.split("-");
  const year = dateInfo[0];
  const month = dateInfo[1];
  if (inModal) {
    return (
      <div className="modal-card">
        <div className="modal-card-header">
          <div className="modal-card-header-text">
            <div className="modal-card-user">
              {review.User.firstName}
            </div>
            <div className="modal-card-date">
              {months[Number(month) - 1]} {year}
            </div>
          </div>
          <div className="modal-header-buttons">
            {user && review.User.id === user.id &&
              <div>Buttons to Edit and Delete will go here</div>
            }
          </div>
        </div>
        <div className="modal-text-wrapper">
          <div className="review-text-display">
            {review.review}
          </div>
        </div>
      </div>
    );
  }
  if (!inModal) {
    return (
      <div className="preview-card">
        <div className="preview-card-header">
          <div className="preview-card-header-text">
            <div className="preview-card-user">
              {review.User.firstName}
            </div>
            <div className="preview-card-date">
              {months[Number(month) - 1]} {year}
            </div>
          </div>
          <div className="preview-header-buttons">
            {user && review.User.id === user.id &&
              <div onClick={handleDelete} className="delete-spot-button">Delete</div>
            }
          </div>
        </div>
        <div className="preview-text-wrapper">
          {review.review.length <= 181 &&
            <div className="text-display">
              {review.review}
            </div>
          }
          {review.review.length > 181 &&
            <div className="previews-and-button">
              <div className="preview-text-display">
                {review.review.slice(0, 182)}...
              </div>
              <OpenModalMenuItem
                itemText="Show more"
                modalComponent={<SpotReviewsModal />}
              />
            </div>
          }
        </div>
      </div>
    );
  }
};

export default ReviewCard;
