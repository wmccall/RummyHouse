import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";
import * as ROUTES from "../../constants/routes";

const Landing = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { isLoggedIn } = firebaseContext;
  if (isLoggedIn) {
    props.history.push(ROUTES.HOME);
  }
  useEffect(() => {
    document.title = "Rummy House";
  });
  return <div className="Landing"></div>;
};

export default compose(withRouter)(Landing);
