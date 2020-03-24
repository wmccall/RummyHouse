import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import ROUTES from '../../constants/routes';

import { FirebaseContext } from '../../context';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;
  console.log(`protected: ${authData.uid}, ${authData.waitingForLogin}`);
  if (authData.waitingForLogin || authData.uid) {
    console.log('staying on current page');
  } else {
    console.log('redirecting to landing');
  }
  return (
    <Route
      {...rest}
      render={props =>
        authData.waitingForLogin || authData.uid ? (
          <Component {...props} />
        ) : (
          <Redirect push to={ROUTES.LANDING} />
        )
      }
    />
  );
};

export default PrivateRoute;
