import { NavLink } from 'react-router-dom';
import './SpotsIndexItem.css';

const SpotsIndexItem = ({ spot }) => {
  return (
    <div className="spot-index-item">
      <NavLink
        to={`/spots/${spot.id}`}
        className="spot-index-item-navlink"
      >
        <div className="spots-card-image-container">
          <img
            className="spots-card-image"
            src={`${spot.previewImage}`}
            alt="https://www.myaglender.com/assets/images/processed/NoCrop_2560x2560/292-framing-of-house-under-construction.png"
          />
        </div>
        <div className="location-and-rating">
          <div className="spots-location"><b>{spot.city}, {spot.state}</b></div>
          {spot.avgRating &&
            <div className="spots-avg-rating-container">
              <i className="fa-solid fa-star"></i>
              <div className="spots-avg-rating">{spot.avgRating}</div>
            </div>
          }
        </div>
        <div className="price"><strong>${spot.price}</strong> night</div>
      </NavLink>
    </div>
  )
};

export default SpotsIndexItem;
