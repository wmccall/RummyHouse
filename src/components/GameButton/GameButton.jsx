import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';
import * as URLS from '../../constants/urls';

import DeleteButton from '../DeleteButton';

import bluePattern from '../../resources/svg/bluePattern.svg';
import greenPattern from '../../resources/svg/greenPattern.svg';
import orangePattern from '../../resources/svg/orangePattern.svg';
import pinkPattern from '../../resources/svg/pinkPattern.svg';
import linkIcon from '../../resources/svg/link.svg';

const PATTERNS = [bluePattern, greenPattern, orangePattern, pinkPattern];

const deleteGameHandler = (gameKey, IDToken) => {
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/deleteGame`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const GameButton = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken } = firebaseContext;
  const { history } = props;
  const { gameKey, gameData, setGameLink, setIsPopUpVisible } = props;
  const [hover, setHover] = useState(false);
  const [timeAgo, setTimeAgo] = useState(
    UTIL.getTimeAgo(gameData.timestamp.seconds),
  );

  useEffect(() => {
    setTimeAgo(UTIL.getTimeAgo(gameData.timestamp.seconds));
  }, [gameKey]);

  UTIL.useInterval(() => {
    setTimeAgo(UTIL.getTimeAgo(gameData.timestamp.seconds));
  }, 30000);

  const versus = gameData.otherPlayer
    ? `${gameData.otherPlayer}`
    : 'invite player';

  return (
    <button
      className="Game-Button"
      onClick={() => {
        history.push(`${ROUTES.GAME}/${gameKey}`);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      type="button"
      id={gameKey}
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
          <div className="Timing">{timeAgo}</div>
        </div>
        <div className="Right">
          <button
            onClick={e => {
              setGameLink(
                `${URLS.FRONT_END_SERVER}${ROUTES.JOIN_GAME}/${gameKey}`,
                setIsPopUpVisible(true),
              );
              e.stopPropagation();
            }}
            className={`Link-Button ${hover ? 'visible' : 'hide'}`}
            type="button"
          >
            <img src={linkIcon} alt="link" />
          </button>
          <div className={`${hover ? 'visible' : 'hide'}`}>
            <DeleteButton onClick={() => deleteGameHandler(gameKey, IDToken)} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default compose(withRouter)(GameButton);
