import { useState } from 'react';

interface WheelZoomProps {
  compWidth: number; // Width of the component
  compHeight: number; // Height of the component
  initialScale?: number;
  initialX?: number;
  initialY?: number;
}

const useWheelZoom = ({
  compWidth,
  compHeight,
  initialScale = 1,
  initialX = 0,
  initialY = 0,
}: WheelZoomProps) => {
  const [stageScale, setStageScale] = useState(initialScale);
  const [stageX, setStageX] = useState(initialX);
  const [stageY, setStageY] = useState(initialY);

  const scaleBy = 1.1; // Control the zoom intensity

  const handleZoomIn = () => {
    const newScale = stageScale * scaleBy;
    const centerX = compWidth / 2; // Central point for zoom based on component width
    const centerY = compHeight / 2; // Central point for zoom based on component height

    const newStageX = stageX - (centerX - stageX) * (scaleBy - 1);
    const newStageY = stageY - (centerY - stageY) * (scaleBy - 1);

    setStageScale(newScale);
    setStageX(newStageX);
    setStageY(newStageY);
  };

  const handleZoomOut = () => {
    const newScale = stageScale / scaleBy;
    const centerX = compWidth / 2;
    const centerY = compHeight / 2;

    const newStageX = stageX + (centerX - stageX) * (1 - 1 / scaleBy);
    const newStageY = stageY + (centerY - stageY) * (1 - 1 / scaleBy);

    setStageScale(newScale);
    setStageX(newStageX);
    setStageY(newStageY);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const newScale =
      e.evt.deltaY > 0 ? stageScale * scaleBy : stageScale / scaleBy;
    const pointerPosition = e.target.getStage().getPointerPosition();

    const newStageX =
      stageX - (pointerPosition.x - stageX) * (newScale / stageScale - 1);
    const newStageY =
      stageY - (pointerPosition.y - stageY) * (newScale / stageScale - 1);

    setStageScale(newScale);
    setStageX(newStageX);
    setStageY(newStageY);
  };

  return {
    stageScale,
    stageX,
    stageY,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
  };
};

export default useWheelZoom;
