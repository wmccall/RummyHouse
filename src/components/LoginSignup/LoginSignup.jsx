import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { FirebaseContext } from '../../context';
import * as URLS from '../../constants/urls';

const LoginSignup = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { signInPopup } = firebaseContext;
  const { isLogin, message } = props;

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
    signInPopup()
      .then(authData => {
        const headers = new Headers();
        headers.append('id_token', authData[1]);
        headers.append('name', authData[0].user.displayName);
        const requestOptions = {
          method: 'POST',
          headers,
          redirect: 'follow',
        };

        fetch(`${URLS.BACKEND_SERVER}/signUp`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className={isLogin ? 'LoginButton' : 'SignupButton'}>
      <button onClick={() => signInHandler()} type="button">
        <div>{getText()}</div>
      </button>
    </div>
  );
};

export default LoginSignup;

LoginSignup.propTypes = {
  isLogin: PropTypes.bool,
  message: PropTypes.string,
};

LoginSignup.defaultProps = {
  isLogin: true,
  message: null,
};
