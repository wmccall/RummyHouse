import React, { useEffect, useContext, useState } from 'react';
import firebase from 'firebase';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';
import { FirebaseContext } from '../../context';

import Card from '../../components/Card';

import ROUTES from '../../constants/routes';
import * as UTIL from '../../constants/util';
import * as URLS from '../../constants/urls';

const generateCards = cardNames =>
  cardNames.map(cardName => {
    return <Card cardName={cardName} />;
  });

const generatePlayerCards = (cardNames, setClickedCards, clickedCards) => {
  const clickHandler = (e, cardName) => {
    e.stopPropagation();
    setClickedCards(prevClicked => {
      let newClicked = [];
      console.log(cardName);
      const cardIndex = prevClicked.indexOf(cardName);
      console.log(cardIndex);
      if (cardIndex === -1) {
        newClicked = [...prevClicked, cardName];
      } else {
        prevClicked.splice(cardIndex, 1);
        newClicked = [...prevClicked];
      }
      console.log(newClicked);
      return newClicked;
    });
  };
  return cardNames.map(cardName => {
    const isClicked = () => {
      return clickedCards.indexOf(cardName) !== -1;
    };
    return (
      <Card
        cardName={cardName}
        isClicked={isClicked()}
        onClick={e => clickHandler(e, cardName)}
      />
    );
  });
};

const generateDiscardCards = (
  cardNames,
  clickedDiscardIndex,
  setClickedDiscardIndex,
) => {
  const clickHandler = cardIndex => {
    console.log(cardIndex);
    console.log(clickedDiscardIndex);
    setClickedDiscardIndex(prevIndex => {
      if (cardIndex === prevIndex) {
        return undefined;
      }
      return cardIndex;
    });
  };
  return cardNames.map((cardName, index) => {
    const isClicked = locIndex => {
      return locIndex >= clickedDiscardIndex;
    };
    return (
      <Card
        cardName={cardName}
        isClicked={isClicked(index)}
        onClick={() => clickHandler(index)}
      />
    );
  });
};

const triggerRummy = (e, IDToken, gameKey, possibleRummyID) => {
  e.stopPropagation();
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  if (possibleRummyID) {
    headers.append('possible_rummy_id', possibleRummyID);
  }
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/rummy`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const generatePossibleRummies = (
  IDToken,
  gameKey,
  possibleRummies,
  discardPickup,
  yourTurn,
  canPickupDiscard,
) => {
  const clickHandler = (e, possibleRummyID) => {
    console.log(possibleRummyID);
    triggerRummy(e, IDToken, gameKey, possibleRummyID);
  };
  console.log(possibleRummies);
  const possibleRummyIDS = Object.keys(possibleRummies);
  let body;
  console.log(possibleRummyIDS);
  if (possibleRummyIDS.length > 0) {
    const rummyButtons = possibleRummyIDS.map(possibleRummyID => {
      const possibleRummy = possibleRummies[possibleRummyID];
      const on = (
        <>
          <div className="text">on</div>
          <div className="cards setCards">
            {generateCards(possibleRummy.setcards)}
          </div>
        </>
      );
      const keep = (
        <div className="cards keepCards">
          {generateCards(possibleRummy.discards_keep)}
        </div>
      );
      return (
        <button
          className="Possible-Rummy-Button"
          type="button"
          onClick={e => clickHandler(e, possibleRummyID)}
        >
          <div className="top">
            <div className="text">Play</div>
            <div className="cards playCards">
              {generateCards(possibleRummy.discards_play)}
            </div>
            {possibleRummy.setcards.length > 0 && on}
            <div className="text-keep">
              and keep {possibleRummy.discards_keep.length < 1 && 'none.'}
            </div>
            {possibleRummy.discards_keep.length > 0 && keep}
          </div>
        </button>
      );
    });
    const pickupCards = (
      <button
        className="Pickup-Cards"
        type="button"
        onClick={e => clickHandler(e, undefined)}
      >
        <div className="cards">{generateCards(discardPickup)}</div>
      </button>
    );

    const playNormal = (
      <>
        <div className="Message">
          Or you can choose to pick up the cards as normal.
        </div>
        {pickupCards}
      </>
    );

    const notRummy = (
      <>
        <div className="Message">
          Or you can{' '}
          <button
            className="Put-Back"
            type="button"
            onClick={e => clickHandler(e, undefined)}
          >
            put the cards back
          </button>
          .
        </div>
      </>
    );
    body = (
      <div className="Rummy-Popup">
        <div className="Header">Rummy!</div>
        <div className="Message">
          Choose one of the possible rummies below to play:
        </div>
        {rummyButtons}
        {yourTurn && canPickupDiscard && playNormal}
        {(!yourTurn || !canPickupDiscard) && notRummy}
      </div>
    );
  } else {
    body = (
      <div className="Rummy-Popup">
        <div className="Header">Rummy!</div>
        <div className="Message">Other player found a rummy!</div>
        <div className="Sub-Message">
          Hang tight while they decide what to do.
        </div>
      </div>
    );
  }

  return body;
};

const pickupDeck = (e, IDToken, gameKey) => {
  e.stopPropagation();
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/pickupDeck`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const pickupDiscard = (
  e,
  IDToken,
  gameKey,
  discardIndex,
  setClickedDiscardIndex,
) => {
  console.log(discardIndex);
  e.stopPropagation();
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  headers.append('discard_pickup_index', discardIndex);
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/pickupDiscard`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      setClickedDiscardIndex(undefined);
    })
    .catch(error => console.log('error', error));
};
const discardCardFromHand = (e, IDToken, gameKey, card, setClickedCards) => {
  e.stopPropagation();
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  headers.append('discard_card', card);
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/discard`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      setClickedCards([]);
    })
    .catch(error => console.log('error', error));
};

