import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpotsIndexItem from '../SpotsIndexItem';
import { getSpots } from '../../store/spots';
import './SpotsIndex.css';

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch])

  return (
    <div className="spot-index">
      {
        spots.map(spot => (
          <SpotsIndexItem
            spot={spot}
            key={spot.name}
          />
        ))
      }
    </div>
  );
}

export default SpotsIndex;
