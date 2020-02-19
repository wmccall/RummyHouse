import React, { useContext } from "react";
import PropTypes from "prop-types";

import { FirebaseContext } from "../../context";

const LoginSignup = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { signInPopup } = firebaseContext;
  const { isLogin, message } = props;

  const signInHandler = () => {
    signInPopup()
      .then(_ => {})
      .catch(message => {
        console.log(message);
      });
  };

  return (
    <div className={isLogin ? "LoginButton" : "SignupButton"}>
      <button onClick={() => signInHandler()}>
        {!!message ? message : isLogin ? "Login" : "Sign Up"}
      </button>
    </div>
  );
};

export default LoginSignup;

LoginSignup.propTypes = {
  isLogin: PropTypes.bool,
  message: PropTypes.string
};

LoginSignup.defaultProps = {
  isLogin: true,
  message: null
};
