import { useDraw } from '@/app/hooks';
import Konva from 'konva';
import React, { useState, useEffect, useRef } from 'react';
import { Line, Circle, Text } from 'react-konva';
import { ScaleData } from '../page';

interface ControlPoint {
  x: number;
  y: number;
  index: number;
  offsetX: number;
  offsetY: number;
}
interface EditableCurvedShapeProps {
  cur: any;
  selectedShape: string | any;
  setSelectedShape: (shape: string) => void;
  draw: any;
  setDraw: any;
  id: string;
  scaleUnits: string;
  scale: ScaleData;
}
const EditableArcShape: React.FC<EditableCurvedShapeProps> = ({
  cur,
  id,
  scaleUnits,
  selectedShape,
  draw,
  setDraw,
  setSelectedShape,
  scale,
}) => {
  console.log(scaleUnits, setSelectedShape);
  const [points, setPoints] = useState<number[]>([]);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [area, setArea] = useState<number>(0);
  const [dis, setDis] = useState<number | string>(0);
  const lineRef = useRef<Konva.Line>();
  console.log(area, dis);
  useEffect(() => {
    if (cur?.points) {
      setPoints(cur?.points);
    }
    if (cur?.controlPoints) {
      setControlPoints(cur?.controlPoints);
    }
  }, [cur]);

  useEffect(() => {
    // Initialize control points at the midpoints of each line segment
    let newControlPoints: ControlPoint[] = [];
    for (let i = 0; i < points.length; i += 4) {
      const nextIndex = (i + 2) % points.length;
      const midX = (points[i] + points[nextIndex]) / 2;
      const midY = (points[i + 1] + points[nextIndex + 1]) / 2;
      newControlPoints.push({
        x: midX,
        y: midY,
        index: i,
        offsetX: 0,
        offsetY: 0,
      });
    }
    if (!Array.isArray(cur?.controlPoints)) {
      setControlPoints(newControlPoints);
    }
    setArea(calculateArea(points, newControlPoints));
    setDis(calculateLineDistance(points, newControlPoints));
  }, [points, scale]);

  console.log(points, ' ===> points of drag');

  // const handleDragMove = (e: any, index: number) => {
  //   const newPoints = points.slice();
  //   newPoints[index] = e.target.x();
  //   newPoints[index + 1] = e.target.y();
  //   setPoints(newPoints);
  //   setArea(calculateArea(newPoints, controlPoints));
  // };

  const handleControlPointDragMove = (e: any, controlIndex: number) => {
    const newControlPoints = controlPoints.slice();
    const controlPoint = newControlPoints[controlIndex];
    const point1 = {
      x: points[controlPoint.index],
      y: points[controlPoint.index + 1],
    };
    const point2 = {
      x: points[(controlPoint.index + 2) % points.length],
      y: points[(controlPoint.index + 3) % points.length],
    };

    // Calculate offset from closest point on line
    const closestPoint = getClosestPointOnLine(point1, point2, {
      x: e.target.x(),
      y: e.target.y(),
    });
    const offsetX = e.target.x() - closestPoint.x;
    const offsetY = e.target.y() - closestPoint.y;

    newControlPoints[controlIndex] = {
      ...newControlPoints[controlIndex],
      x: e.target.x(),
      y: e.target.y(),
      offsetX,
      offsetY,
    };

    setControlPoints(newControlPoints);
    setArea(calculateArea(points, newControlPoints));
    setDis(calculateLineDistance(points, newControlPoints));
  };

  const getClosestPointOnLine = (
    A: { x: number; y: number },
    B: { x: number; y: number },
    P: { x: number; y: number }
  ) => {
    const AP = { x: P.x - A.x, y: P.y - A.y };
    const AB = { x: B.x - A.x, y: B.y - A.y };
    const ab2 = AB.x * AB.x + AB.y * AB.y;
    const ap_ab = AP.x * AB.x + AP.y * AB.y;
    const t = Math.min(1, Math.max(0, ap_ab / ab2));
    return { x: A.x + AB.x * t, y: A.y + AB.y * t };
  };

  // const getBezierPoints = (customPoints: number[] = points) => {
  //   const bezierPoints: number[] = [];
  //   for (let i = 0; i < customPoints.length; i += 2) {
  //     const nextIndex = (i + 2) % customPoints.length;
  //     const controlIndex = i / 2;
  //     bezierPoints.push(customPoints[i], customPoints[i + 1]);
  //     bezierPoints.push(
  //       controlPoints[controlIndex].x + controlPoints[controlIndex].offsetX,
  //       controlPoints[controlIndex].y + controlPoints[controlIndex].offsetY
  //     );
  //     bezierPoints.push(customPoints[nextIndex], customPoints[nextIndex + 1]);
  //   }
  //   return bezierPoints;
  // };

  const getBezierPoints = (customPoints: number[] = points) => {
    try {
      const bezierPoints: number[] = [];
      for (let i = 0; i < customPoints.length; i += 2) {
        const nextIndex = (i + 2) % customPoints.length;
        const controlIndex = 0; //i / 2;
        bezierPoints.push(customPoints[i], customPoints[i + 1]);
        bezierPoints.push(
          controlPoints[controlIndex].x + controlPoints[controlIndex].offsetX,
          controlPoints[controlIndex].y + controlPoints[controlIndex].offsetY
        );
        bezierPoints.push(customPoints[nextIndex], customPoints[nextIndex + 1]);
      }
      console.log(bezierPoints, ' ==> bezier points in get bezier points');
      return bezierPoints;
    } catch (error) {
      console.log(error);
      return customPoints;
    }
  };

  const calculateArea = (
    points: number[],
    controlPoints: ControlPoint[],
    numSegments: number = 20
  ): number => {
    const pixelToInchScale = 144;
    // Approximate the curve with small line segments
    const approxPoints = approximateCurve(
      points,
      controlPoints,
      numSegments
    ).map((coordinate) => coordinate / pixelToInchScale);
    let sum = 0;
    for (let i = 0; i < approxPoints.length; i += 2) {
      const x1 = approxPoints[i];
      const y1 = approxPoints[i + 1];
      const x2 = approxPoints[(i + 2) % approxPoints.length];
      const y2 = approxPoints[(i + 3) % approxPoints.length];
      sum += x1 * y2 - x2 * y1;
    }
    let area = Math.abs(sum) / 2;
    // return area
    const { xScale, yScale } = scale;
    const xScaleMultiplier = getScaleMultiplier(xScale);
    const yScaleMultiplier = getScaleMultiplier(yScale);
    area = area / 144;
    console.log(
      xScale,
      yScale,
      xScaleMultiplier,
      yScaleMultiplier,
      +Math.abs(area / 2).toFixed(2),
      ' ===> Area Calculation values to log'
    );
    return Number((area * (xScaleMultiplier * xScaleMultiplier)).toFixed(2));
  };

  const dragEnd = () => {
    const [shapeName, shapeNumber] = id.split('-');
    console.log(shapeName);
    // Update the draw object
    const updatedDraw = {
      ...draw,
      arc: draw.arc.map((line: any, index: number) =>
        index === +shapeNumber
          ? {
              ...line,
              points: points,
              controlPoints,
              text: calculateLineDistance(points, controlPoints) ?? cur?.text,
            }
          : line
      ),
    };
    setDraw(updatedDraw);
  };

  const approximateCurve = (
    points: number[],
    controlPoints: ControlPoint[],
    numSegments: number
  ): number[] => {
    const approxPoints: number[] = [];
    for (let i = 0; i < points.length; i += 2) {
      const nextIndex = (i + 2) % points.length;
      const controlIndex = 0; //i / 2;

      const x0 = points[i];
      const y0 = points[i + 1];
      const x1 =
        controlPoints[controlIndex].x + controlPoints[controlIndex].offsetX;
      const y1 =
        controlPoints[controlIndex].y + controlPoints[controlIndex].offsetY;
      const x2 = points[nextIndex];
      const y2 = points[nextIndex + 1];

      for (let t = 0; t <= 1; t += 1 / numSegments) {
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
        approxPoints.push(x, y);
      }
    }
    return approxPoints;
  };

  const calculateLineDistance = (
    points: number[],
    controlPoints: ControlPoint[],
    numSegments: number = 20
  ): number => {
    if (!(points?.length > 0) || !(controlPoints?.length > 0)) return 0;
    const approximateCurve1 = (
      points: number[],
      controlPoints: ControlPoint[],
      numSegments: number
    ): number[] => {
      const approxPoints: number[] = [];
      for (let i = 0; i < points.length; i += 2) {
        const nextIndex = (i + 2) % points.length;
        const controlIndex = 0; //i / 2;

        const x0 = points[i];
        const y0 = points[i + 1];
        const x1 =
          controlPoints[controlIndex].x + controlPoints[controlIndex].offsetX;
        const y1 =
          controlPoints[controlIndex].y + controlPoints[controlIndex].offsetY;
        const x2 = points[nextIndex];
        const y2 = points[nextIndex + 1];

        for (let t = 0; t <= 1; t += 1 / numSegments) {
          const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
          const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
          approxPoints.push(x, y);
        }
      }
      return approxPoints;
    };

    const approxPoints = approximateCurve1(points, controlPoints, numSegments);
    let totalLength: any = 0;
    for (let i = 0; i < approxPoints.length - 2; i += 4) {
      const x1 = approxPoints[i];
      const y1 = approxPoints[i + 1];
      const x2 = approxPoints[i + 2];
      const y2 = approxPoints[i + 3];
      totalLength += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    const xScaleMultiplier = getScaleMultiplier(scale.xScale);
    totalLength = totalLength / 144;
    totalLength = totalLength * xScaleMultiplier;
    totalLength = convertToFeetAndInches(totalLength, scale.precision);
    // return Number(totalLength.toFixed(2));
    return totalLength;
  };

  const { calculateMidpoint, getScaleMultiplier, convertToFeetAndInches } =
    useDraw();

  const { textUnit, ...rest } = cur;
  console.log(textUnit);
  const center = calculateMidpoint(rest.points);
  return (
    <>
      <Line
        {...rest}
        ref={lineRef}
        points={controlPoints.length > 0 ? getBezierPoints(cur?.points) : []}
        stroke={selectedShape === id ? 'maroon' : cur?.stroke}
        dash={selectedShape === id ? [10, 10] : []}
        strokeWidth={cur?.strokeWidth ?? 4}
        closed={false}
        fill={cur?.fillColor ?? 'rgba(255, 0, 0, 0.2)'}
        bezier
        draggable={false}
        onDragStart={(e) => {
          //Local variable storage
          const node = e.target as any;
          // Store the initial position
          node._initialPos = {
            x: node.x(),
            y: node.y(),
          };
        }}
        onDragEnd={(e) => {
          const [shapeName, shapeNumber] = id.split('-');
          console.log(shapeNumber, shapeName);
          const node = e.target as any;
          const originalPoints = draw?.curve[shapeNumber]?.points.slice(); // Copy the original points

          // Get the initial position from the drag start event
          const initialPos = node._initialPos || { x: 0, y: 0 };

          // Calculate the total translation (dx, dy)
          const dx = node.x() - initialPos.x;
          const dy = node.y() - initialPos.y;

          // Update all points based on the total translation distance
          const newPoints: any[] = [];
          for (let i = 0; i < originalPoints.length; i += 2) {
            newPoints.push(originalPoints[i] + dx, originalPoints[i + 1] + dy);
          }

          // Log for debugging purposes
          console.log(
            originalPoints,
            newPoints,
            dx,
            dy,
            ' ===> original and new points are here'
          );

          // Reset the node position to the initial position
          node.position(initialPos);

          // Update the draw object
          const updatedDraw = {
            ...draw,
            arc: draw.arc.map((line: any, index: number) =>
              index === +shapeNumber ? { ...line, points: newPoints } : line
            ),
          };

          // Set the updated draw object to state
          setDraw(updatedDraw);

          // Save the current position as the last known position
          node._lastPos = { x: node.x(), y: node.y() };
        }}
      />
      {/* {points.map((point, i) => (
        i % 2 === 0 && (
          <Circle
            key={i}
            x={point}
            y={points[i + 1]}
            radius={5}
            fill="red"
            draggable
            onDragMove={(e) => handleDragMove(e, i)}
            onDragEnd={dragEnd}
          />
        )
      ))} */}
      {controlPoints.map((controlPoint, i) => (
        <Circle
          key={`control-${i}`}
          x={controlPoint.x}
          y={controlPoint.y}
          radius={5}
          fill="blue"
          draggable
          onDragMove={(e) => handleControlPointDragMove(e, i)}
          onDragEnd={dragEnd}
        />
      ))}
      {/* <Text
        text={`Area: ${area.toFixed(2)} square units`}
        x={10}
        y={10}
        fontSize={18}
        fill="black"
      /> */}
      <Text
        {...center}
        fontSize={cur?.textUnit ?? 22}
        // text={area + ' SF'}
        // text={dis + ''}
        text={`${calculateLineDistance(points, controlPoints)}`}
        offsetX={30}
        fill={cur?.textColor ?? 'red'}
      />
    </>
  );
};

export default EditableArcShape;
