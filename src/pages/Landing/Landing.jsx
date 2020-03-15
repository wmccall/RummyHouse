import React, { useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';

import * as UTIL from '../../constants/util';

import LoginSignup from '../../components/LoginSignup';
import LandingSVG from '../../resources/svg/RummyLandingImage.svg';

const PLAYERS = [
  'college friend.',
  'roommate.',
  'sister.',
  'brother.',
  'mom.',
  'dad.',
  'grandma.',
  'grandpa.',
  'coworker.',
  'best friend.',
  'uncle.',
  'aunt.',
  'mail man.',
  'waiter.',
  'waitress.',
  'uber driver.',
];

function getRandomPlayer() {
  return PLAYERS[Math.floor(Math.random() * Math.floor(PLAYERS.length))];
}

const Landing = () => {
  const [currentPlayer, setCurrentPlayer] = useState(getRandomPlayer());
  UTIL.useInterval(() => {
    setCurrentPlayer(getRandomPlayer());
  }, 2000);
  useEffect(() => {
    document.title = 'Rummy House';
  });
  return (
    <div className="Landing">
      <div className="Landing-Left">
        <div className="Text">
          Play a friendly game of Rummy with your <br /> {currentPlayer}
        </div>
        <LoginSignup isLogin={false} message="Sign up free" />
      </div>
      <div className="Landing-Right">
        <ReactSVG className="LandingSVG" src={LandingSVG} />{' '}
      </div>
    </div>
  );
};

export default Landing;
