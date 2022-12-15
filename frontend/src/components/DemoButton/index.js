import { useDispatch } from 'react-redux';
import * as sessionActions from "../../store/session";
import './DemoButton.css';

const DemoButton = () => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }));
  }

  return (
    <div className="demo-button" onClick={handleClick}>Demo Button</div>
  );
}

export default DemoButton;
