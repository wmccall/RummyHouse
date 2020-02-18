import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";

const Account = props => {
  const firebaseContext = useContext(FirebaseContext);
  useEffect(() => {
    document.title = "Account";
  });
  return <div>Account</div>;
};

export default compose(withRouter)(Account);
