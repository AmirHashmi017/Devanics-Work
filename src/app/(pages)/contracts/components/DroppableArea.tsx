// DroppableArea.js
import React from 'react';
import { useDrop } from 'react-dnd';
import { StandardToolType } from '../types';

type Props = {
  onDrop: (
    _item:
      | { type: StandardToolType }
      | {
          tool: StandardToolType;
          position: { x: number; y: number };
          id: string;
        },
    _offset: { x: number; y: number }
  ) => void;
  children: React.ReactNode;
};

const DroppableArea = ({ onDrop, children }: Props) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TOOL',
    drop: (
      item: {
        type: StandardToolType;
        tool?: StandardToolType;
        [key: string]: any;
      },
      monitor
    ) => {
      if (item.tool) {
        // const delta1 = monitor.getClientOffset();
        const delta2 = monitor.getDifferenceFromInitialOffset();

        if (!delta2) return;

        // const newPosition = {
        //     x: item.position.x + delta.x,
        //     y: item.position.y + delta.y,
        // };
        const left = Math.round(item.position.x + delta2.x);
        // - delta2.x
        const top = Math.round(item.position.y + delta2.y);
        //  - delta2.y
        console.log('If Block', item, delta2);
        onDrop(item, { x: left, y: top });
      } else {
        const offset = monitor.getClientOffset();
        console.log('Else Block');
        if (!offset) {
          return;
        }
        onDrop(item, offset);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      style={{
        minHeight: '100px',
        backgroundColor: isOver ? 'lightgreen' : 'lightgrey',
        padding: '10px',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
