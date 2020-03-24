import React, { useContext, memo } from 'react';
import { Route, Redirect } from 'react-router-dom';

import ROUTES from '../../constants/routes';

import { FirebaseContext } from '../../context';

const UnAuthRoute = memo(({ component: Component, ...rest }) => {
  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;
  console.log(`unauth: ${authData.uid}`);

  return (
    <Route
      {...rest}
      render={props =>
        authData.uid ? (
          <Redirect push to={ROUTES.HOME} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
});

export default UnAuthRoute;
