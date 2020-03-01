import React, { useEffect, useContext, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import * as ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';
import * as URLS from '../../constants/urls';

const isUserIDPlayer1 = async (gameDoc, userID) => {
  const player1Ref = gameDoc.data().player1;
  const player1Doc = await player1Ref.get();
  return userID === player1Doc.data().user_id;
};

const Game = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken, firebase, userCredential } = firebaseContext;
  const [gameDoc, setGameDoc] = useState(undefined);
  const [isPlayer1, setIsPlayer1] = useState(undefined);
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Game';
  });

  // TODO: update to query so it gets data on update
  const loadGame = () => {
    if (userCredential && userCredential.uid) {
      UTIL.getGameDoc(firebase.firestore(), gameID)
        .then(localGameDoc => {
          if (localGameDoc.data().player1.id === userCredential.uid) {
            setGameDoc(localGameDoc);
            isUserIDPlayer1(localGameDoc, userCredential.uid).then(response => {
              setIsPlayer1(response);
            });
          } else if (localGameDoc.data().player2) {
            if (localGameDoc.data().player2.id === userCredential.uid) {
              setGameDoc(localGameDoc);
              isUserIDPlayer1(localGameDoc, userCredential.uid).then(
                response => {
                  setIsPlayer1(response);
                },
              );
            } else {
              history.push(ROUTES.HOME);
            }
          } else {
            history.push(ROUTES.HOME);
          }
        })
        .catch(() => {
          history.push(ROUTES.HOME);
        });
    }
  };

  const getOpponentCards = () => {
    if (gameDoc && isPlayer1 !== undefined) {
      if (isPlayer1) {
        return gameDoc.data().player1NumCards;
      } else {
        return gameDoc.data().player2NumCards;
      }
    }
    return 'placeholder';
  };
  const getPlayedCards = () => {
    return 'placeholder';
  };
  const getDicardCards = () => {
    return 'placeholder';
  };
  const getPlayerCards = () => {
    return 'placeholder';
  };

  useEffect(() => {
    if (userCredential) {
      loadGame();
      // loadIsPlayer1();
    }
    // eslint-disable-next-line
  }, [userCredential]);

  return (
    <div className="Game">
      <div className="Opponents-Cards">{getOpponentCards()}</div>
      <div className="Played-Cards">{getPlayedCards()}</div>
      <div className="Pickup-And-Discard">{getDicardCards()}</div>
      <div className="Player-Cards">{getPlayerCards()}</div>
    </div>
  );
};

export default compose(withRouter)(Game);
