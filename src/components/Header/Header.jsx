import React, { useContext, useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';
import ROUTES from '../../constants/routes';

import LoginSignup from '../LoginSignup';
import UserButton from '../UserButton';

const Header = props => {
  const { location } = props;
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;
  const splitLocation = currentLocation.split('/').filter(loc => loc !== '');
  const l1CurrentLocation = `/${splitLocation[0]}`;

  useEffect(() => {
    setCurrentLocation(props.location.pathname);
  }, [location.pathname]);

  let HeaderColor = 'BG-Gray';

  switch (l1CurrentLocation) {
    case ROUTES.GAME:
    case ROUTES.JOIN_GAME:
      HeaderColor = 'BG-Green';
      break;
    case ROUTES.LANDING:
    case ROUTES.HOME:
    default:
      HeaderColor = 'BG-Gray';
  }

  return (
    <div className={`Header ${HeaderColor}`}>
      <Link className="Title" to={authData.uid ? ROUTES.HOME : ROUTES.LANDING}>
        rummy house
      </Link>
      {!authData.uid && (
        <div className="Login">
          <LoginSignup isLogin />
          <LoginSignup isLogin={false} />
        </div>
      )}
      {authData.uid && <UserButton />}
    </div>
  );
};

export default compose(withRouter)(Header);
