import React, { useState, useEffect, useRef, useContext } from "react";
import { FirebaseContext } from "../../context";
import { ReactSVG } from "react-svg";

import LoginSignup from "../../components/LoginSignup";
import LandingSVG from "../../resources/RummyLandingImage.svg";

const PLAYERS = [
  "college friend.",
  "roommate.",
  "sister.",
  "brother.",
  "mom.",
  "dad.",
  "grandma.",
  "grandpa.",
  "coworker.",
  "best friend.",
  "uncle.",
  "aunt.",
  "mail man.",
  "waiter.",
  "waitress.",
  "uber driver."
];

function getRandomPlayer() {
  return PLAYERS[Math.floor(Math.random() * Math.floor(PLAYERS.length))];
}

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Landing = props => {
  const firebaseContext = useContext(FirebaseContext);
  const [currentPlayer, setCurrentPlayer] = useState(getRandomPlayer());
  useInterval(() => {
    setCurrentPlayer(getRandomPlayer());
  }, 2000);
  useEffect(() => {
    document.title = "Rummy House";
  });
  return (
    <div className="Landing">
      <div className="Landing-Left">
        <div className="Text">
          Play a friendly game of Rummy with your {currentPlayer}
        </div>
        <LoginSignup isLogin={false} message="Sign up free" />
      </div>
      <div className="Landing-Right">
        <ReactSVG className="LandingSVG" src={LandingSVG} />
      </div>
    </div>
  );
};

export default Landing;
