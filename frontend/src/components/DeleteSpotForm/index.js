import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeSpot } from "../../store/spots";
import './DeleteSpot.css';

const DeleteSpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const singleSpot = useSelector((state) => state.spots.singleSpot);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(removeSpot(singleSpot.id));
    history.push('/');
  }

  return (
    <div className="delete-spot-page">
      <div className="delete-spot-header">Are you sure you want to delete this listing?</div>
      <div className="delete-spot-form">
        <NavLink className="delete-spot-cancel" exact to={`/spots/${singleSpot.id}`}>Cancel</NavLink>
        <div className='delete-spot-confirm' onClick={handleSubmit}>Confirm</div>
      </div>
    </div>
  )
}

export default DeleteSpotForm;
