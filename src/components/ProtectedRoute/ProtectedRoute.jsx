import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import ROUTES from '../../constants/routes';

import { FirebaseContext } from '../../context';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;
  console.log(`protected: ${authData.uid}`);
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
