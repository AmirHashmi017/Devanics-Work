// DraggableTool.js
import React from 'react';
import { useDrag } from 'react-dnd';
import { StandardToolType } from '../types';

type Props = {
  type: StandardToolType;
  children: React.ReactNode;
};

const DraggableTool = ({ type, children }: Props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TOOL',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end(draggedItem, monitor) {
      const dropResult = monitor.getDropResult();
      if (draggedItem && dropResult) {
        console.log('draggedItem', draggedItem);
        console.log('dropResult', dropResult);
      }
    },
  }));

  return (
    <div
      ref={drag as any}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableTool;
