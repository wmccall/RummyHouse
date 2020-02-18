import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";

const Admin = props => {
  const firebaseContext = useContext(FirebaseContext);
  useEffect(() => {
    document.title = "Admin";
  });
  return <div>Admin</div>;
};

export default compose(withRouter)(Admin);
