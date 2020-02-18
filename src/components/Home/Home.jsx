import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";

const Home = props => {
  const firebaseContext = useContext(FirebaseContext);
  useEffect(() => {
    document.title = "Home";
  });
  return <div className="Home"></div>;
};

export default compose(withRouter)(Home);
