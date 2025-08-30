import React, { useContext, useEffect, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import moment from 'moment';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Line,
  Group,
  Text as KonvaText,
  Arrow,
  Circle,
  // Rect,
} from 'react-konva';
import { UploadFileData } from '../../context/UploadFileContext';
import { DrawHistoryContext, ReportDataContext } from '../../context';
import { DrawHistoryContextProps } from '../../context/DrawHistoryContext';
import {
  CircleInterface,
  CountInterface,
  DrawInterface,
  LineInterface,
  LineState,
  Measurements,
  PolygonConfigInterface,
  ScaleInterface,
  defaultMeasurements,
} from '../../types';
import { ScaleData } from '../page';
import useWheelZoom from './useWheelZoom';
import { useDraw } from '@/app/hooks';

const defaultCurrentLineState = { startingPoint: null, endingPoint: null };
const defaultPolyLineState: LineInterface = {
  points: [],
  stroke: '',
  strokeWidth: 0,
  textUnit: 18,
};

interface Props {
  selectedTool: ScaleInterface;
  scale: ScaleData;
  depth: number;
  color: string;
  border: number;
  unit: number;
  handleChangeMeasurements: (data: Measurements) => void;
  uploadFileData: UploadFileData;
  pageNumber: number;
  handleScaleModal: (open: boolean) => void;
  isEdit?: boolean;
  editData?: any;
  drawScale?: any;
  setdrawScale?: any;
  setscaleLine?: any;
  setModalOpen?: any;
  selectedCategory?: any;
}

