import React, { useEffect, useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";
import * as URLS from "../../constants/urls";

import peachPattern from "../../resources/peachpattern.png";

const createGameHandler = IDToken => {
  var headers = new Headers();
  headers.append("id_token", IDToken);
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

const Home = () => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken, firebase, userCredential } = firebaseContext;
  const [p1Games, setP1Games] = useState({});
  const [p2Games, setP2Games] = useState({});

  useEffect(() => {
    document.title = "Home";
  });

  useEffect(() => {
    if (userCredential) {
      loadGames();
    }
  }, [userCredential]);

  const loadGames = () => {
    console.log(userCredential);
    if (userCredential && userCredential.uid) {
      var queryP1ID = firebase
        .firestore()
        .collection("games")
        .where("player1ID", "==", userCredential.uid);
      var queryP1ID2 = queryP1ID.orderBy("timestamp", "desc");
      var queryP2ID = firebase
        .firestore()
        .collection("games")
        .where("player2ID", "==", userCredential.uid);
      var queryP2ID2 = queryP2ID.orderBy("timestamp", "desc");

      // Start listening to the query.
      queryP1ID2.onSnapshot(function(snapshot) {
        var tempGames = {};
        snapshot.docChanges().forEach(function(change) {
          var game = change.doc.data();
          tempGames[change.doc.id] = {
            timestamp: game.timestamp,
            otherPlayer: game.player2Name
          };
        });
        setP1Games(prevGames => {
          return { ...prevGames, ...tempGames };
        });
      });

      queryP2ID2.onSnapshot(function(snapshot) {
        var tempGames = {};
        snapshot.docChanges().forEach(function(change) {
          var game = change.doc.data();
          tempGames[change.doc.id] = {
            timestamp: game.timestamp,
            otherPlayer: game.player1Name
          };
        });
        setP2Games(prevGames => {
          return { ...prevGames, ...tempGames };
        });
      });
    }
  };

  const generateGames = (p1Games, p2Games) => {
    const p1GameKeys = Object.keys(p1Games);
    const localP1Games = p1GameKeys.map(key => {
      const gameData = p1Games[key];
      console.log("local p1 game");
      console.log(gameData);
      const versus = gameData.otherPlayer
        ? `vs ${gameData.otherPlayer}`
        : "waiting for player";
      return (
        <button className="Game-Button">
          <img src={peachPattern} alt="pattern" />
          <div className="Versus">{versus}</div>
          <button>delete</button>
        </button>
      );
    });
    const p2GameKeys = Object.keys(p2Games);
    const localP2Games = p2GameKeys.map(key => {
      const gameData = p2Games[key];
      console.log("local p2 game");
      console.log(gameData);
      const versus = gameData.otherPlayer
        ? `vs ${gameData.otherPlayer}`
        : "waiting for player";
      return (
        <button className="Game-Button">
          <img src={peachPattern} alt="pattern" />
          <div className="Versus">{versus}</div>
          <button>delete</button>
        </button>
      );
    });
    return [...localP1Games, ...localP2Games];
  };
  return (
    <div className="Home">
      <div className="Home-Body">
        <button
          className="Create-Game-Button"
          onClick={() => createGameHandler(IDToken)}
        >
          <div>+</div>
          <div>create game</div>
        </button>
        {generateGames(p1Games, p2Games)}
      </div>
    </div>
  );
};

export default compose(withRouter)(Home);
