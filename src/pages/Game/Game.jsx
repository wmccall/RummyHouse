import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";

const Game = props => {
  const firebaseContext = useContext(FirebaseContext);
  useEffect(() => {
    document.title = "Game";
  });
  return <div>Game</div>;
};

export default compose(withRouter)(Game);
