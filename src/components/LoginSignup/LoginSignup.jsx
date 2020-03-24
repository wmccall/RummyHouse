import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { FirebaseContext } from '../../context';

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
    signInPopup();
  };

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
