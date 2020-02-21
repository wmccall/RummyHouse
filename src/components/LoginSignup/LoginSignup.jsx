import React, { useContext } from "react";
import PropTypes from "prop-types";

import { FirebaseContext } from "../../context";
import * as URLS from "../../constants/urls";

const LoginSignup = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { signInPopup } = firebaseContext;
  const { isLogin, message } = props;

  const signInHandler = () => {
    signInPopup()
      .then(authData => {
        var headers = new Headers();
        headers.append("id_token", authData[1]);
        headers.append("name", authData[0].user.displayName);
        var requestOptions = {
          method: "POST",
          headers: headers,
          redirect: "follow"
        };

        fetch(`${URLS.BACKEND_SERVER}/signUp`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log("error", error));
      })
      .catch(message => {
        console.log(message);
      });
  };

  return (
    <div className={isLogin ? "LoginButton" : "SignupButton"}>
      <button onClick={() => signInHandler()}>
        <div>{!!message ? message : isLogin ? "Login" : "Sign Up"}</div>
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
