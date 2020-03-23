import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { FirebaseContext } from '../../context';
import * as URLS from '../../constants/urls';
import ROUTES from '../../constants/routes';

const LoginSignup = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { signInPopup, signOut, authData } = firebaseContext;
  const { isLogin, message, history } = props;

  const getText = () => {
    if (message) {
      return message;
    }
    if (isLogin) {
      return 'Login';
    }
    return 'Sign Up';
  };

  const signInHandler = () => {
    signInPopup();
  };

  useEffect(() => {
    if (authData.uid) {
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
          console.log(result);
          history.push(`${ROUTES.HOME}`);
        })
        .catch(error => {
          console.log('error', error);
          signOut();
        });
    }
  }, [authData]);

  return (
    <div className={isLogin ? 'LoginButton' : 'SignupButton'}>
      <button onClick={() => signInHandler()} type="button">
        <div>{getText()}</div>
      </button>
    </div>
  );
};

export default compose(withRouter)(LoginSignup);

LoginSignup.propTypes = {
  isLogin: PropTypes.bool,
  message: PropTypes.string,
};

LoginSignup.defaultProps = {
  isLogin: true,
  message: null,
};
