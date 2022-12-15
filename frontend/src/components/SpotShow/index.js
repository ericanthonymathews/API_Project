import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getSingleSpot } from '../../store/spots';
import "./SpotShow.css";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const singleSpot = useSelector((state) => {
    return state.spots.singleSpot;
  })

  const currentUser = useSelector((state) => {
    return state.session.user;
  })

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [spotId, dispatch]);

  if (!Object.keys(singleSpot).length) return null;
  return (
    <div className="spot-data">
      <div className="spot-title">{singleSpot.name}</div>
      <div className="spot-header">
        <i className="fa-solid fa-star"></i>
        <div className="avg-star-rating">{singleSpot.avgStarRating}</div>
        <div className="number-of-reviews">{singleSpot.numReviews}</div>
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
    </div>
  )
}

export default SpotShow;
