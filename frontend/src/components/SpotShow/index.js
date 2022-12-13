import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSingleSpot } from '../../store/spots';
import "./SpotShow.css";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const singleSpot = useSelector((state) => {
    return state.spots.singleSpot;
  })

  useEffect(() => {
    dispatch(getSingleSpot(spotId))
  }, [dispatch, spotId]);

  if (!singleSpot) return null;
  return (
    <div className="spot-data">
      <div className="spot-title">{singleSpot.name}</div>
      <div className="spot-header">
        <i className="fa-solid fa-star"></i>
        <div className="avg-star-rating">{singleSpot.avgStarRating}</div>
        <div className="number-of-reviews">{singleSpot.numReviews}</div>
        <div className="spot-address">{singleSpot.city}, {singleSpot.state}, {singleSpot.country}</div>
      </div>
      {/* <img
        className="first-image"
        src={`${singleSpot.SpotImages[0]}`}
        alt="Single Spot"
      /> */}
      {singleSpot.SpotImages.length > 0 &&
        <img
          className='first-img'
          src={`${singleSpot.SpotImages[0].url}`}
          alt={singleSpot.SpotImages[0].url}
        />
      }
      <div className="hosted-by">hosted by {singleSpot.Owner.firstName}</div>
    </div>
  )
}

export default SpotShow;
