import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import { FirebaseContext } from "../../context";

const Logout = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { signOut } = firebaseContext;

  const handleSignOut = () => {
    signOut().then(_ => {
      props.history.push(ROUTES.LANDING);
    });
  };

  return (
    <div className="Logout">
      <button onClick={() => handleSignOut()}>Log out</button>
    </div>
  );
};

export default compose(withRouter)(Logout);
