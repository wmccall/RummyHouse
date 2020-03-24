const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const values = [
  'Ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
];

const deck = suits.flatMap(suit => {
  return values.map(value => `${value} of ${suit}`);
});

export default deck;
