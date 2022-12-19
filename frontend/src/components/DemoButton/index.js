import { useDispatch } from 'react-redux';
import * as sessionActions from "../../store/session";
import './DemoButton.css';

const DemoButton = ({ closeMenu }) => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }));
    closeMenu();
  }

  return (
    <div id="demo-button" className="profile-dropdown-button" onClick={handleClick}>Demo Button</div>
  );
}

export default DemoButton;
