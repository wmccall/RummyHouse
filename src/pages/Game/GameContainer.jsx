import React, { useEffect, useContext, useState } from 'react';
import firebase from 'firebase';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import Game from './Game';

import ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';

const onDragStart = () => {
  console.log('Drag starting');
};

const onDragEnd = () => {
  console.log('Drag End');
};

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
                const snapshotHand = snapshot.data();
                setCardsInHand(snapshotHand.cards);
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
                  const snapshotHand = snapshot.data();
                  setCardsInHand(snapshotHand.cards);
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
      setGameDoc(undefined);
      setYourTurn(undefined);
      setDiscardCards([]);
      setPlayedSets({});
      setCardsInHand([]);
      setNumCardsInOtherHand(0);
      setPossibleRummies({});
      unsubscribeDocUpdater();
      unsubscribeHandUpdater();
      unsubscribeSetUpdater();
      unsubscribeRummyUpdater();
    };
    // eslint-disable-next-line
  }, [authData.uid]);

  if (gameDoc) {
    return (
      <Game
        authData={authData}
        gameState={gameState}
        numCardsInOtherHand={numCardsInOtherHand}
        gameID={gameID}
        yourTurn={yourTurn}
        discardPickup={gameDoc.data().discard.slice(gameDoc.data().rummy_index)}
        canPickup={gameDoc.data().discard_pickup_card !== null}
        possibleRummies={possibleRummies}
        playedSets={playedSets}
        cardsInHand={cardsInHand}
        discardCards={discardCards}
      />
    );
  }
  return <></>;
};

export default compose(withRouter)(GameContainer);