const playCards = (
  e,
  IDToken,
  gameKey,
  cards,
  setClickedCards,
  continuedSetID,
) => {
  e.stopPropagation();
  if (cards.length > 0) {
    const headers = new Headers();
    headers.append('id_token', IDToken);
    headers.append('game_id', gameKey);
    headers.append('cards', JSON.stringify(cards));
    if (continuedSetID) {
      headers.append('continued_set_id', continuedSetID);
    }
    const requestOptions = {
      method: 'POST',
      headers,
      redirect: 'follow',
    };

    fetch(`${URLS.BACKEND_SERVER}/playCards`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        setClickedCards([]);
      })
      .catch(error => console.log('error', error));
  }
};

const Game = props => {
  const firebaseContext = useContext(FirebaseContext);
  const { authData } = firebaseContext;

  let unsubscribeDocUpdater = () => {};
  let unsubscribeHandUpdater = () => {};
  let unsubscribeSetUpdater = () => {};
  let unsubscribeRummyUpdater = () => {};

  const [gameDoc, setGameDoc] = useState(undefined);
  const [yourHandDoc, setYourHandDoc] = useState(undefined);
  const [isPlayer1, setIsPlayer1] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [yourTurn, setYourTurn] = useState(undefined);
  const [discardCards, setDiscardCards] = useState([]);
  const [playedSets, setPlayedSets] = useState({});
  const [cardsInHand, setCardsInHand] = useState([]);
  const [numCardsInOtherHand, setNumCardsInOtherHand] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);
  const [clickedDiscardIndex, setClickedDiscardIndex] = useState(undefined);
  const [possibleRummies, setPossibleRummies] = useState({});
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Game';
  });

  const buildPlayedSets = () => {
    const setIDs = Object.keys(playedSets);
    if (
      gameDoc &&
      gameDoc.data().game_state !== 'setup' &&
      setIDs.length > 0 &&
      authData.uid
    ) {
      // TODO: don't show anything when subsets.length = 0; annoying edge case
      return setIDs.map(setID => {
        const { subsets } = playedSets[setID];
        const innerCards = subsets.map(subset => {
          return (
            <div className="subset">
              <div
                className={`subset-inner ${
                  subset.playerID === authData.uid ? 'yours' : 'theirs'
                }`}
              >
                {generateCards(subset.cards)}
              </div>
            </div>
          );
        });

        return (
          <div
            className="container"
            onClick={e =>
              playCards(
                e,
                authData.IDToken,
                gameID,
                clickedCards,
                setClickedCards,
                setID,
              )
            }
          >
            <div className="set">{innerCards}</div>
          </div>
        );
      });
    }
    return <div className="tip">play cards here</div>;
  };

  const loadGame = () => {
    console.log(gameID);
    if (authData.uid) {
      UTIL.getGameDoc(firebase.firestore(), gameID)
        .then(async localGameDoc => {
          if (localGameDoc.data().player1.id === authData.uid) {
            setGameDoc(localGameDoc);
            setIsPlayer1(true);
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
            setYourHandDoc(locYourHandDoc);
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
              setIsPlayer1(false);
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
              setYourHandDoc(locYourHandDoc);
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

  const getOpponentCards = () => {
    if (gameState && gameState !== 'setup') {
      const blankCards = [];
      for (let i = 0; i < numCardsInOtherHand; i += 1) {
        blankCards.push(undefined);
      }
      return <div className="Opponents-Cards">{generateCards(blankCards)}</div>;
    }
    return '';
  };
  const getRummyPopup = () => {
    if (gameState && gameState === 'rummy') {
      const discardPickup = gameDoc
        .data()
        .discard.slice(gameDoc.data().rummy_index);
      console.log(possibleRummies);
      const canPickup = gameDoc.data().discard_pickup_card !== null;
      return generatePossibleRummies(
        authData.IDToken,
        gameID,
        possibleRummies,
        discardPickup,
        yourTurn,
        canPickup,
      );
    }
    return '';
  };
  const getDiscardCards = () => {
    if (gameState && gameState !== 'setup') {
      return (
        <>
          <div className="Deck">
            <Card
              cardName={undefined}
              onClick={e => pickupDeck(e, authData.IDToken, gameID)}
            />
          </div>
          <div
            className="Discard"
            onClick={e => {
              discardCardFromHand(
                e,
                authData.IDToken,
                gameID,
                clickedCards[0],
                setClickedCards,
              );
            }}
          >
            {generateDiscardCards(
              discardCards,
              clickedDiscardIndex,
              setClickedDiscardIndex,
            )}
          </div>
        </>
      );
    }
    return '';
  };
  const getPlayerCards = () => {
    if (gameState && gameState !== 'setup') {
      return generatePlayerCards(cardsInHand, setClickedCards, clickedCards);
    }
    return '';
  };

  useEffect(() => {
    if (authData.uid) {
      loadGame();
      // loadIsPlayer1();
    }
    return () => {
      console.log('leaving game screen');
      setGameDoc(undefined);
      setYourHandDoc(undefined);
      setIsPlayer1(undefined);
      setYourTurn(undefined);
      setDiscardCards([]);
      setPlayedSets({});
      setCardsInHand([]);
      setNumCardsInOtherHand(0);
      setClickedCards([]);
      setClickedDiscardIndex(undefined);
      setPossibleRummies({});
      unsubscribeDocUpdater();
      unsubscribeHandUpdater();
      unsubscribeSetUpdater();
      unsubscribeRummyUpdater();
    };
    // eslint-disable-next-line
  }, [authData.uid]);

  return (
    <div className="Game">
      <div className="Opponents-Cards-Container">{getOpponentCards()}</div>
      {gameState === 'rummy' && (
        <div className="Rummy-Container">{getRummyPopup()}</div>
      )}
      <button
        className="Played-Cards-Background"
        onClick={e =>
          playCards(
            e,
            authData.IDToken,
            gameID,
            clickedCards,
            setClickedCards,
            undefined,
          )
        }
        type="button"
      />
      <div className="Played-Cards">{buildPlayedSets()}</div>
      <div className="Pickup-And-Discard">{getDiscardCards()}</div>
      <div className="Player-Cards">
        <div
          className="Player-Hand"
          onClick={e =>
            pickupDiscard(
              e,
              authData.IDToken,
              gameID,
              clickedDiscardIndex,
              setClickedDiscardIndex,
            )
          }
        >
          {getPlayerCards()}
        </div>
      </div>
    </div>
  );
};

export default compose(withRouter)(Game);
