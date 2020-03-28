import React, { useEffect, useContext, useState } from 'react';
import firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';
import * as URLS from '../../constants/urls';
import * as UTIL from '../../constants/util';

import PopUp from '../../components/PopUp';
import CopyTextButton from '../../components/CopyTextButton';
import GameButton from '../../components/GameButton';

const createGameHandler = IDToken => {
  const headers = new Headers();
  headers.append('id_token', IDToken);
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/createGame`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const makeGameButton = (game, key, setIsPopUpVisible, setGameLink, history) => {
  return (
    <GameButton
      gameData={game}
      gameKey={key}
      history={history}
      setGameLink={setGameLink}
      setIsPopUpVisible={setIsPopUpVisible}
    />
  );
};

const Home = React.memo(props => {
  console.log('in home');
  const { history } = props;
  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;

  let unsubscribeListenP1Games = () => {};
  let unsubscribeListenP2Games = () => {};

  const [p1Games, setP1Games] = useState({});
  const [p2Games, setP2Games] = useState({});
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [gameLink, setGameLink] = useState('');

  useEffect(() => {
    document.title = 'Home';
  });

  const loadGames = () => {
    console.log('loading');

    if (authData.uid) {
      console.log('Has usercredential');
      const queryP1ID = firebase
        .firestore()
        .collection('games')
        .where('player1ID', '==', authData.uid);
      const queryP1ID2 = queryP1ID.orderBy('timestamp', 'desc');
      const queryP2ID = firebase
        .firestore()
        .collection('games')
        .where('player2ID', '==', authData.uid);
      const queryP2ID2 = queryP2ID.orderBy('timestamp', 'desc');

      unsubscribeListenP1Games = queryP1ID2.onSnapshot(snapshot => {
        const addUpdateGames = {};
        const removeKeys = [];
        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') {
            removeKeys.push(change.doc.id);
          } else {
            const game = change.doc.data();
            if (game.game_state === 'forfeit') {
              removeKeys.push(change.doc.id);
              // TODO: Add to ended games list, also capture "done" games
            } else {
              addUpdateGames[change.doc.id] = {
                timestamp: game.timestamp,
                otherPlayer: game.player2Name,
                colorNumber: UTIL.stringToNum(change.doc.id) % 4,
              };
            }
          }
        });
        setP1Games(prevGames => {
          const updatedPrevGames = { ...prevGames };
          removeKeys.forEach(key => {
            if (updatedPrevGames[key]) {
              delete updatedPrevGames[key];
            }
          });
          return { ...updatedPrevGames, ...addUpdateGames };
        });
      });

      unsubscribeListenP2Games = queryP2ID2.onSnapshot(snapshot => {
        const addUpdateGames = {};
        const removeKeys = [];
        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') {
            removeKeys.push(change.doc.id);
          } else {
            const game = change.doc.data();
            if (game.game_state === 'forfeit') {
              removeKeys.push(change.doc.id);
              // TODO: Add to ended games list, also capture "done" games
            } else {
              addUpdateGames[change.doc.id] = {
                timestamp: game.timestamp,
                otherPlayer: game.player1Name,
                colorNumber: UTIL.stringToNum(change.doc.id) % 4,
              };
            }
          }
        });
        setP2Games(prevGames => {
          const updatedPrevGames = { ...prevGames };
          removeKeys.forEach(key => {
            if (updatedPrevGames[key]) {
              delete updatedPrevGames[key];
            }
          });
          return { ...updatedPrevGames, ...addUpdateGames };
        });
      });
    }
  };

  useEffect(() => {
    if (authData.uid) {
      loadGames();
    }
    return () => {
      console.log('leaving home screen');
      unsubscribeListenP1Games();
      unsubscribeListenP2Games();
    };
    // eslint-disable-next-line
  }, [authData.uid]);

  const generateGames = (p1Games_, p2Games_) => {
    const p1GameKeys = Object.keys(p1Games_);
    const localP1Games = p1GameKeys.map(key => {
      return makeGameButton(
        p1Games_[key],
        key,
        setIsPopUpVisible,
        setGameLink,
        history,
      );
    });
    const p2GameKeys = Object.keys(p2Games_);
    const localP2Games = p2GameKeys.map(key =>
      makeGameButton(
        p2Games_[key],
        key,
        setIsPopUpVisible,
        setGameLink,
        history,
      ),
    );
    return [...localP1Games, ...localP2Games];
  };
  return (
    <div className="Home">
      <PopUp
        message="Invite a friend"
        isVisible={isPopUpVisible}
        setVisible={setIsPopUpVisible}
        setGameLink={setGameLink}
      >
        <div className="Game-Link">{gameLink}</div>
        <CopyTextButton textToCopy={gameLink} id={gameLink}>
          Copy Link
        </CopyTextButton>
      </PopUp>
      <div className="Home-Body">
        <button
          className="Create-Game-Button"
          onClick={() => createGameHandler(authData.IDToken)}
          type="button"
        >
          <div className="plus">+</div>
          <div className="Create-Game-Text">create game</div>
        </button>
        {generateGames(p1Games, p2Games)}
      </div>
    </div>
  );
});

export default compose(withRouter)(Home);