const Draw: React.FC<Props> = ({
  selectedTool,
  scale,
  depth,
  border,
  unit,
  color,
  handleChangeMeasurements,
  uploadFileData,
  pageNumber,
  isEdit,
  editData,
  drawScale,
  setdrawScale,
  setModalOpen,
  setscaleLine,
  selectedCategory,
}) => {
  const { selected, subSelected = null } = selectedTool;
  const {
    calcLineDistance,
    calculateMidpoint,
    calculatePolygonArea,
    calculatePolygonPerimeter,
    calculatePolygonCenter,
    calculatePolygonVolume,
    calculateAngle,
    pointInCircle,
    // calcPerimeterDistance
  } = useDraw();
  const { deleteDrawHistory, updateDrawHistory, drawHistory } = useContext(
    DrawHistoryContext
  ) as DrawHistoryContextProps;
  console.log(drawHistory, isEdit, editData, ' ===> drawHistory');
  const { reportData } = useContext(ReportDataContext);

  const [draw, setDraw] = useState<DrawInterface | any>({
    line: [],
    area: [],
    volume: [],
    count: [],
    dynamic: [],
    scale: [],
    perimeter: [],
  });
  console.log(draw, 'drawdrawdrawdrawdrawdrawdrawdrawdrawdraw');
  useEffect(() => {
    if (drawHistory && drawHistory[`${pageNumber}`]) {
      //isEdit
      console.log('Edit flow run');

      setDraw({
        //@ts-ignore
        line: [],
        //@ts-ignore
        area: [],
        //@ts-ignore
        volume: [],
        //@ts-ignore
        count: [],
        //@ts-ignore
        dynamic: [],
        perimeter: [],
        ...drawHistory[`${pageNumber}`],
      });
    }
  }, [drawHistory, isEdit, editData]);

  const [polyLine, setPolyLine] = useState<LineInterface>(defaultPolyLineState);
  const [dynamicPolyLine, setDynamicPolyLine] =
    useState<LineInterface>(defaultPolyLineState);
  const [currentLine, setCurrentLine] = useState<LineState>(
    defaultCurrentLineState
  );
  const [completingLine, setCompletingLine] = useState<LineState>(
    defaultCurrentLineState
  );
  const [endLiveEditing, setEndLiveEditing] = useState(false);
  const [selectedShape, setSelectedShape] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [circle, setCircle] = useState<CircleInterface[]>([]);
  console.log(selected, drawScale, ' ===> selected and draw scal');

  const myImage = new Image();
  myImage.src =
    uploadFileData.src ||
    'https://wcs.smartdraw.com/floor-plan/img/house-design-example.png?bn=15100111902';

  const counterImage = new Image();
  counterImage.src = '/count-draw.png';

  useEffect(() => {
    setCurrentLine(defaultCurrentLineState);
    setCompletingLine(defaultCurrentLineState);
    setEndLiveEditing(false);
  }, [selected]);

  useEffect(() => {
    if (subSelected === 'clear') {
      setDraw((prev: any) => ({ ...prev, dynamic: [] }));
      setCircle([]);
    }
  }, [subSelected]);

  useEffect(() => {
    if (selected !== 'count') handleChangeMeasurements(defaultMeasurements);
  }, [selected]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (endLiveEditing) return;
    setSelectedShape('');

    const stage = e.target.getStage();
    const position = getRelativePointerPosition(stage);

    if (subSelected === 'fill') {
      setIsMouseDown(true);
      setCircle((prev) => {
        prev.push({
          x: position?.x || 0,
          y: position?.y || 0,
          fill: color,
          radius: 10,
        });
        return prev;
      });
      return;
    }

    if (
      selected === 'length' ||
      selected === 'area' ||
      selected === 'volume' ||
      (selected === 'scale' && drawScale == true) ||
      subSelected === 'create'
    ) {
      setCurrentLine((prev) => ({
        ...prev,
        startingPoint: { x: position?.x || 0, y: position?.y || 0 },
      }));
    }

    // draw scal handling
    if (
      selected === 'scale' &&
      drawScale == true &&
      currentLine.startingPoint
    ) {
      const { startingPoint } = currentLine;

      const newLine: LineInterface = {
        points: [
          startingPoint?.x,
          startingPoint?.y,
          position?.x,
          position?.y,
        ] as number[],
        stroke: color,
        strokeWidth: border,
        textUnit: unit,
        dateTime: moment().toDate(),
      };
      setDraw((prev: any) => ({ ...prev, scale: [newLine] })); //[...prev.scale, newLine]

      // updateDrawHistory(pageNumber.toString(), 'line', newLine);

      setCurrentLine(defaultCurrentLineState);
      handleChangeMeasurements(defaultMeasurements);

      //Modal states handlings
      if (selected === 'scale' && drawScale == true) {
        setModalOpen(true);
        setdrawScale(false);
        setscaleLine(newLine);
        // setDraw((ps:any)=>({...ps,scale:[]}))
      }
    }

    if (selected === 'length' && currentLine.startingPoint) {
      const { startingPoint } = currentLine;

      const newLine: LineInterface = {
        points: [
          startingPoint?.x,
          startingPoint?.y,
          position?.x,
          position?.y,
        ] as number[],
        stroke: color,
        strokeWidth: border,
        textUnit: unit,
        dateTime: moment().toDate(),
        projectName: 'Length Measurement',
        category:
          selectedCategory && selectedCategory?.length > 0
            ? selectedCategory
            : 'Length Measurement',
      };
      setDraw((prev: any) => ({ ...prev, line: [...prev.line, newLine] }));

      updateDrawHistory(pageNumber.toString(), 'line', newLine);

      setCurrentLine(defaultCurrentLineState);
      handleChangeMeasurements(defaultMeasurements);
    }

    if (selected === 'area' || selected === 'volume') {
      if (polyLine?.points.length && !completingLine.startingPoint) {
        const [x, y] = polyLine.points;
        setCompletingLine((prev) => ({ ...prev, startingPoint: { x, y } }));
      }

      setPolyLine((prev) => {
        if (!prev.points.length) {
          return {
            points: [position?.x || 0, position?.y || 0],
            stroke: color,
            strokeWidth: border,
            textUnit: unit,
          };
        } else {
          if (
            polyLine?.points.length &&
            currentLine.endingPoint &&
            pointInCircle([...polyLine.points.slice(0, 2)], 5, [
              currentLine.endingPoint.x,
              currentLine.endingPoint.y,
            ])
          ) {
            prev.points.push(...polyLine.points.slice(0, 2));
            setCurrentLine({ startingPoint: null, endingPoint: null });
            setCompletingLine({ startingPoint: null, endingPoint: null });

            setDraw((prevDraw: any) => {
              const polygonCoordinates = prev.points;
              const parameter = calculatePolygonPerimeter(
                polygonCoordinates,
                scale
              );

              console.log('parameter', parameter);

              if (selected === 'area') {
                const area = calculatePolygonArea(polygonCoordinates, scale);

                handleChangeMeasurements({
                  area: area,
                  parameter,
                  ...(currentLine.startingPoint && {
                    angle: calculateAngle([
                      currentLine.startingPoint.x,
                      currentLine.startingPoint.y,
                      position?.x || 0,
                      position?.y || 0,
                    ]),
                  }),
                });

                const areaConfig: PolygonConfigInterface = {
                  ...prev,
                  textUnit: unit,
                  dateTime: moment().toDate(),
                  projectName: 'Area Measurement',
                  category:
                    selectedCategory && selectedCategory?.length > 0
                      ? selectedCategory
                      : 'Area Measurement',
                };

                updateDrawHistory(pageNumber.toString(), 'area', areaConfig);

                return {
                  ...prevDraw,
                  area: [...prevDraw.area, areaConfig],
                };
              } else {
                const volume = calculatePolygonVolume(
                  polygonCoordinates,
                  depth,
                  scale
                );

                handleChangeMeasurements({
                  volume,
                  parameter,
                  ...(currentLine.startingPoint && {
                    angle: calculateAngle([
                      currentLine.startingPoint.x,
                      currentLine.startingPoint.y,
                      position?.x || 0,
                      position?.y || 0,
                    ]),
                  }),
                });

                const volumeConfig: PolygonConfigInterface = {
                  ...prev,
                  depth,
                  textUnit: unit,
                  dateTime: moment().toDate(),
                  projectName: 'Volume Measurement',
                  category:
                    selectedCategory && selectedCategory?.length > 0
                      ? selectedCategory
                      : 'Volume Measurement',
                };

                updateDrawHistory(
                  pageNumber.toString(),
                  'volume',
                  volumeConfig
                );

                return {
                  ...prevDraw,
                  volume: [...prevDraw.volume, volumeConfig],
                };
              }
            });

            return defaultPolyLineState;
          } else prev.points.push(...[position?.x || 0, position?.y || 0]);

          return { ...prev };
        }
      });
    }

    if (selected === 'count' && position) {
      const newCount: CountInterface = {
        x: position?.x - 2,
        y: position.y - 15,
        dateTime: moment().toDate(),
        projectName: 'Count Measurement',
        category:
          selectedCategory && selectedCategory?.length > 0
            ? selectedCategory
            : 'Count Measurement',
      };

      setDraw((prev: any) => {
        handleChangeMeasurements({ count: [...prev.count, newCount].length });
        return { ...prev, count: [...prev.count, newCount] };
      });

      updateDrawHistory(pageNumber.toString(), 'count', newCount);
    }

    if (subSelected === 'create') {
      setDynamicPolyLine((prev) => {
        if (!prev.points.length) {
          return {
            points: [position?.x || 0, position?.y || 0],
            stroke: color,
            strokeWidth: border,
            textUnit: unit,
            dateTime: moment().toDate(),
          };
        } else {
          prev.points.push(...[position?.x || 0, position?.y || 0]);
          return {
            ...prev,
          };
        }
      });
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (endLiveEditing) return;
    const stage = e.target.getStage();
    const position = getRelativePointerPosition(stage);
    console.log(
      selected,
      drawScale,
      currentLine,
      subSelected,
      ' ===> on mouse move data'
    );

    if (subSelected === 'fill') {
      if (isMouseDown) {
        setCircle((prev) => {
          prev.push({
            x: position?.x || 0,
            y: position?.y || 0,
            fill: color,
            radius: 10,
          });
          return prev;
        });
      }
      return;
    }

    if (currentLine.startingPoint) {
      setCurrentLine((prev) => ({
        ...prev,
        endingPoint: { x: position?.x || 0, y: position?.y || 0 },
      }));

      const angle = calculateAngle([
        currentLine.startingPoint.x,
        currentLine.startingPoint.y,
        position?.x || 0,
        position?.y || 0,
      ]);

      const parameter = calcLineDistance(
        [
          currentLine.startingPoint.x,
          currentLine.startingPoint.y,
          position?.x || 0,
          position?.y || 0,
        ],
        scale,
        true
      ) as string;
      console.log(parameter, ' ===> Parameters');

      handleChangeMeasurements({
        angle,
        ...(selected === 'length' && { parameter }),
        // ...((selected === 'scale' && drawScale == true) && { parameter }),
        ...(completingLine.endingPoint
          ? {
              parameter: calculatePolygonPerimeter(
                [
                  ...polyLine.points,
                  completingLine.endingPoint.x,
                  completingLine.endingPoint.y,
                ],
                scale
              ),
              area: calculatePolygonArea(
                [
                  ...polyLine.points,
                  completingLine.endingPoint.x,
                  completingLine.endingPoint.y,
                ],
                scale
              ),
              volume: calculatePolygonVolume(
                [
                  ...polyLine.points,
                  completingLine.endingPoint.x,
                  completingLine.endingPoint.y,
                ],
                depth,
                scale
              ),
            }
          : 0),
      });
    }

    if (completingLine.startingPoint) {
      setCompletingLine((prev) => ({
        ...prev,
        endingPoint: { x: position?.x || 0, y: position?.y || 0 },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    // if(selected === 'length' && drawScale == true){
    //   setModalOpen(true);
    //   setdrawScale(false);
    //   setscaleLine(draw?.scale[0]);
    //   setDraw((ps:any)=>({...ps,scale:[]}))
    // }
  };
  useEffect(() => {
    setDraw((ps: any) => ({ ...ps, scale: [] }));
  }, [selected]);
  useEffect(() => {
    console.log(
      draw,
      drawHistory,
      ' ===>reportdata',
      reportData,
      ' ===> Draw state'
    );
  }, [draw]);

  const {
    stageScale,
    stageX,
    stageY,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
  } = useWheelZoom({
    compHeight: uploadFileData.height || 600,
    compWidth: uploadFileData.width || 600,
  });
  return (
    <div
      className={`outline-none relative bg-grey-900 my-3`}
      tabIndex={1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setCurrentLine(defaultCurrentLineState);
          setCompletingLine(defaultCurrentLineState);
          setPolyLine(defaultPolyLineState);
          setDynamicPolyLine(defaultPolyLineState);
          handleChangeMeasurements(defaultMeasurements);
        }
        if (e.key === 'Enter' && subSelected === 'create') {
          setCurrentLine(defaultCurrentLineState);
          if (selected == 'dynamic') {
            setDraw((prevDraw: any) => ({
              ...prevDraw,
              dynamic: [
                ...prevDraw.dynamic,
                {
                  ...dynamicPolyLine,
                  strokeWidth: 10,
                  stroke: color,
                  lineCap: 'round',
                  id: `dynamic-${draw.dynamic.length + 1}`,
                  projectName: 'Dynamic Measurement',
                  category:
                    selectedCategory && selectedCategory?.length > 0
                      ? selectedCategory
                      : 'Dynamic Measurement',
                },
              ],
            }));
            updateDrawHistory(pageNumber.toString(), 'dynamic', {
              ...dynamicPolyLine,
              strokeWidth: 10,
              stroke: color,
              lineCap: 'round',
              id: `dynamic-${draw.dynamic.length + 1}`,
              projectName: 'Dynamic Measurement',
              category:
                selectedCategory && selectedCategory?.length > 0
                  ? selectedCategory
                  : 'Dynamic Measurement',
            });
          } else if (selected == 'perimeter') {
            setDraw((prevDraw: any) => ({
              ...prevDraw,
              perimeter: [
                ...prevDraw.perimeter,
                {
                  ...dynamicPolyLine,
                  // strokeWidth: 10,
                  stroke: color,
                  lineCap: 'round',
                  id: `perimeter-${draw.perimeter.length + 1}`,
                  projectName: 'Perimeter Measurement',
                  category:
                    selectedCategory && selectedCategory?.length > 0
                      ? selectedCategory
                      : 'Perimeter Measurement',
                },
              ],
            }));
            updateDrawHistory(pageNumber.toString(), 'perimeter', {
              ...dynamicPolyLine,
              // strokeWidth: 10,
              stroke: color,
              lineCap: 'round',
              id: `perimeter-${draw.perimeter.length + 1}`,
              projectName: 'Perimeter Measurement',
              category:
                selectedCategory && selectedCategory?.length > 0
                  ? selectedCategory
                  : 'Perimeter Measurement',
            });
          }

          setDynamicPolyLine(defaultPolyLineState);
        }

        if (e.key === 'Delete' && selectedShape) {
          const [shapeName, shapeNumber] = selectedShape.split('-');

          setDraw((prev: any) => {
            const tempPrevShapeData = [
              ...prev[shapeName as keyof DrawInterface],
            ];
            tempPrevShapeData.splice(+shapeNumber, 1);

            if (selected === 'count')
              handleChangeMeasurements({ count: tempPrevShapeData.length });

            deleteDrawHistory(pageNumber.toString(), {
              ...prev,
              [shapeName]: tempPrevShapeData,
            });

            return {
              ...prev,
              [shapeName]: tempPrevShapeData,
            };
          });

          setSelectedShape('');
        }
      }}
    >
      <div className=" flex justify-center space-x-4 absolute   bottom-0 left-[48%] z-50 ">
        <div
          className="cursor-pointer bg-white h-fit w-fit rounded-3xl"
          onClick={handleZoomIn}
        >
          <svg
            fill="#000000"
            height="30px"
            width="30px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 299.998 299.998"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <g>
                {' '}
                <g>
                  {' '}
                  <g>
                    {' '}
                    <path d="M139.414,96.193c-22.673,0-41.056,18.389-41.056,41.062c0,22.678,18.383,41.062,41.056,41.062 c22.678,0,41.059-18.383,41.059-41.062C180.474,114.582,162.094,96.193,139.414,96.193z M159.255,146.971h-12.06v12.06 c0,4.298-3.483,7.781-7.781,7.781c-4.298,0-7.781-3.483-7.781-7.781v-12.06h-12.06c-4.298,0-7.781-3.483-7.781-7.781 c0-4.298,3.483-7.781,7.781-7.781h12.06v-12.063c0-4.298,3.483-7.781,7.781-7.781c4.298,0,7.781,3.483,7.781,7.781v12.063h12.06 c4.298,0,7.781,3.483,7.781,7.781C167.036,143.488,163.555,146.971,159.255,146.971z"></path>{' '}
                    <path d="M149.997,0C67.157,0,0.001,67.158,0.001,149.995s67.156,150.003,149.995,150.003s150-67.163,150-150.003 S232.836,0,149.997,0z M225.438,221.254c-2.371,2.376-5.48,3.561-8.59,3.561s-6.217-1.185-8.593-3.561l-34.145-34.147 c-9.837,6.863-21.794,10.896-34.697,10.896c-33.548,0-60.742-27.196-60.742-60.744c0-33.548,27.194-60.742,60.742-60.742 c33.548,0,60.744,27.194,60.744,60.739c0,11.855-3.408,22.909-9.28,32.256l34.56,34.562 C230.185,208.817,230.185,216.512,225.438,221.254z"></path>{' '}
                  </g>{' '}
                </g>{' '}
              </g>{' '}
            </g>
          </svg>
        </div>
        <div
          className="cursor-pointer bg-white h-fit w-fit rounded-3xl"
          onClick={handleZoomOut}
        >
          <svg
            fill="#000000"
            height="30px"
            width="30px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 299.995 299.995"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <g>
                {' '}
                <g>
                  {' '}
                  <g>
                    {' '}
                    <path d="M139.415,96.195c-22.673,0-41.056,18.389-41.056,41.062c0,22.676,18.383,41.059,41.056,41.059 c7.446,0,14.41-2.01,20.43-5.478c2.625-1.511,5.06-3.308,7.275-5.342c0.08-0.073,0.163-0.145,0.241-0.218 c0.705-0.659,1.393-1.343,2.052-2.049c0.036-0.039,0.07-0.078,0.106-0.117c2.754-2.977,5.073-6.367,6.86-10.068 c2.596-5.387,4.095-11.404,4.095-17.787C180.474,114.584,162.093,96.195,139.415,96.195z M159.256,146.973h-39.684 c-4.298,0-7.781-3.483-7.781-7.781c0-4.298,3.483-7.781,7.781-7.781h39.684c4.298,0,7.781,3.483,7.781,7.781 C167.037,143.49,163.554,146.973,159.256,146.973z"></path>{' '}
                    <path d="M149.995,0C67.156,0,0,67.158,0,149.995s67.156,150,149.995,150s150-67.163,150-150S232.834,0,149.995,0z M225.437,221.254c-2.371,2.376-5.48,3.561-8.59,3.561c-3.11,0-6.217-1.185-8.593-3.561l-34.145-34.147 c-9.837,6.863-21.791,10.896-34.697,10.896c-33.548,0-60.742-27.196-60.742-60.744c0-33.548,27.194-60.742,60.742-60.742 c33.548,0,60.744,27.194,60.744,60.742c0,11.855-3.408,22.909-9.28,32.259l34.56,34.56 C230.183,208.817,230.183,216.512,225.437,221.254z"></path>{' '}
                  </g>{' '}
                </g>{' '}
              </g>{' '}
            </g>
          </svg>
        </div>
      </div>
      <Stage
        width={uploadFileData.width || 600}
        height={uploadFileData.height || 600}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        className={`flex justify-center cursor-pointer bg-slate-600/10 ${['area', 'volume', 'dynamic', 'length', 'perimeter'].includes(selected) ? '!cursor-crosshair' : ''}`}
      >
        <Layer
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <KonvaImage
            image={myImage}
            width={uploadFileData.width || 600}
            height={uploadFileData.height || 600}
          />

          {/* Scale Drawing Line */}
          {draw?.scale &&
            Array.isArray(draw?.scale) &&
            draw?.scale?.map(({ ...rest }: any, index: number) => {
              const id = `line-${index}`;
              // const lineDistance = calcLineDistance(rest.points, scale, true);
              // const lineMidPoint = calculateMidpoint(rest.points);

              return (
                <Group
                  id={id}
                  key={id}
                  onMouseDown={(e) => {
                    e.cancelBubble = true;
                    setSelectedShape(e.currentTarget.attrs?.id || '');
                  }}
                >
                  <Arrow
                    key={index}
                    {...rest}
                    lineCap="round"
                    dash={selectedShape === id ? [10, 10] : []}
                    stroke={selectedShape === id ? 'maroon' : rest.stroke}
                    pointerAtEnding={true}
                    pointerAtBeginning={true}
                  />
                  {/* <KonvaText
                  {...lineMidPoint}
                  fontSize={textUnit}
                  text={lineDistance.toString()}
                  fill="red"
                /> */}
                </Group>
              );
            })}

          {/* Drawing Line */}
          {draw.line.map(({ textUnit, ...rest }: any, index: number) => {
            const id = `line-${index}`;
            const lineDistance = calcLineDistance(rest.points, scale, true);
            const lineMidPoint = calculateMidpoint(rest.points);

            return (
              <Group
                id={id}
                key={id}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  setSelectedShape(e.currentTarget.attrs?.id || '');
                }}
              >
                <Arrow
                  key={index}
                  {...rest}
                  lineCap="round"
                  dash={selectedShape === id ? [10, 10] : []}
                  stroke={selectedShape === id ? 'maroon' : rest.stroke}
                  pointerAtEnding={true}
                  pointerAtBeginning={true}
                />
                <KonvaText
                  {...lineMidPoint}
                  fontSize={textUnit}
                  text={lineDistance.toString()}
                  fill="red"
                />
              </Group>
            );
          })}

          {/* Drawing Dynamic Fill */}
          {draw.dynamic.map(({ ...rest }: any, index: number) => {
            const id = `dynamic-${index}`;

            return (
              <Group
                key={id}
                id={id}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  setSelectedShape(e.currentTarget.attrs?.id || '');
                }}
              >
                <Line
                  {...rest}
                  dash={selectedShape === id ? [10, 10] : []}
                  lineCap={selectedShape === id ? 'square' : rest.lineCap}
                  stroke={selectedShape === id ? 'maroon' : rest.stroke}
                />
              </Group>
            );
          })}
          {/* Drawing Perimeter Fill */}
          {draw.perimeter.map(({ ...rest }: any, index: number) => {
            const id = `perimeter-${index}`;

            // const lineDistance = calcPerimeterDistance(rest.points, scale, true);
            // const lineMidPoint = calculateMidpoint(rest.points);
            const lineDistance =
              rest?.points?.length > 4
                ? calculatePolygonPerimeter(rest.points, scale)
                : calcLineDistance(rest.points, scale, true);
            const lineMidPoint =
              rest?.points?.length > 4
                ? calculatePolygonCenter(rest.points)
                : calculateMidpoint(rest.points);

            return (
              <Group
                key={id}
                id={id}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  setSelectedShape(e.currentTarget.attrs?.id || '');
                }}
              >
                <Arrow
                  {...rest}
                  dash={selectedShape === id ? [10, 10] : []}
                  lineCap={selectedShape === id ? 'square' : rest.lineCap}
                  stroke={selectedShape === id ? 'maroon' : rest.stroke}
                  pointerAtEnding={true}
                  pointerAtBeginning={true}
                />
                <KonvaText
                  {...lineMidPoint}
                  fontSize={rest?.textUnit}
                  text={lineDistance.toString()}
                  fill="red"
                />
              </Group>
            );
          })}
          {!!dynamicPolyLine.points.length && <Line {...dynamicPolyLine} />}

          {/* Drawing Area */}
          {draw.area.map(({ textUnit, ...rest }: any, index: number) => {
            const polygonCoordinates = rest.points;
            const center = calculatePolygonCenter(polygonCoordinates);
            const area = calculatePolygonArea(polygonCoordinates, scale);

            const text = `${area?.toFixed(4) || ''}sq`;
            const id = `area-${index}`;

            return (
              <Group
                id={id}
                key={id}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  setSelectedShape(e.currentTarget.attrs?.id || '');
                }}
              >
                <Line
                  {...rest}
                  id={id}
                  closed={true}
                  dash={selectedShape === id ? [10, 10] : []}
                  stroke={selectedShape === id ? 'maroon' : rest.stroke}
                  onMouseDown={(e) => {
                    e.cancelBubble = true;
                    setSelectedShape(e.currentTarget.attrs?.id || '');
                  }}
                  fill="rgba(255, 0, 0, 0.2)"
                />
                <KonvaText
                  {...center}
                  fontSize={textUnit}
                  text={text}
                  offsetX={30}
                  fill="red"
                />
              </Group>
            );
          })}

          {!!polyLine.points.length && <Line {...polyLine} />}

          {/* Drawing Volume */}
          {draw.volume.map(
            ({ depth, textUnit, ...rest }: any, index: number) => {
              const polygonCoordinates = rest.points;
              const center = calculatePolygonCenter(polygonCoordinates);
              const volume = calculatePolygonVolume(
                polygonCoordinates,
                depth || 0,
                scale
              );
              const text = `${volume?.toFixed(2) || ''} cubic`;
              const id = `volume-${index}`;

              return (
                <Group
                  id={id}
                  key={id}
                  onMouseDown={(e) => {
                    e.cancelBubble = true;
                    setSelectedShape(e.currentTarget.attrs?.id || '');
                  }}
                >
                  <Line
                    {...rest}
                    closed={true}
                    id={id}
                    dash={selectedShape === id ? [10, 10] : []}
                    stroke={selectedShape === id ? 'maroon' : rest.stroke}
                    onMouseDown={(e) => {
                      e.cancelBubble = true;
                      setSelectedShape(e.currentTarget.attrs?.id || '');
                    }}
                    fill="rgba(255, 255, 0, 0.2)"
                  />
                  <KonvaText
                    {...center}
                    fontSize={textUnit}
                    text={text}
                    offsetX={30}
                    fill="red"
                  />
                </Group>
              );
            }
          )}

          {currentLine.startingPoint &&
            currentLine.endingPoint &&
            selected !== 'count' &&
            !(selected == 'scale' && drawScale != true) && (
              <Line
                points={[
                  currentLine.startingPoint.x,
                  currentLine.startingPoint.y,
                  currentLine.endingPoint.x,
                  currentLine.endingPoint.y,
                ]}
                stroke={color}
                strokeWidth={border}
              />
            )}

          {completingLine.startingPoint &&
            completingLine.endingPoint &&
            (selected === 'area' || selected === 'volume') && (
              <Line
                points={[
                  completingLine.startingPoint.x,
                  completingLine.startingPoint.y,
                  completingLine.endingPoint.x,
                  completingLine.endingPoint.y,
                ]}
                stroke="gray"
                strokeWidth={border}
              />
            )}

          {/* Drawing Count */}
          {draw.count.map(({ ...rest }, index: number) => {
            const id = `count-${index}`;

            return (
              <KonvaImage
                id={`count-${index}`}
                key={`count-${index}`}
                image={counterImage}
                fill={selectedShape === id ? 'gray' : ''}
                width={20}
                height={20}
                {...rest}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  setSelectedShape(e.currentTarget.attrs?.id || '');
                }}
              />
            );
          })}

          {/* Drawing Fill Color Dynamic */}
          {/* <Circle x={10} y={10} radius={10} fill="red" /> */}
          {circle.map(({ x, y, fill, radius }, index) => (
            <Circle key={index} x={x} y={y} radius={radius} fill={fill} />
          ))}

          {/* Draw for scaling */}
        </Layer>
      </Stage>
    </div>
  );
};

export default Draw;

const getRelativePointerPosition = (node: any) => {
  if (node) {
    const transform = node?.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage().getPointerPosition();
    return transform.point(pos);
  }
};
