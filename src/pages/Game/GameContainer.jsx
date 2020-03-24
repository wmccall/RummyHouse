import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import Game from './Game';

const onDragStart = () => {
  console.log('Drag starting');
};

const onDragEnd = () => {
  console.log('Drag End');
};
const GameContainer = () => {
  console.log('Game Container');

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Game />
    </DragDropContext>
  );
};

export default GameContainer;
