// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id="nav-bar-container">
      <div id="home-button">
        <NavLink className="logo-img-container" exact to="/">
          <img id="home-button-logo" src={"https://seeklogo.com/images/A/airbnb-logo-1D03C48906-seeklogo.com.png"} alt="=logo" />
          <div id="title"><b><em>ample</em></b>bnb</div>
        </NavLink>
      </div>
      {isLoaded && (
        <div id="profile-button-container">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
