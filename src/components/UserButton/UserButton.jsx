import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

const isLocationGame = location => {
  if (location && location.pathname) {
    const locationDetails = location.pathname.slice(1).split('/');
    if (locationDetails[0] === 'game') {
      return true;
    }
  }
  return false;
};

const getGameCode = location => {
  if (isLocationGame(location)) {
    return location.pathname.slice(1).split('/')[1];
  }
  return null;
};

const UserButton = props => {
  const { location } = props;
  const [inGameView, setInGameView] = useState(isLocationGame(location));
  const [gameCode, setGameCode] = useState(getGameCode(location));
  const [userChar, setUserChar] = useState('');
  const [open, setOpen] = useState(false);
  const firebaseContext = useContext(FirebaseContext);
  const { userCredential, signOut } = firebaseContext;

  useEffect(() => {
    if (userCredential && userCredential.displayName) {
      setUserChar(userCredential.displayName[0]);
    }
  }, [userCredential]);

  useEffect(() => {
    setInGameView(isLocationGame(location));
    setGameCode(getGameCode(location));
  }, [location.pathname]);

  const clickHandler = () => {
    setOpen(prevState => !prevState);
  };
  const clickChangeColorHandler = () => {
    console.log('Change color');
  };
  const clickForfeitHandler = () => {
    console.log(gameCode);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <button
        onClick={() => clickHandler()}
        type="button"
        className="UserButton"
      >
        {userChar}
      </button>
      <div className={`UserButton-Pane ${open ? 'visble' : 'hidden'}`}>
        <button
          onClick={() => clickChangeColorHandler()}
          type="button"
          className={`Change-Color-Button ${inGameView ? 'visible' : 'hidden'}`}
        >
          <div>Change Background Color</div>
        </button>
        {inGameView && <br />}
        <button
          onClick={() => clickForfeitHandler()}
          type="button"
          className={`Forfeit-Button ${inGameView ? 'visible' : 'hidden'}`}
        >
          <div>Forefeit Game</div>
        </button>
        {inGameView && <br />}
        <button
          onClick={() => handleSignOut()}
          type="button"
          className="Logout-Button"
        >
          <div>Log out</div>
        </button>
      </div>
    </>
  );
};

export default compose(withRouter)(UserButton);
