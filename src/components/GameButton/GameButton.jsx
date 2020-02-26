import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import * as ROUTES from "../../constants/routes";
import * as UTIL from "../../constants/util";
import * as URLS from "../../constants/urls";

import DeleteButton from "../../components/DeleteButton";

import bluePattern from "../../resources/svg/bluePattern.svg";
import greenPattern from "../../resources/svg/greenPattern.svg";
import orangePattern from "../../resources/svg/orangePattern.svg";
import pinkPattern from "../../resources/svg/pinkPattern.svg";
import linkIcon from "../../resources/svg/link.svg";

const PATTERNS = [bluePattern, greenPattern, orangePattern, pinkPattern];

const GameButton = props => {
  var { history } = props;
  const { gameKey, gameData, setGameLink, setIsPopUpVisible } = props;
  const [hover, setHover] = useState(false);

  console.log(props);

  const versus = gameData.otherPlayer
    ? `vs ${gameData.otherPlayer}`
    : "invite player";

  return (
    <button
      className="Game-Button"
      onClick={() => {
        history.push(`${ROUTES.GAME}/${gameKey}`);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="Contents">
        <img
          className="pattern"
          src={PATTERNS[gameData.colorNumber]}
          alt="pattern"
        />
        <div className="Left">
          <div className="Versus">{versus}</div>
        </div>
        <div className="Left">
          <div className="Timing">
            {UTIL.getTimeAgo(gameData.timestamp.seconds)}
          </div>
        </div>
        <div className="Right">
          <button
            onClick={e => {
              setGameLink(
                `${URLS.FRONT_END_SERVER}${ROUTES.JOIN_GAME}/${gameKey}`,
                setIsPopUpVisible(true)
              );
              e.stopPropagation();
            }}
            className={`Link-Button ${hover ? "visible" : "hide"}`}
          >
            <img src={linkIcon} alt="link" />
          </button>
          <div className={`${hover ? "visible" : "hide"}`}>
            <DeleteButton onClick={() => console.log("delete")} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default compose(withRouter)(GameButton);