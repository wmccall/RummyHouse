import React, { useContext, useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';
import ROUTES, { ROUTE_LOCATIONS } from '../../constants/routes';

import LoginSignup from '../LoginSignup';
import UserButton from '../UserButton';

const Header = props => {
  const { location } = props;
  const [currentLocation, setCurrentLocation] = useState(location.pathname);
  useEffect(() => {
    setCurrentLocation(props.location.pathname);
  }, [location.pathname]);

  const firebaseContext = useContext(FirebaseContext);
  const { waitingForLogin, isLoggedIn } = firebaseContext;
  const l1CurrentLocation = `/${currentLocation.split('/')[0]}`;
  if (isLoggedIn) {
    if (
      currentLocation === ROUTES.LANDING ||
      ROUTE_LOCATIONS.indexOf(l1CurrentLocation) === -1
    ) {
      props.history.push(ROUTES.HOME);
    }
  } else if (!waitingForLogin) {
    if (currentLocation !== ROUTES.LANDING) {
      props.history.push(ROUTES.LANDING);
    }
  }
  let HeaderColor = 'BG-Gray';

  switch (props.location.pathname) {
    case ROUTES.LANDING:
      HeaderColor = 'BG-Gray';
      break;
    case ROUTES.HOME:
      HeaderColor = 'BG-Gray';
      break;
    default:
      HeaderColor = 'BG-Green';
  }

  return (
    <div className={`Header ${HeaderColor}`}>
      <Link className="Title" to={isLoggedIn ? ROUTES.HOME : ROUTES.LANDING}>
        rummy house
      </Link>
      {!isLoggedIn && (
        <div className="Login">
          <LoginSignup />
          <LoginSignup isLogin={false} />
        </div>
      )}
      {isLoggedIn && <UserButton />}
    </div>
  );
};

export default compose(withRouter)(Header);
