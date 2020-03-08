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

const generatePlayerCards = (cardNames, setClickedCards, clickedCards) => {
  const clickHandler = (e, cardName) => {
    e.stopPropagation();
    setClickedCards(prevClicked => {
      let newClicked = [];
      const cardIndex = prevClicked.indexOf(cardName);
      if (cardIndex === -1) {
        newClicked = [...prevClicked, cardName];
      } else {
        newClicked = [...prevClicked];
        delete newClicked[cardIndex];
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
  const { IDToken, firebase, userCredential } = firebaseContext;
  const [gameDoc, setGameDoc] = useState(undefined);
  const [yourHandDoc, setYourHandDoc] = useState(undefined);
  const [isPlayer1, setIsPlayer1] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [yourTurn, setYourTurn] = useState(undefined);
  const [discardCards, setDiscardCards] = useState([]);
  const [rawPlayedCards, setRawPlayedCards] = useState({});
  const [playedCards, setPlayedCards] = useState([]);
  const [cardsInHand, setCardsInHand] = useState([]);
  const [numCardsInOtherHand, setNumCardsInOtherHand] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);
  const [clickedDiscardIndex, setClickedDiscardIndex] = useState(undefined);
  const { gameID } = useParams();
  const { history } = props;
  useEffect(() => {
    document.title = 'Game';
  });

  const buildPlayedCards = (playedCardsSets, playerID) => {
    return playedCardsSets.map(playedCardsSet => {
      const { toContinueDown, toContinueUp, cards } = playedCardsSet;
      const innerCards = cards.map(subSet => {
        return (
          <div
            className={`subset ${
              subSet.player_id === playerID ? 'yours' : 'theirs'
            }`}
          >
            {generateCards(subSet.cards)}
          </div>
        );
      });

      return (
        <div className="set">
          <div
            className="place down"
            onClick={e =>
              playCards(
                e,
                IDToken,
                gameID,
                clickedCards,
                setClickedCards,
                toContinueDown,
              )
            }
          ></div>
          {innerCards}
          <div
            className="place up"
            onClick={e =>
              playCards(
                e,
                IDToken,
                gameID,
                clickedCards,
                setClickedCards,
                toContinueUp,
              )
            }
          ></div>
        </div>
      );
    });
  };

  const organizePlayedCards = played => {
    const arranged = [];
    const playedIDs = Object.keys(played);
    for (let keyInt = 0; keyInt < playedIDs.length; keyInt += 1) {
      const setData = played[playedIDs[keyInt]];
      let foundSet = false;
      if (setData.same_value_continued_set_id) {
        for (let i = 0; i < arranged.length; i += 1) {
          if (
            arranged[i].id === setData.same_value_continued_set_id &&
            playedIDs[keyInt] === arranged[i].same_value_continued_set_id
          ) {
            arranged[i].cards.push({
              player_id: setData.player_id,
              cards: setData.cards,
              toContinueUp: playedIDs[keyInt],
            });
            arranged[i].same_value_continued_set_id = null;
            foundSet = true;
            break;
          }
        }
      } else if (
        setData.straight_continued_set_below_id ||
        setData.straight_continued_set_above_id
      ) {
        if (
          setData.straight_continued_set_below_id &&
          setData.straight_continued_set_above_id
        ) {
          console.log('BOTH: looking for a set below');
          let foundBoth = false;
          for (let i = 0; i < arranged.length; i += 1) {
            if (
              arranged[i].id === setData.straight_continued_set_below_id &&
              playedIDs[keyInt] === arranged[i].straight_continued_set_above_id
            ) {
              arranged[i].cards.push({
                player_id: setData.player_id,
                cards: setData.cards,
              });
              arranged[i].straight_continued_set_above_id =
                setData.straight_continued_set_above_id;
              arranged[i].toContinueUp = playedIDs[keyInt];
              foundSet = true;
              console.log('THEN: looking for a set above');
              for (let j = 0; j < arranged.length; j += 1) {
                if (
                  arranged[j].id ===
                    arranged[i].straight_continued_set_above_id &&
                  arranged[i].id === arranged[j].straight_continued_set_below_id
                ) {
                  arranged[j].cards = [
                    ...arranged[i].cards,
                    ...arranged[j].cards,
                  ];
                  arranged[j].straight_continued_set_below_id =
                    arranged[i].straight_continued_set_below_id;
                  arranged[j].toContinueDown = arranged[i].toContinueDown;
                  foundSet = true;
                  foundBoth = true;
                  break;
                }
              }
              break;
            }
          }
          if (!foundBoth && !foundSet) {
            console.log('POST BOTH: looking for a set above');
            for (let i = 0; i < arranged.length; i += 1) {
              if (
                arranged[i].id === setData.straight_continued_set_above_id &&
                playedIDs[keyInt] ===
                  arranged[i].straight_continued_set_below_id
              ) {
                arranged[i].cards.push({
                  player_id: setData.player_id,
                  cards: setData.cards,
                });
                arranged[i].straight_continued_set_below_id = null;
                arranged[i].toContinueDown = playedIDs[keyInt];
                foundSet = true;
                break;
              }
            }
          }
        } else if (setData.straight_continued_set_below_id) {
          console.log('ONLY: looking for a set below');
          for (let i = 0; i < arranged.length; i += 1) {
            if (
              arranged[i].id === setData.straight_continued_set_below_id &&
              playedIDs[keyInt] === arranged[i].straight_continued_set_above_id
            ) {
              arranged[i].cards.push({
                player_id: setData.player_id,
                cards: setData.cards,
              });
              arranged[i].straight_continued_set_above_id = null;
              arranged[i].toContinueUp = playedIDs[keyInt];
              foundSet = true;
              break;
            }
          }
        } else {
          for (let i = 0; i < arranged.length; i += 1) {
            console.log('ONLY: looking for a set above');
            if (
              arranged[i].id === setData.straight_continued_set_above_id &&
              playedIDs[keyInt] === arranged[i].straight_continued_set_below_id
            ) {
              arranged[i].cards.push({
                player_id: setData.player_id,
                cards: setData.cards,
              });
              arranged[i].straight_continued_set_below_id = null;
              arranged[i].toContinueDown = playedIDs[keyInt];
              foundSet = true;
              break;
            }
          }
        }
      }

      if (!foundSet) {
        arranged.push({
          ...setData,
          cards: [{ player_id: setData.player_id, cards: setData.cards }],
          toContinueUp: playedIDs[keyInt],
          toContinueDown: playedIDs[keyInt],
          id: playedIDs[keyInt],
        });
      }
    }
    console.log(arranged);
    setPlayedCards(arranged);
  };

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
            localGameDoc.ref.collection('sets').onSnapshot(async snapshot => {
              let allChangeData = {};
              snapshot.docChanges().forEach(change => {
                if (change.type !== 'removed') {
                  allChangeData[change.doc.id] = change.doc.data();
                }
              });
              setRawPlayedCards(prevData => {
                const updatedData = { ...prevData, ...allChangeData };
                allChangeData = updatedData;
                return updatedData;
              });
              organizePlayedCards(allChangeData);
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
            localGameDoc.ref.collection('sets').onSnapshot(async snapshot => {
              let allChangeData = {};
              snapshot.docChanges().forEach(change => {
                if (change.type !== 'removed') {
                  allChangeData[change.doc.id] = change.doc.data();
                }
              });
              setRawPlayedCards(prevData => {
                const updatedData = { ...prevData, ...allChangeData };
                allChangeData = updatedData;
                return updatedData;
              });
              organizePlayedCards(allChangeData);
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
      gameDoc.data().game_state !== 'setup' &&
      userCredential &&
      userCredential.uid
    ) {
      return numCardsInOtherHand;
    }
    return 'placeholder';
  };
  const getPlayedCards = () => {
    if (
      gameDoc &&
      gameDoc.data().game_state !== 'setup' &&
      playedCards.length !== 0 &&
      userCredential &&
      userCredential.uid
    ) {
      console.log(playedCards);
      return buildPlayedCards(playedCards, userCredential.uid);
    }
    return 'placeholder';
  };
  const getDicardCards = () => {
    if (gameDoc && gameDoc.data().game_state !== 'setup') {
      return (
        <>
          <div className="Deck">
            <Card
              cardName={undefined}
              onClick={e => pickupDeck(e, IDToken, gameID)}
            />
          </div>
          <div className="Discard">
            {generateDiscardCards(
              discardCards,
              clickedDiscardIndex,
              setClickedDiscardIndex,
            )}
            <div
              className="place"
              onClick={e => {
                discardCardFromHand(
                  e,
                  IDToken,
                  gameID,
                  clickedCards[0],
                  setClickedCards,
                );
              }}
            ></div>
          </div>
        </>
      );
    }
    return 'placeholder';
  };
  const getPlayerCards = () => {
    if (
      gameDoc &&
      gameDoc.data().game_state !== 'setup' &&
      userCredential &&
      userCredential.uid
    ) {
      return generatePlayerCards(cardsInHand, setClickedCards, clickedCards);
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
      <div
        className="Played-Cards"
        onClick={e =>
          playCards(
            e,
            IDToken,
            gameID,
            clickedCards,
            setClickedCards,
            undefined,
          )
        }
      >
        {getPlayedCards()}
      </div>
      <div className="Pickup-And-Discard">{getDicardCards()}</div>
      <div
        className="Player-Cards"
        onClick={e =>
          pickupDiscard(
            e,
            IDToken,
            gameID,
            clickedDiscardIndex,
            setClickedDiscardIndex,
          )
        }
      >
        {getPlayerCards()}
      </div>
    </div>
  );
};

export default compose(withRouter)(Game);
