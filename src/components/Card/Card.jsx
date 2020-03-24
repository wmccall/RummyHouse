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
  const { cardName, isClicked, onClick } = props;
  const fixedCardName = cardName || 'back';
  return (
    <Draggable draggableID={fixedCardName} index={getCardIndex(fixedCardName)}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          className={`Card ${isClicked ? 'clicked' : ''}`}
          onClick={onClick}
        >
          <img src={convertNameToImage(fixedCardName)} alt={fixedCardName} />
        </div>
      )}
    </Draggable>
  );
};

export default Card;
