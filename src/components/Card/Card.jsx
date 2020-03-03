import React from 'react';
import * as CardImages from '../../resources/png/Cards';

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
  const nameParts = cardName.split(' ');
  const convertedCardName = DIGIT_TO_STRING[nameParts[0]];
  const suitName = nameParts[2];
  return CardImages[suitName][convertedCardName];
};

const Card = props => {
  const { cardName } = props;
  console.log('cardProps');
  console.log(cardName);
  return (
    <div className="Card">
      <img src={convertNameToImage(cardName)} alt={cardName} />
    </div>
  );
};

export default Card;
