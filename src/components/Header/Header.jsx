import React, { useContext, useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';
import * as URLS from '../../constants/urls';
import ROUTES, { ROUTE_LOCATIONS } from '../../constants/routes';

import LoginSignup from '../LoginSignup';
import UserButton from '../UserButton';

const Header = props => {
  const { location, history } = props;
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  const firebaseContext = useContext(FirebaseContext);
  const { authData, signOut } = firebaseContext;
  const splitLocation = currentLocation.split('/').filter(loc => loc !== '');
  const l1CurrentLocation = `/${splitLocation[0]}`;

  useEffect(() => {
    setCurrentLocation(props.location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log('loginsignup effect');
    console.log(authData);
    if (authData.uid) {
      console.log('authchange noted');
      const headers = new Headers();
      headers.append('id_token', authData.IDToken);
      headers.append('name', authData.displayName);
      const requestOptions = {
        method: 'POST',
        headers,
        redirect: 'follow',
      };

      fetch(`${URLS.BACKEND_SERVER}/signUp`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(location);

          console.log(result);

          console.log(location.pathname);
          console.log(ROUTE_LOCATIONS.indexOf(l1CurrentLocation));
          console.log(
            l1CurrentLocation === ROUTES.GAME && splitLocation.length !== 2,
          );
          if (
            location.pathname === ROUTES.LANDING ||
            ROUTE_LOCATIONS.indexOf(l1CurrentLocation) === -1 ||
            (l1CurrentLocation === ROUTES.GAME && splitLocation.length !== 2)
          ) {
            history.push(ROUTES.HOME);
          }
        })
        .catch(error => {
          console.log('error', error);
          signOut();
        });
    } else if (!authData.waitingForLogin) {
      history.push(ROUTES.LANDING);
    }
  }, [authData]);

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
