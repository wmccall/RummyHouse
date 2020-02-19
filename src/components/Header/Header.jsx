import React, { useContext, useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";
import * as ROUTES from "../../constants/routes";

import LoginSignup from "../LoginSignup/LoginSignup";
import Logout from "../Logout/Logout";

const Header = props => {
  const [currentLocation, setCurrentLocation] = useState(
    props.location.pathname
  );
  useEffect(() => {
    setCurrentLocation(props.location.pathname);
  }, [props.location.pathname]);

  const firebaseContext = useContext(FirebaseContext);
  const { waitingForLogin, isLoggedIn } = firebaseContext;
  if (!isLoggedIn && !waitingForLogin) {
    console.log("not log");
    if (currentLocation !== ROUTES.LANDING) {
      props.history.push(ROUTES.LANDING);
    }
  } else if (isLoggedIn && currentLocation === ROUTES.LANDING) {
    props.history.push(ROUTES.HOME);
  }
  var HeaderColor = "BG-Gray";

  switch (props.location.pathname) {
    case ROUTES.LANDING:
      HeaderColor = "BG-Gray";
      break;
    case ROUTES.HOME:
      HeaderColor = "BG-Gray";
      break;
    default:
      HeaderColor = "BG-Green";
  }

  return (
    <div className={`Header ${HeaderColor}`}>
      <Link className="Title" to={isLoggedIn ? ROUTES.HOME : ROUTES.LANDING}>
        rummy house
      </Link>
      {!isLoggedIn && (
        <div className="Login">
          <LoginSignup />
          <LoginSignup isLogin={false} />
        </div>
      )}
      {isLoggedIn && (
        <div className="Logout">
          <Logout />
        </div>
      )}
    </div>
  );
};

export default compose(withRouter)(Header);
