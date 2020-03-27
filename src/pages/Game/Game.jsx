/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';

import Card from '../../components/Card';

import * as URLS from '../../constants/urls';

// Network calls
const playCards = (
  e,
  IDToken,
  gameKey,
  cards,
  setClickedCards,
  continuedSetID,
) => {
  if (e) e.stopPropagation();
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

const reorderHand = (IDToken, gameKey, cards) => {
  const headers = new Headers();
  headers.append('id_token', IDToken);
  headers.append('game_id', gameKey);
  headers.append('cards', JSON.stringify(cards));
  const requestOptions = {
    method: 'POST',
    headers,
    redirect: 'follow',
  };

  fetch(`${URLS.BACKEND_SERVER}/reorderHand`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
    })
    .catch(error => console.log('error', error));
};

const triggerRummy = (e, IDToken, gameKey, possibleRummyID) => {
  if (e) e.stopPropagation();
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

const pickupDeck = (e, IDToken, gameKey) => {
  if (e) e.stopPropagation();
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
  if (e) e.stopPropagation();
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
  if (e) e.stopPropagation();
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

// Generators
const generateCards = cardNames =>
  cardNames.map(cardName => {
    return <Card cardName={cardName} />;
  });

const getOpponentCards = (gameState, numCardsInOtherHand) => {
  if (gameState && gameState !== 'setup') {
    const blankCards = [];
    for (let i = 0; i < numCardsInOtherHand; i += 1) {
      blankCards.push(undefined);
    }
    return <div className="Opponents-Cards">{generateCards(blankCards)}</div>;
  }
  return '';
};

const generatePlayerCards = (
  cardNames,
  setClickedCards,
  clickedCards,
  dragCard,
) => {
  const clickHandler = (e, cardName) => {
    e.stopPropagation();
    setClickedCards(prevClicked => {
      let newClicked = [];
      const cardIndex = prevClicked.indexOf(cardName);
      if (cardIndex === -1) {
        newClicked = [...prevClicked, cardName];
      } else {
        prevClicked.splice(cardIndex, 1);
        newClicked = [...prevClicked];
      }
      return newClicked;
    });
  };
  return cardNames.map((cardName, index) => {
    const isClicked = () => {
      return clickedCards.indexOf(cardName) !== -1;
    };
    return (
      <Card
        cardName={cardName}
        isClicked={isClicked()}
        onClick={e => clickHandler(e, cardName)}
        index={index}
        isDraggable
        dragCard={dragCard}
      />
    );
  });
};

const getPlayerCards = (
  gameState,
  cardsInHand,
  setClickedCards,
  clickedCards,
  dragCard,
) => {
  if (gameState !== 'setup') {
    return generatePlayerCards(
      cardsInHand,
      setClickedCards,
      clickedCards,
      dragCard,
    );
  }
  return '';
};

const buildPlayedSets = (
  playedSets,
  gameState,
  uid,
  IDToken,
  gameID,
  clickedCards,
  setClickedCards,
  setSetHover,
) => {
  const setIDs = Object.keys(playedSets);
  if (gameState !== 'setup' && setIDs.length > 0 && uid) {
    // TODO: don't show anything when subsets.length = 0; annoying edge case
    return setIDs.map(setID => {
      const { subsets } = playedSets[setID];
      const innerCards = subsets.map(subset => {
        return (
          <div className="subset">
            <div
              className={`subset-inner ${
                subset.playerID === uid ? 'yours' : 'theirs'
              }`}
            >
              {generateCards(subset.cards)}
            </div>
          </div>
        );
      });

      return (
        <Droppable droppableId={`SET$#$${setID}`} direction="horizontal">
          {provided => (
            <div
              onMouseEnter={() => setSetHover(true)}
              onMouseLeave={() => setSetHover(false)}
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="container"
              onClick={e =>
                playCards(
                  e,
                  IDToken,
                  gameID,
                  clickedCards,
                  setClickedCards,
                  setID,
                )
              }
            >
              <div className="set">{innerCards}</div>
            </div>
          )}
        </Droppable>
      );
    });
  }
  return <div className="tip">play cards here</div>;
};

const generateDiscardCards = (
  cardNames,
  clickedDiscardIndex,
  setClickedDiscardIndex,
  dragCard,
  dragDiscardIndex,
  dragHandCard,
  isDeckDrag,
) => {
  const clickHandler = cardIndex => {
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
    // COME
    return (
      <Card
        cardName={cardName}
        isClicked={isClicked(index)}
        isSelected={
          isClicked(index) ||
          (clickedDiscardIndex === undefined && index >= dragDiscardIndex)
        }
        onClick={() => clickHandler(index)}
        index={index}
        isDraggable={
          !(dragHandCard || isDeckDrag) &&
          (isClicked(index) || clickedDiscardIndex === undefined)
        }
        dragCard={dragCard}
        disableDrag={
          clickedDiscardIndex !== index && clickedDiscardIndex !== undefined
        }
      />
    );
  });
};

const getDiscardCards = (
  gameState,
  IDToken,
  gameID,
  clickedCards,
  setClickedCards,
  discardCards,
  clickedDiscardIndex,
  setClickedDiscardIndex,
  dragCard,
  dragDiscardIndex,
  dragHandCard,
  isDeckDrag,
) => {
  if (gameState !== 'setup') {
    return (
      <>
        <div className="under-deck">
          <Card
            cardName={undefined}
            onClick={e => pickupDeck(e, IDToken, gameID)}
          />
        </div>
        <Droppable droppableId="deck" direction="horizontal" isDropDisabled>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="Deck"
            >
              <Card
                cardName={undefined}
                onClick={e => pickupDeck(e, IDToken, gameID)}
                isDraggable={gameState === 'draw'}
              />
              <div style={{ visibility: 'hidden' }}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        <Droppable droppableId="discard" direction="horizontal">
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="Discard"
              onClick={e => {
                discardCardFromHand(
                  e,
                  IDToken,
                  gameID,
                  clickedCards[0],
                  setClickedCards,
                );
              }}
              cards={discardCards}
            >
              {generateDiscardCards(
                discardCards,
                clickedDiscardIndex,
                setClickedDiscardIndex,
                dragCard,
                dragDiscardIndex,
                dragHandCard,
                isDeckDrag,
              )}
            </div>
          )}
        </Droppable>
      </>
    );
  }
  return '';
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
    triggerRummy(e, IDToken, gameKey, possibleRummyID);
  };
  const possibleRummyIDS = Object.keys(possibleRummies);
  let body;
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

