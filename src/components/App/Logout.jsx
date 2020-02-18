import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

const Logout = props => {
  const { firebase } = props;

  const handleSignOut = () => {
    firebase.signOut().then(_ => {
      props.history.push(ROUTES.LANDING);
    });
  };

  return (
    <div className="Logout">
      <button onClick={() => handleSignOut()}>Log out</button>
    </div>
  );
};

export default compose(withRouter, withFirebase)(Logout);
