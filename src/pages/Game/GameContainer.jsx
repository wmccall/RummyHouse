import React, { useEffect, useContext, useState } from 'react';
import firebase from 'firebase';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import Game from './Game';

import ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';

const GameContainer = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;

  let unsubscribeDocUpdater = () => {};
  let unsubscribeHandUpdater = () => {};
  let unsubscribeSetUpdater = () => {};
  let unsubscribeRummyUpdater = () => {};

  const [gameDoc, setGameDoc] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [yourTurn, setYourTurn] = useState(undefined);
  const [discardCards, setDiscardCards] = useState([]);
  const [playedSets, setPlayedSets] = useState({});
  const [cardsInHand, setCardsInHand] = useState([]);
  const [numCardsInOtherHand, setNumCardsInOtherHand] = useState(0);
  const [possibleRummies, setPossibleRummies] = useState({});
  const [discardPickupCard, setDiscardPickupCard] = useState(undefined);
  const [discardPickup, setDiscardPickup] = useState(undefined);
  const [canPickup, setCanPickup] = useState(false);
  const [winner, setWinner] = useState(undefined);
  const [p1Points, setP1Points] = useState(undefined);
  const [p2Points, setP2Points] = useState(undefined);
  const [p1HandPoints, setP1HandPoints] = useState(undefined);
  const [p2HandPoints, setP2HandPoints] = useState(undefined);
  const [p1Name, setP1Name] = useState(undefined);
  const [p2Name, setP2Name] = useState(undefined);
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Game';
  });

  const loadGame = () => {
    console.log(gameID);
    if (authData.uid) {
      UTIL.getGameDoc(firebase.firestore(), gameID)
        .then(async localGameDoc => {
          if (localGameDoc.data().player1.id === authData.uid) {
            setGameDoc(localGameDoc);
            unsubscribeDocUpdater = localGameDoc.ref.onSnapshot(
              async snapshot => {
                const snapshotGame = snapshot.data();
                setDiscardCards(snapshotGame.discard);
                setGameState(snapshotGame.game_state);
                setYourTurn(snapshotGame.turn.id === authData.uid);
                setNumCardsInOtherHand(snapshotGame.player2NumCards);
                setDiscardPickupCard(snapshotGame.discard_pickup_card);
                console.log(snapshotGame.discard);
                if (snapshotGame.rummy_index !== null && snapshotGame.discard) {
                  setDiscardPickup(
                    snapshotGame.discard.slice(snapshotGame.rummy_index),
                  );
                }
                setCanPickup(snapshotGame.discard_pickup_card !== null);
                setWinner(snapshotGame.winner);
                setP1Points(snapshotGame.player1Points);
                setP2Points(snapshotGame.player2Points);
                setP1HandPoints(snapshotGame.player1HandPoints);
                setP2HandPoints(snapshotGame.player2HandPoints);
                setP1Name(snapshotGame.player1Name);
                setP2Name(snapshotGame.player2Name);
              },
            );
            const locYourHandDoc = (
              await localGameDoc.ref
                .collection('hands')
                .where('playerID', '==', authData.uid)
                .get()
            ).docs[0];
            unsubscribeHandUpdater = locYourHandDoc.ref.onSnapshot(
              async snapshot => {
                const updatedCards = snapshot.data().cards;
                setCardsInHand(prevCards => {
                  if (
                    prevCards.length !== updatedCards.length ||
                    prevCards.length === 0
                  ) {
                    return updatedCards;
                  }
                  let newCards = false;
                  for (let i = 0; i < prevCards.length; i += 1) {
                    if (prevCards.indexOf(updatedCards[i]) === -1) {
                      newCards = true;
                    }
                  }
                  console.log(newCards);
                  console.log(prevCards);
                  console.log(updatedCards);
                  if (newCards) {
                    return updatedCards;
                  }
                  return prevCards;
                });
              },
            );
            unsubscribeSetUpdater = localGameDoc.ref
              .collection('sets')
              .onSnapshot(async snapshot => {
                const allChangeData = {};
                await UTIL.asyncForEach(snapshot.docChanges(), async change => {
                  if (change.type !== 'removed') {
                    const { setType } = change.doc.data();
                    allChangeData[change.doc.id] = { setType };
                    const subsets = (
                      await change.doc.ref.collection('subsets').get()
                    ).docs.map(subsetDoc => {
                      const { cards, player } = subsetDoc.data();
                      return { cards, playerID: player.id };
                    });
                    allChangeData[change.doc.id].subsets = subsets;
                  }
                });
                setPlayedSets(prevSets => {
                  const updatedSets = { ...prevSets, ...allChangeData };
                  return updatedSets;
                });
              });
            unsubscribeRummyUpdater = localGameDoc.ref
              .collection('possible_rummies')
              .onSnapshot(async snapshot => {
                const allChangeData = {};
                snapshot.docChanges().forEach(change => {
                  if (
                    change.type !== 'removed' &&
                    change.doc.data().playerID === authData.uid
                  ) {
                    allChangeData[change.doc.id] = change.doc.data();
                  }
                });
                console.log('Rummies');
                console.log(allChangeData);
                setPossibleRummies(allChangeData);
              });
          } else if (localGameDoc.data().player2) {
            if (localGameDoc.data().player2.id === authData.uid) {
              setGameDoc(localGameDoc);
              unsubscribeDocUpdater = localGameDoc.ref.onSnapshot(
                async snapshot => {
                  const snapshotGame = snapshot.data();
                  setDiscardCards(snapshotGame.discard);
                  setGameState(snapshotGame.game_state);
                  setYourTurn(snapshotGame.turn.id === authData.uid);
                  setNumCardsInOtherHand(snapshotGame.player1NumCards);
                  setDiscardPickupCard(snapshotGame.discard_pickup_card);
                  if (
                    snapshotGame.rummy_index !== null &&
                    snapshotGame.discard
                  ) {
                    setDiscardPickup(
                      snapshotGame.discard.slice(snapshotGame.rummy_index),
                    );
                  }
                  setCanPickup(snapshotGame.discard_pickup_card !== null);
                  setWinner(snapshotGame.winner);
                  setP1Points(snapshotGame.player1Points);
                  setP2Points(snapshotGame.player2Points);
                  setP1HandPoints(snapshotGame.player1HandPoints);
                  setP2HandPoints(snapshotGame.player2HandPoints);
                  setP1Name(snapshotGame.player1Name);
                  setP2Name(snapshotGame.player2Name);
                },
              );
              const locYourHandDoc = (
                await localGameDoc.ref
                  .collection('hands')
                  .where('playerID', '==', authData.uid)
                  .get()
              ).docs[0];
              unsubscribeHandUpdater = locYourHandDoc.ref.onSnapshot(
                async snapshot => {
                  const updatedCards = snapshot.data().cards;
                  setCardsInHand(prevCards => {
                    if (
                      prevCards.length !== updatedCards.length ||
                      prevCards.length === 0
                    ) {
                      return updatedCards;
                    }
                    let newCards = false;
                    for (let i = 0; i < prevCards.length; i += 1) {
                      if (prevCards.indexOf(updatedCards[i]) === -1) {
                        newCards = true;
                      }
                    }
                    console.log(newCards);
                    console.log(prevCards);
                    console.log(updatedCards);
                    if (newCards) {
                      return updatedCards;
                    }
                    return prevCards;
                  });
                },
              );
              unsubscribeSetUpdater = localGameDoc.ref
                .collection('sets')
                .onSnapshot(async snapshot => {
                  const allChangeData = {};
                  await UTIL.asyncForEach(
                    snapshot.docChanges(),
                    async change => {
                      if (change.type !== 'removed') {
                        const { setType } = change.doc.data();
                        allChangeData[change.doc.id] = { setType };
                        const subsets = (
                          await change.doc.ref.collection('subsets').get()
                        ).docs.map(subsetDoc => {
                          const { cards, player } = subsetDoc.data();
                          return { cards, playerID: player.id };
                        });
                        allChangeData[change.doc.id].subsets = subsets;
                      }
                    },
                  );
                  setPlayedSets(prevSets => {
                    const updatedSets = { ...prevSets, ...allChangeData };
                    return updatedSets;
                  });
                });
              unsubscribeRummyUpdater = localGameDoc.ref
                .collection('possible_rummies')
                .onSnapshot(async snapshot => {
                  const allChangeData = {};
                  snapshot.docChanges().forEach(change => {
                    if (
                      change.type !== 'removed' &&
                      change.doc.data().playerID === authData.uid
                    ) {
                      allChangeData[change.doc.id] = change.doc.data();
                    }
                  });
                  console.log('Rummies');
                  console.log(allChangeData);
                  setPossibleRummies(allChangeData);
                });
            } else {
              history.push(ROUTES.HOME);
            }
          } else {
            history.push(`${ROUTES.JOIN_GAME}/${gameID}`);
          }
        })
        .catch(err => {
          console.log(err);
          history.push(ROUTES.HOME);
        });
    }
  };

  useEffect(() => {
    if (authData.uid) {
      loadGame();
      // loadIsPlayer1();
    }
    return () => {
      console.log('leaving game screen');
      unsubscribeDocUpdater();
      unsubscribeHandUpdater();
      unsubscribeSetUpdater();
      unsubscribeRummyUpdater();
      setGameDoc(undefined);
      setYourTurn(undefined);
      setDiscardCards([]);
      setPlayedSets({});
      setCardsInHand([]);
      setNumCardsInOtherHand(0);
      setPossibleRummies({});
      setDiscardPickupCard(undefined);
      setCanPickup(false);
      setWinner(undefined);
      setP1Points(undefined);
      setP2Points(undefined);
      setP1HandPoints(undefined);
      setP2HandPoints(undefined);
      setP1Name(undefined);
      setP2Name(undefined);
    };
    // eslint-disable-next-line
  }, [authData.uid]);

  if (gameDoc && gameState) {
    return (
      <Game
        authData={authData}
        gameState={gameState}
        numCardsInOtherHand={numCardsInOtherHand}
        gameID={gameID}
        yourTurn={yourTurn}
        discardPickup={discardPickup}
        discardPickupCard={discardPickupCard}
        canPickup={canPickup}
        possibleRummies={possibleRummies}
        playedSets={playedSets}
        cardsInHand={cardsInHand}
        setCardsInHand={setCardsInHand}
        discardCards={discardCards}
        setDiscardCards={setDiscardCards}
        winner={winner}
        isP1={gameDoc.data().player1.id === authData.uid}
        p1Points={p1Points}
        p2Points={p2Points}
        p1HandPoints={p1HandPoints}
        p2HandPoints={p2HandPoints}
        p1Name={p1Name}
        p2Name={p2Name}
      />
    );
  }
  return <></>;
};

export default compose(withRouter)(GameContainer);
