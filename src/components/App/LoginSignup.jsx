import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

const LoginSignup = props => {
  const { isLogin, firebase } = props;

  const signInHandler = () => {
    firebase.signIn().then(authUser => {
      console.log(authUser);
      props.history.push(ROUTES.HOME);
    });
  };

  return (
    <div className="LoginSignup">
      <button onClick={() => signInHandler()}>
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </div>
  );
};

export default compose(withRouter, withFirebase)(LoginSignup);

LoginSignup.propTypes = {
  isLogin: PropTypes.bool
};

LoginSignup.defaultProps = {
  isLogin: true
};
