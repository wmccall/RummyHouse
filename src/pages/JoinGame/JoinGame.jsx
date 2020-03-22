import React, { useEffect, useContext, useState } from 'react';
import firebase from 'firebase';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import ROUTES from '../../constants/routes';
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
      if (result === 'Success') {
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

const getInviteBox = (
  otherPlayer,
  cantJoinMessage,
  gameID,
  IDToken,
  history,
) => {
  if (otherPlayer && !cantJoinMessage) {
    return (
      <div className="Invite-Box">
        <div className="Message">{otherPlayer} invited you to join a game!</div>
        <button
          className="Join-Game-Button"
          type="button"
          onClick={() => {
            joinGameHandler(gameID, IDToken, history);
          }}
        >
          Join
        </button>
        <button
          className="Decline-Game-Button"
          type="button"
          onClick={() => {
            history.push(ROUTES.HOME);
          }}
        >
          Decline
        </button>
      </div>
    );
  }
  if (cantJoinMessage) {
    return (
      <div className="Invite-Box">
        <div className="Message">
          Unable to join game because {cantJoinMessage}
        </div>
        <button
          className="Decline-Game-Button"
          type="button"
          onClick={() => {
            history.push(ROUTES.HOME);
          }}
        >
          Go Home
        </button>
      </div>
    );
  }
  return <div></div>;
};

const JoinGame = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken, uid } = firebaseContext;
  const [otherPlayer, setOtherPlayer] = useState(undefined);
  const [cantJoinMessage, setCantJoinMessage] = useState(undefined);
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Join Game';
  });

  const loadGame = () => {
    if (uid) {
      UTIL.getGameDoc(firebase.firestore(), gameID)
        .then(gameDoc => {
          setOtherPlayer(gameDoc.data().player1Name);
          if (gameDoc.data().player1.id === uid) {
            history.push(`${ROUTES.GAME}/${gameID}`);
          } else if (gameDoc.data().player2) {
            if (gameDoc.data().player2.id === uid) {
              history.push(`${ROUTES.GAME}/${gameID}`);
            } else {
              setCantJoinMessage('the game is already full.');
            }
          }
        })
        .catch(() => {
          setCantJoinMessage('the game doesnt exist.');
        });
    }
  };

  useEffect(() => {
    if (uid) {
      loadGame();
    }
    // eslint-disable-next-line
  }, [uid]);

  return (
    <div className="JoinGame">
      {getInviteBox(otherPlayer, cantJoinMessage, gameID, IDToken, history)}
    </div>
  );
};

export default compose(withRouter)(JoinGame);
