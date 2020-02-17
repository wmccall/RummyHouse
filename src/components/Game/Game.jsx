import React, { useEffect } from "react";

const Game = () => {
  useEffect(() => {
    document.title = "Game";
  });
  return <div>Game</div>;
};

export default Game;
