import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import deck from '../../constants/deck';
import * as CardImages from '../../resources/png/Cards';
import cardBack from '../../resources/png/CardBack.png';

const DIGIT_TO_STRING = {
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  '10': 'Ten',
  Jack: 'Jack',
  Queen: 'Queen',
  King: 'King',
  Ace: 'Ace',
};

const convertNameToImage = cardName => {
  if (cardName === 'back') {
    return cardBack;
  }
  const nameParts = cardName.split(' ');
  const convertedCardName = DIGIT_TO_STRING[nameParts[0]];
  const suitName = nameParts[2];
  return CardImages[suitName][convertedCardName];
};

const getCardIndex = cardName => {
  if (cardName === 'back') {
    return 53;
  }
  return deck.indexOf(cardName);
};

const Card = props => {
  const { cardName, isClicked, onClick, isDraggable, index = 0 } = props;
  const fixedCardName = cardName || 'back';

  if (isDraggable) {
    return (
      <Draggable draggableId={fixedCardName} index={index}>
        {provided => (
          <img
            className={`Card ${isClicked ? 'clicked' : ''}`}
            onClick={onClick}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            src={convertNameToImage(fixedCardName)}
            alt={fixedCardName}
          />
        )}
      </Draggable>
    );
  }
  return (
    <img
      src={convertNameToImage(fixedCardName)}
      alt={fixedCardName}
      className={`Card ${isClicked ? 'clicked' : ''}`}
      onClick={onClick}
    />
  );
};

export default Card;
