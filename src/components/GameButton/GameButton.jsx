import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import * as UTIL from "../../constants/util";
import * as URLS from "../../constants/urls";

import DeleteButton from "../../components/DeleteButton";

import bluePattern from "../../resources/bluePattern.svg";
import greenPattern from "../../resources/greenPattern.svg";
import orangePattern from "../../resources/orangePattern.svg";
import pinkPattern from "../../resources/pinkPattern.svg";

const PATTERNS = [bluePattern, greenPattern, orangePattern, pinkPattern];

const GameButton = props => {
  var { history } = props;
  const { key, gameData, setGameLink, setIsPopUpVisible } = props;

  const versus = gameData.otherPlayer ? (
    `vs ${gameData.otherPlayer}`
  ) : (
    <button
      onClick={e => {
        setGameLink(
          `${URLS.FRONT_END_SERVER}${ROUTES.JOIN_GAME}/${key}`,
          setIsPopUpVisible(true)
        );
        e.stopPropagation();
      }}
    >
      invite player
    </button>
  );

  return (
    <button
      className="Game-Button"
      onClick={() => {
        history.push(`${ROUTES.GAME}/${key}`);
      }}
    >
      <div className="Contents">
        <img src={PATTERNS[gameData.colorNumber]} alt="pattern" />
        <div className="Left">
          <div className="Versus">{versus}</div>
        </div>
        <div className="Left">
          <div className="Timing">
            {UTIL.getTimeAgo(gameData.timestamp.seconds)}
          </div>
        </div>
        <div className="Right">
          <DeleteButton onClick={() => console.log("delete")} />
        </div>
      </div>
    </button>
  );
};

export default compose(withRouter)(GameButton);
