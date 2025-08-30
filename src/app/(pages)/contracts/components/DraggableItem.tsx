import React from 'react';
import { useDrag } from 'react-dnd';

type Position = {
  x: number;
  y: number;
};

type Props<T extends { position: Position; id: string }> = {
  data: T;
  children: React.ReactNode;
  type: string;
};

const DraggableItem = <T extends { position: Position; id: string }>({
  data,
  children,
}: Props<T>) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'TOOL',
      item: data,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [data.position, data.id]
  );

  return (
    <div
      ref={(node) => {
        drag(node);
      }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: 'absolute',
        left: data.position.x,
        top: data.position.y,
        cursor: 'move',
        padding: 0,
        margin: 0,
        backgroundColor: 'transparent',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
