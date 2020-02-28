import React, { useEffect, useContext, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import * as ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';
import * as URLS from '../../constants/urls';

const joinGameHandler = (gameKey, IDToken, history) => {
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/joinGame`, requestOptions)
    .then(response => response.text())
    .then(result => {
      if (result === 'success') {
        history.push(`${ROUTES.GAME}/${gameKey}`);
      } else {
        console.log(result);
        history.push(ROUTES.HOME);
      }
    })
    .catch(error => {
      console.log('error', error);
      history.push(ROUTES.HOME);
    });
};

// TODO: handle when someone already joined or you're trying to join your game
const getInviteBox = (otherPlayer, gameID, IDToken, history) => {
  if (otherPlayer) {
    return (
      <div className="Invite-Box">
        <div className="Message">{otherPlayer} invited you to join a game</div>
        <button
          className="Join-Game-Button"
          type="button"
          onClick={() => {
            joinGameHandler(gameID, IDToken, history);
          }}
        >
          Join Game
        </button>
        <button
          className="Decline-Game-Button"
          type="button"
          onClick={() => {
            history.push(ROUTES.HOME);
          }}
        >
          Decline Game
        </button>
      </div>
    );
  }
  return <div> </div>;
};

const JoinGame = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken, firebase, userCredential } = firebaseContext;
  const [otherPlayer, setOtherPlayer] = useState(undefined);
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Join Game';
  });

  const loadGame = () => {
    if (userCredential && userCredential.uid) {
      UTIL.getGameDoc(firebase.firestore(), gameID).then(gameDoc => {
        console.log(gameDoc.data());
        setOtherPlayer(gameDoc.data().player1Name);
      });
    }
  };

  useEffect(() => {
    if (userCredential) {
      loadGame();
    }
    // eslint-disable-next-line
  }, [userCredential]);

  return (
    <div className="JoinGame">
      {getInviteBox(otherPlayer, gameID, IDToken, history)}
    </div>
  );
};

export default compose(withRouter)(JoinGame);
