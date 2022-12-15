import { NavLink } from 'react-router-dom';
import './SpotsIndexItem.css';

const SpotsIndexItem = ({ spot }) => {
  return (
    <div className="spot-index-item">
      <NavLink
        to={`/spots/${spot.id}`}
        className="spot-index-item-navlink"
      >
        <img
          className="spots-card-image"
          src={`${spot.previewImage}`}
          alt="Spot Preview"
        />
        <div className="spots-location">{spot.city}, {spot.state}</div>
        <div className="spots-avg-rating-container">
          <i className="fa-solid fa-star"></i>
          <div className="spots-avg-rating">{spot.avgRating}</div>
        </div>
        <div className="price">${spot.price} Night</div>
      </NavLink>
    </div>
  )
};

export default SpotsIndexItem;
