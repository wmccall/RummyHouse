import React, { useEffect, useContext, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import Card from '../../components/Card';

import * as ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';
import * as URLS from '../../constants/urls';

const isUserIDPlayer1 = async (gameDoc, userID) => {
  const player1Ref = gameDoc.data().player1;
  const player1Doc = await player1Ref.get();
  return userID === player1Doc.data().user_id;
};

const generateCards = cardNames =>
  cardNames.map(cardName => {
    return <Card cardName={cardName} />;
  });

const Game = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { IDToken, firebase, userCredential } = firebaseContext;
  const [gameDoc, setGameDoc] = useState(undefined);
  const [yourHandDoc, setYourHandDoc] = useState(undefined);
  const [isPlayer1, setIsPlayer1] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [yourTurn, setYourTurn] = useState(undefined);
  const [discardCards, setDiscardCards] = useState([]);
  const [playedCards, setPlayedCards] = useState({});
  const [cardsInHand, setCardsInHand] = useState([]);
  const [numCardsInOtherHand, setNumCardsInOtherHand] = useState(0);
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Game';
  });

  // TODO: update to query so it gets data on update
  const loadGame = () => {
    if (userCredential && userCredential.uid) {
      UTIL.getGameDoc(firebase.firestore(), gameID)
        .then(async localGameDoc => {
          if (localGameDoc.data().player1.id === userCredential.uid) {
            setGameDoc(localGameDoc);
            setIsPlayer1(true);
            localGameDoc.ref.onSnapshot(async snapshot => {
              const snapshotGame = snapshot.data();
              setDiscardCards(snapshotGame.discard);
              setGameState(snapshotGame.game_state);
              setYourTurn(snapshotGame.turn.id === userCredential.uid);
              setNumCardsInOtherHand(snapshotGame.player2NumCards);
            });
            const locYourHandDoc = (
              await localGameDoc.ref
                .collection('hands')
                .where('playerID', '==', userCredential.uid)
                .get()
            ).docs[0];
            setYourHandDoc(locYourHandDoc);
            locYourHandDoc.ref.onSnapshot(async snapshot => {
              const snapshotHand = snapshot.data();
              setCardsInHand(snapshotHand.cards);
            });
          } else if (
            localGameDoc.data().player2 &&
            localGameDoc.data().player2.id === userCredential.uid
          ) {
            setGameDoc(localGameDoc);
            setIsPlayer1(false);
            localGameDoc.ref.onSnapshot(async snapshot => {
              const snapshotGame = snapshot.data();
              setDiscardCards(snapshotGame.discard);
              setGameState(snapshotGame.game_state);
              setYourTurn(snapshotGame.turn.id === userCredential.uid);
              setNumCardsInOtherHand(snapshotGame.player1NumCards);
            });
            const locYourHandDoc = (
              await localGameDoc.ref
                .collection('hands')
                .where('playerID', '==', userCredential.uid)
                .get()
            ).docs[0];
            setYourHandDoc(locYourHandDoc);
            locYourHandDoc.ref.onSnapshot(async snapshot => {
              const snapshotHand = snapshot.data();
              setCardsInHand(snapshotHand.cards);
            });
          } else {
            history.push(ROUTES.HOME);
          }
        })
        .catch(err => {
          console.log(err);
          history.push(ROUTES.HOME);
        });
    }
  };

  const getOpponentCards = () => {
    if (
      gameDoc &&
      isPlayer1 !== undefined &&
      gameDoc.data().game_state !== 'setup'
    ) {
      return numCardsInOtherHand;
    }
    return 'placeholder';
  };
  const getPlayedCards = () => {
    return 'placeholder';
  };
  const getDicardCards = () => {
    if (gameDoc && gameDoc.data().game_state !== 'setup') {
      return (
        <>
          <div className="Deck">{generateCards([undefined])}</div>
          <div className="Discard">{generateCards(discardCards)}</div>
        </>
      );
    }
    return 'placeholder';
  };
  const getPlayerCards = () => {
    if (gameDoc && gameDoc.data().game_state !== 'setup') {
      return generateCards(cardsInHand);
    }
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
