import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import { FirebaseContext } from "../../context";

const LoginSignup = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { signInPopup } = firebaseContext;
  const { isLogin } = props;

  const signInHandler = () => {
    signInPopup()
      .then(_ => {
        props.history.push(ROUTES.HOME);
      })
      .catch(message => {
        console.log(message);
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

export default compose(withRouter)(LoginSignup);

LoginSignup.propTypes = {
  isLogin: PropTypes.bool
};

LoginSignup.defaultProps = {
  isLogin: true
};