const getRummyPopup = (
  gameState,
  IDToken,
  gameID,
  yourTurn,
  discardPickup,
  canPickup,
  possibleRummies,
) => {
  if (gameState && gameState === 'rummy') {
    return generatePossibleRummies(
      IDToken,
      gameID,
      possibleRummies,
      discardPickup,
      yourTurn,
      canPickup,
    );
  }
  return '';
};

const Game = props => {
  const {
    authData,
    gameState,
    numCardsInOtherHand,
    gameID,
    yourTurn,
    discardPickup,
    canPickup,
    possibleRummies,
    playedSets,
    cardsInHand,
    setCardsInHand,
    discardCards,
  } = props;

  const [clickedCards, setClickedCards] = useState([]);
  const [clickedDiscardIndex, setClickedDiscardIndex] = useState(undefined);
  const [dragHandCard, setDragHandCard] = useState(undefined);
  const [dragDiscardCard, setDragDiscardCard] = useState(undefined);
  const [dragDiscardIndex, setDragDiscardIndex] = useState(undefined);
  const [isDeckDrag, setIsDeckDrag] = useState(false);
  const [setHover, setSetHover] = useState(true);

  // Drag handlers
  const onDragStart = result => {
    const { source, draggableId } = result;
    if (source.droppableId === 'player-hand') {
      setDragHandCard(draggableId);
    } else if (source.droppableId === 'discard') {
      setDragDiscardCard(draggableId);
      setDragDiscardIndex(source.index);
    } else if (source.droppableId === 'deck') {
      console.log('dragging deck');
      setIsDeckDrag(true);
    }
    console.log('Drag starting');
    console.log(result);
  };

  const onDragEnd = result => {
    setDragHandCard(undefined);
    setDragDiscardCard(undefined);
    setIsDeckDrag(false);
    console.log('Drag End');
    console.log(result);
    const { source, destination, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      setDragDiscardIndex(undefined);
      return;
    }

    if (source.droppableId === 'player-hand') {
      if (destination.droppableId === 'player-hand') {
        const updatedCards = [...cardsInHand];
        updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, draggableId);
        reorderHand(authData.IDToken, gameID, updatedCards);
        setCardsInHand(updatedCards);
      } else if (destination.droppableId === 'discard') {
        discardCardFromHand(
          null,
          authData.IDToken,
          gameID,
          draggableId,
          setClickedCards,
        );
      } else if (destination.droppableId === 'play-cards') {
        if (clickedCards.length > 0) {
          playCards(
            null,
            authData.IDToken,
            gameID,
            clickedCards,
            setClickedCards,
            undefined,
          );
        }
      } else {
        const destParts = destination.droppableId.split('$#$');
        if (destParts[0] === 'SET') {
          console.log('Dropping on a set');
          if (clickedCards.length > 0) {
            playCards(
              null,
              authData.IDToken,
              gameID,
              clickedCards,
              setClickedCards,
              destParts[1],
            );
          } else {
            playCards(
              null,
              authData.IDToken,
              gameID,
              [draggableId],
              setClickedCards,
              destParts[1],
            );
          }
        }
      }
    } else if (
      source.droppableId === 'deck' &&
      destination.droppableId === 'player-hand'
    ) {
      pickupDeck(null, authData.IDToken, gameID);
    } else if (
      source.droppableId === 'discard' &&
      destination.droppableId === 'player-hand'
    ) {
      pickupDiscard(
        null,
        authData.IDToken,
        gameID,
        dragDiscardIndex,
        setClickedDiscardIndex,
      );
    }
    setDragDiscardIndex(undefined);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="Game">
        <div className="Opponents-Cards-Container">
          {getOpponentCards(gameState, numCardsInOtherHand)}
        </div>
        {gameState === 'rummy' && (
          <div className="Rummy-Container">
            {getRummyPopup(
              gameState,
              authData.IDToken,
              gameID,
              yourTurn,
              discardPickup,
              canPickup,
              possibleRummies,
            )}
          </div>
        )}
        <Droppable
          droppableId="play-cards"
          direction="horizontal"
          isDropDisabled={setHover}
        >
          {provided => (
            <button
              ref={provided.innerRef}
              {...provided.droppableProps}
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
          )}
        </Droppable>

        <div className="Played-Cards">
          {buildPlayedSets(
            playedSets,
            gameState,
            authData.uid,
            authData.IDToken,
            gameID,
            clickedCards,
            setClickedCards,
            setSetHover,
          )}
        </div>

        <div className="Pickup-And-Discard">
          {getDiscardCards(
            gameState,
            authData.IDToken,
            gameID,
            clickedCards,
            setClickedCards,
            discardCards,
            clickedDiscardIndex,
            setClickedDiscardIndex,
            dragDiscardCard,
            dragDiscardIndex,
            dragHandCard,
            isDeckDrag,
          )}
        </div>
        <div className="Player-Cards">
          <Droppable droppableId="player-hand" direction="horizontal">
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
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
                {getPlayerCards(
                  gameState,
                  cardsInHand,
                  setClickedCards,
                  clickedCards,
                  dragHandCard,
                )}
                <div style={{ visibility: 'hidden' }}>
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Game;
