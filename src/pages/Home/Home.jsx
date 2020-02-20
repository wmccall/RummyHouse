import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";
import * as URLS from "../../constants/urls";

const createGameHandler = () => {
  //TODO: do not hard code headers
  var headers = new Headers();
  headers.append("user_id", "abcd1234");

  var requestOptions = {
    method: "POST",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${URLS.BACKEND_SERVER}/createGame`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log("error", error));
};

const Home = props => {
  const firebaseContext = useContext(FirebaseContext);
  useEffect(() => {
    document.title = "Home";
  });
  return (
    <div className="Home">
      <div className="Home-Body">
        <button
          className="Create-Game-Button"
          onClick={() => createGameHandler()}
        >
          <div>+</div>
          <div>create game</div>
        </button>
      </div>
    </div>
  );
};

export default compose(withRouter)(Home);
