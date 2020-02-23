import React, { useEffect, useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../../context";
import * as URLS from "../../constants/urls";
import * as ROUTES from "../../constants/routes";

import peachPattern from "../../resources/peachpattern.png";
import PopUp from "../../components/PopUp";
import CopyTextButton from "../../components/CopyTextButton";

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

function getTimeAgo(secs) {
  var nowSeconds = Date.now() / 1000;
  console.log(secs);
  console.log(nowSeconds);
  var secondsDifference = nowSeconds - secs;
  console.log(secondsDifference);
  const minutes = Math.floor(secondsDifference / 60);
  const hours = Math.floor(secondsDifference / 60 / 60);
  const days = Math.floor(secondsDifference / 60 / 60 / 24);
  const weeks = Math.floor(secondsDifference / 60 / 60 / 24 / 7);
  const months = Math.floor(secondsDifference / 60 / 60 / 24 / 30);
  const years = Math.floor(secondsDifference / 60 / 60 / 24 / 365);
  if (minutes === 0) {
    return "<1 minute ago";
  }
  if (hours === 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (days === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (weeks === 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (months === 0) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  if (years === 0) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

const makeGameButton = (games, key, setIsPopUpVisible, setGameLink) => {
  const gameData = games[key];
  console.log("make game button");
  console.log(gameData);
  const versus = gameData.otherPlayer ? (
    `vs ${gameData.otherPlayer}`
  ) : (
    <button
      onClick={() => {
        setGameLink(
          `${URLS.FRONT_END_SERVER}${ROUTES.JOIN_GAME}?gameID=${key}`,
          setIsPopUpVisible(true)
        );
      }}
    >
      invite player
    </button>
  );
  return (
    <button className="Game-Button">
      <div className="Contents">
        <img src={peachPattern} alt="pattern" />
        <div className="Left">
          <div className="Versus">{versus}</div>
        </div>
        <div className="Left">
          <div className="Timing">{getTimeAgo(gameData.timestamp.seconds)}</div>
        </div>
        <div className="Right">
          <button>delete</button>
        </div>
      </div>
    </button>
  );
};

const Home = () => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken, firebase, userCredential } = firebaseContext;
  const [p1Games, setP1Games] = useState({});
  const [p2Games, setP2Games] = useState({});
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [gameLink, setGameLink] = useState("");

  useEffect(() => {
    document.title = "Home";
  });

  useEffect(() => {
    if (userCredential) {
      loadGames();
    }
    // eslint-disable-next-line
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
    const localP1Games = p1GameKeys.map(key =>
      makeGameButton(p1Games, key, setIsPopUpVisible, setGameLink)
    );
    const p2GameKeys = Object.keys(p2Games);
    const localP2Games = p2GameKeys.map(key =>
      makeGameButton(p2Games, key, setIsPopUpVisible, setGameLink)
    );
    return [...localP1Games, ...localP2Games];
  };
  return (
    <div className="Home">
      <PopUp
        message="Invite a friend!"
        isVisible={isPopUpVisible}
        setVisible={setIsPopUpVisible}
      >
        <div className="Game-Link">{gameLink}</div>
        <CopyTextButton textToCopy={gameLink} id={gameLink}>
          Copy Link
        </CopyTextButton>
      </PopUp>
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
