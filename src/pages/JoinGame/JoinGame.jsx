import React, { useEffect, useContext } from "react";
import { withRouter, useParams } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";

const JoinGame = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { gameID } = useParams();
  useEffect(() => {
    document.title = "Join Game";
  });
  return <div>{gameID}</div>;
};

export default compose(withRouter)(JoinGame);
