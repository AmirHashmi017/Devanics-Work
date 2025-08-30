import React, { useContext, useEffect, useRef, useState } from 'react';
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
  Path,
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
// import useWheelZoom from './useWheelZoom';
import { useDraw } from '@/app/hooks';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/authSlices/auth.selector';
import Konva from 'konva';
import EditableText from './Editabletext';
import EditableCurvedShape from './EditableCurvedShape';

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
  selectedSubCategory?: any;
  updateMeasurements?: any;
  draw: DrawInterface | any;
  setDraw: any;
  stageScale: any;
  stageX: any;
  stageY: any;
  handleWheel: any;
  handleZoomIn: any;
  handleZoomOut: any;
  textColor?: any;
  fillColor?: any;
  countType?: string;
  scaleUnits?: string;
  isDrag?: boolean;
  selectedShape?: string;
  setSelectedShape?: any;
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
  selectedSubCategory,
  // updateMeasurements,
  draw,
  setDraw,
  stageScale,
  stageX,
  stageY,
  handleWheel,
  handleZoomIn,
  handleZoomOut,
  textColor,
  fillColor,
  countType,
  scaleUnits = 'feet',
  isDrag,
  selectedShape,
  setSelectedShape,
}) => {
  const { user } = useSelector(selectUser);
  console.log(user, ' current working user');
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

  // useEffect(()=>{
  //   console.log(draw, 'drawdrawdrawdrawdrawdrawdrawdrawdrawdraw')
  //   updateMeasurements(draw)
  // },[draw])
  // useEffect(() => {
  //   if (drawHistory && drawHistory[`${pageNumber}`]) {//isEdit
  //     console.log("Edit flow run");

  //     setDraw({
  //       //@ts-ignore
  //       line: [], area: [], volume: [], count: [], dynamic: [], perimeter: [], ...drawHistory[`${pageNumber}`]
  //     })
  //   }
  // }, [drawHistory, isEdit, editData])

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
  // const [selectedShape, setSelectedShape] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [circle, setCircle] = useState<CircleInterface[]>([]);
  console.log(selected, drawScale, ' ===> selected and draw scal');
  const [imgLoading, setimgLoading] = useState<boolean>(true);

  const myImage = new Image();
  myImage.src =
    uploadFileData.src ||
    'https://wcs.smartdraw.com/floor-plan/img/house-design-example.png?bn=15100111902';

  myImage.onload = () => {
    setimgLoading(false);
  };

  const counterImage = new Image();
  counterImage.src = '/count-draw.png';
  // const getCounterImage = (type: string) => {
  //   const retimg = new Image();
  //   if (type == 'tick') retimg.src = '/count-draw.png';
  //   if (type == 'branch') retimg.src = '/count-branch.png';
  //   if (type == 'cross') retimg.src = '/count-cross.png';
  //   if (type == 'home') retimg.src = '/count-home.png';
  //   if (type == 'info') retimg.src = '/count-info.png';
  //   return retimg
  // }

  const getCounterImagePath = (type: string) => {
    let retimg =
      'M12.0893 0.715545C12.1634 0.784058 12.2232 0.866492 12.2653 0.958135C12.3075 1.04978 12.3312 1.14883 12.335 1.24963C12.3389 1.35043 12.3228 1.45101 12.2878 1.5456C12.2527 1.64019 12.1994 1.72694 12.1308 1.8009L5.21718 9.26408C5.08555 9.40838 4.92527 9.52365 4.74658 9.60251C4.5679 9.68138 4.37473 9.72211 4.17941 9.72211C3.98409 9.72211 3.79092 9.68138 3.61223 9.60251C3.43355 9.52365 3.27327 9.40838 3.14164 9.26408L0.257843 6.15155C0.119412 6.00212 0.0460094 5.80383 0.0537827 5.60028C0.061556 5.39674 0.149868 5.20462 0.299292 5.06619C0.448716 4.92776 0.647012 4.85435 0.850556 4.86213C1.0541 4.8699 1.24622 4.95821 1.38465 5.10764L4.04425 7.9798C4.11716 8.05854 4.24166 8.05854 4.31458 7.97981L11.004 0.756995C11.0725 0.682956 11.1549 0.623147 11.2466 0.580989C11.3382 0.538831 11.4372 0.515151 11.538 0.511301C11.6389 0.507452 11.7394 0.523509 11.834 0.558555C11.9286 0.593601 12.0154 0.646947 12.0893 0.715545ZM15.9272 0.715545C16.0013 0.784058 16.0611 0.866492 16.1032 0.958135C16.1454 1.04978 16.1691 1.14883 16.1729 1.24963C16.1768 1.35043 16.1607 1.45101 16.1257 1.5456C16.0906 1.64019 16.0373 1.72694 15.9687 1.8009L9.05584 9.26408C8.91741 9.41351 8.72529 9.50182 8.52175 9.50959C8.31821 9.51737 8.11991 9.44396 7.97049 9.30553C7.82106 9.1671 7.73275 8.97498 7.72498 8.77144C7.7172 8.56789 7.79061 8.3696 7.92904 8.22017L14.8426 0.756995C14.981 0.607696 15.1729 0.519458 15.3763 0.511685C15.5797 0.503912 15.7779 0.577241 15.9272 0.715545Z';
    if (type == 'tick')
      retimg =
        'M12.0893 0.715545C12.1634 0.784058 12.2232 0.866492 12.2653 0.958135C12.3075 1.04978 12.3312 1.14883 12.335 1.24963C12.3389 1.35043 12.3228 1.45101 12.2878 1.5456C12.2527 1.64019 12.1994 1.72694 12.1308 1.8009L5.21718 9.26408C5.08555 9.40838 4.92527 9.52365 4.74658 9.60251C4.5679 9.68138 4.37473 9.72211 4.17941 9.72211C3.98409 9.72211 3.79092 9.68138 3.61223 9.60251C3.43355 9.52365 3.27327 9.40838 3.14164 9.26408L0.257843 6.15155C0.119412 6.00212 0.0460094 5.80383 0.0537827 5.60028C0.061556 5.39674 0.149868 5.20462 0.299292 5.06619C0.448716 4.92776 0.647012 4.85435 0.850556 4.86213C1.0541 4.8699 1.24622 4.95821 1.38465 5.10764L4.04425 7.9798C4.11716 8.05854 4.24166 8.05854 4.31458 7.97981L11.004 0.756995C11.0725 0.682956 11.1549 0.623147 11.2466 0.580989C11.3382 0.538831 11.4372 0.515151 11.538 0.511301C11.6389 0.507452 11.7394 0.523509 11.834 0.558555C11.9286 0.593601 12.0154 0.646947 12.0893 0.715545ZM15.9272 0.715545C16.0013 0.784058 16.0611 0.866492 16.1032 0.958135C16.1454 1.04978 16.1691 1.14883 16.1729 1.24963C16.1768 1.35043 16.1607 1.45101 16.1257 1.5456C16.0906 1.64019 16.0373 1.72694 15.9687 1.8009L9.05584 9.26408C8.91741 9.41351 8.72529 9.50182 8.52175 9.50959C8.31821 9.51737 8.11991 9.44396 7.97049 9.30553C7.82106 9.1671 7.73275 8.97498 7.72498 8.77144C7.7172 8.56789 7.79061 8.3696 7.92904 8.22017L14.8426 0.756995C14.981 0.607696 15.1729 0.519458 15.3763 0.511685C15.5797 0.503912 15.7779 0.577241 15.9272 0.715545Z';
    if (type == 'branch')
      retimg =
        'M10.3433 1.37549V19.7974M16.8564 4.07332L3.83015 17.0996M19.5542 10.5864H1.13232M16.8564 17.0996L3.83015 4.07332';
    if (type == 'cross')
      retimg =
        'M12.8696 0.949707L1.81641 12.0029M1.81641 0.949707L12.8696 12.0029';
    if (type == 'home')
      retimg =
        'M1.05322 9.31971C1.05322 8.79068 1.05322 8.52616 1.12141 8.28256C1.18181 8.06677 1.28107 7.86382 1.41432 7.68367C1.56474 7.48029 1.77354 7.31789 2.19114 6.99309L8.43829 2.13419C8.76189 1.8825 8.92369 1.75666 9.10236 1.70828C9.26 1.6656 9.42616 1.6656 9.58381 1.70828C9.76247 1.75666 9.92428 1.8825 10.2479 2.1342L16.495 6.99309C16.9126 7.31789 17.1214 7.48029 17.2719 7.68367C17.4051 7.86382 17.5044 8.06677 17.5648 8.28256C17.6329 8.52616 17.6329 8.79068 17.6329 9.31971V15.9838C17.6329 17.0155 17.6329 17.5314 17.4322 17.9254C17.2555 18.2721 16.9737 18.5539 16.6271 18.7305C16.233 18.9313 15.7172 18.9313 14.6854 18.9313H4.00073C2.969 18.9313 2.45314 18.9313 2.05908 18.7305C1.71245 18.5539 1.43063 18.2721 1.25401 17.9254C1.05322 17.5314 1.05322 17.0155 1.05322 15.9838V9.31971Z';
    if (type == 'info')
      retimg =
        'M7.66289 7.76847C7.87945 7.15287 8.30688 6.63378 8.86949 6.30313C9.43209 5.97248 10.0936 5.85161 10.7368 5.96194C11.3799 6.07226 11.9633 6.40665 12.3836 6.90589C12.8038 7.40513 13.0339 8.03699 13.0329 8.68957C13.0329 10.5318 10.2696 11.4529 10.2696 11.4529M10.3433 15.1372H10.3525M19.5542 10.5318C19.5542 15.6188 15.4304 19.7427 10.3433 19.7427C5.25621 19.7427 1.13232 15.6188 1.13232 10.5318C1.13232 5.44469 5.25621 1.3208 10.3433 1.3208C15.4304 1.3208 19.5542 5.44469 19.5542 10.5318Z';
    return retimg;
  };

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
    if (selected == 'comments' && ctrlPressed == true) {
      handleStageClick(e);
      return;
    }
    if (isDrag) return;
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
      selected === 'rectangle' ||
      selected === 'area' ||
      selected === 'curve' ||
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
        user,
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

      const lineDistance = calcLineDistance(
        [
          startingPoint?.x,
          startingPoint?.y,
          position?.x,
          position?.y,
        ] as number[],
        scale,
        true
      );
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
        category: selectedCategory ?? 'Length Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
        subcategory: selectedSubCategory,
        user,
        textColor: textColor,
        text: lineDistance?.toString(),
      };
      setDraw((prev: any) => ({
        ...prev,
        line: [...(prev?.line ? prev.line : []), newLine],
      }));

      updateDrawHistory(pageNumber.toString(), 'line', newLine);

      setCurrentLine(defaultCurrentLineState);
      handleChangeMeasurements(defaultMeasurements);
    }

    if (selected === 'rectangle' && currentLine.startingPoint) {
      const { startingPoint } = currentLine;

      const points = [
        startingPoint?.x,
        startingPoint?.y,
        //custom points to make rectangular
        position?.x,
        startingPoint?.y,
        //custom points to make rectangular
        position?.x,
        position?.y,
        //custom points to make rectangular
        //custom points to make rectangular
        startingPoint?.x,
        position?.y,
      ] as number[];
      const area = calculatePolygonArea(points, scale);
      const text = `${area?.toFixed(4) || ''}sq`;
      const areaConfig: PolygonConfigInterface = {
        points,
        stroke: color,
        strokeWidth: border,
        textUnit: unit,
        dateTime: moment().toDate(),
        projectName: 'Area Measurement',
        category: selectedCategory ?? 'Area Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
        subcategory: selectedSubCategory,
        user,
        textColor: textColor,
        fillColor: fillColor,
        text,
      };
      setDraw((prevDraw: any) => {
        return {
          ...prevDraw,
          area: [...(prevDraw?.area ? prevDraw.area : []), areaConfig],
        };
      });

      updateDrawHistory(pageNumber.toString(), 'area', areaConfig);

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

                const text = `${area?.toFixed(4) || ''}sq`;

                const areaConfig: PolygonConfigInterface = {
                  ...prev,
                  textUnit: unit,
                  dateTime: moment().toDate(),
                  projectName: 'Area Measurement',
                  category: selectedCategory ?? 'Area Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
                  subcategory: selectedSubCategory,
                  user,
                  textColor: textColor,
                  fillColor: fillColor,
                  text,
                };

                updateDrawHistory(pageNumber.toString(), 'area', areaConfig);

                return {
                  ...prevDraw,
                  area: [...(prevDraw?.area ? prevDraw.area : []), areaConfig],
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
                const text = `${volume?.toFixed(2) || ''} cubic`;

                const volumeConfig: PolygonConfigInterface = {
                  ...prev,
                  depth,
                  textUnit: unit,
                  dateTime: moment().toDate(),
                  projectName: 'Volume Measurement',
                  category: selectedCategory ?? 'Volume Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
                  subcategory: selectedSubCategory,
                  user,
                  textColor,
                  fillColor: fillColor,
                  text,
                };

                updateDrawHistory(
                  pageNumber.toString(),
                  'volume',
                  volumeConfig
                );

                return {
                  ...prevDraw,
                  volume: [
                    ...(prevDraw?.volume ? prevDraw.volume : []),
                    volumeConfig,
                  ],
                };
              }
            });

            return defaultPolyLineState;
          } else prev.points.push(...[position?.x || 0, position?.y || 0]);

          return { ...prev };
        }
      });
    }

    if (selected === 'curve') {
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

              const text = `${area?.toFixed(4) || ''}sq`;

              const areaConfig: PolygonConfigInterface = {
                ...prev,
                textUnit: unit,
                dateTime: moment().toDate(),
                projectName: 'Curve Measurement',
                category: selectedCategory ?? 'Curve Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
                subcategory: selectedSubCategory,
                user,
                textColor: textColor,
                fillColor: fillColor,
                text,
              };

              updateDrawHistory(pageNumber.toString(), 'area', areaConfig);

              return {
                ...prevDraw,
                curve: [
                  ...(prevDraw?.curve && Array.isArray(prevDraw?.curve)
                    ? prevDraw.curve
                    : []),
                  areaConfig,
                ],
              };
            });

            return defaultPolyLineState;
          } else prev.points.push(...[position?.x || 0, position?.y || 0]);

          return { ...prev };
        }
      });
    }

    if (selected === 'count' && position) {
      const newCount: CountInterface = {
        x: position?.x - 5,
        y: position.y - 10,
        textUnit: unit,
        textColor: textColor,
        dateTime: moment().toDate(),
        projectName: 'Count Measurement',
        category: selectedCategory ?? 'Count Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
        subcategory: selectedSubCategory,
        user,
        countType: countType ?? '',
      };

      setDraw((prev: any) => {
        handleChangeMeasurements({
          count: [...(prev?.count ? prev.count : []), newCount].length,
        });
        return {
          ...prev,
          count: [...(prev?.count ? prev.count : []), newCount],
        };
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

  // const {
  //   stageScale,
  //   stageX,
  //   stageY,
  //   handleWheel,
  //   handleZoomIn,
  //   handleZoomOut,
  // } = useWheelZoom({
  //   compHeight: uploadFileData.height || 600,
  //   compWidth: uploadFileData.width || 600,
  // });
  const stageParentRef = useRef<HTMLDivElement>(null);
  const parentWdith =
    stageParentRef.current?.getBoundingClientRect() &&
    stageParentRef.current?.getBoundingClientRect()?.width
      ? stageParentRef.current?.getBoundingClientRect()?.width
      : null;
  const parentHeight =
    stageParentRef.current?.getBoundingClientRect() &&
    stageParentRef.current?.getBoundingClientRect()?.height
      ? stageParentRef.current?.getBoundingClientRect()?.height
      : null;
  console.log(parentWdith, parentHeight, ' width and height of parent');
  const [ctrlPressed, setCtrlPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey) {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (event: any) => {
      if (!event.ctrlKey) {
        setCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const [texts, setTexts] = useState<Array<any>>([]);
  // const stageRef = useRef<Konva.Stage>(null);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // if (e.target === e.target.getStage()) {
    // const { clientX, clientY } = e.evt;
    const stage = e.target.getStage();
    if (stage) {
      const mousePos = getRelativePointerPosition(stage);
      if (mousePos) {
        const newText = {
          id: `text_${texts.length + 1}`,
          x: mousePos.x,
          y: mousePos.y,
          initialText: 'New Text',
          fontSize: 20,
          textColor,
          textUnit: unit,
          category: selectedCategory ?? 'Text Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
          subcategory: selectedSubCategory,
          user,
          dateTime: moment().toDate(),
          projectName: 'Text Measurement',
        };
        setTexts([...texts, newText]);
        setDraw((ps: any) => ({
          ...ps,
          texts:
            ps?.texts && Array.isArray(ps?.texts)
              ? [...ps.texts, newText]
              : [newText],
        }));
      }
    }
    // }
  };
  const handleDelete = (text: any) => {
    // alert(`${text?.id}`)
    if (text?.id) {
      const tx = texts.filter((i: any) => i?.id != text?.id);
      const tx1 = draw.texts.filter((i: any) => i?.id != text?.id);
      setTexts(tx);
      setDraw((ps: any) => ({ ...ps, texts: tx1 }));
    }
  };

  const handleTextChange = (id: string, newTextProps: any) => {
    // alert(JSON.stringify(newTextProps))
    setTexts(
      texts.map((text) =>
        text.id === id ? { ...text, ...newTextProps } : text
      )
    );
    setDraw((ps: any) => ({
      ...ps,
      texts: ps?.texts.map((text: any) =>
        text.id === id ? { ...text, ...newTextProps } : text
      ),
    }));
  };

  useEffect(() => {
    console.log(texts, draw, ' ===> texts of local change');
    // setDraw((ps:any)=>({...ps,texts}))
  }, [texts, draw]);
  // const [dragposition, setdragposition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  return (
    <div
      ref={stageParentRef}
      id="sage-parent"
      className={`outline-none relative bg-grey-900 my-3 overflow-auto !w-full !h-full`}
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
                ...(prevDraw?.dynamic ? prevDraw.dynamic : []),
                {
                  ...dynamicPolyLine,
                  strokeWidth: 10,
                  stroke: color,
                  lineCap: 'round',
                  id: `dynamic-${(draw?.dynamic?.length ?? 0) + 1}`,
                  projectName: 'Dynamic Measurement',
                  category: selectedCategory ?? 'Dynamic Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
                  subcategory: selectedSubCategory,
                  user,
                  textColor,
                },
              ],
            }));
            updateDrawHistory(pageNumber.toString(), 'dynamic', {
              ...dynamicPolyLine,
              strokeWidth: 10,
              stroke: color,
              lineCap: 'round',
              id: `dynamic-${(draw?.dynamic?.length ?? 0) + 1}`,
              projectName: 'Dynamic Measurement',
              category: selectedCategory ?? 'Dynamic Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
              subcategory: selectedSubCategory,
            });
          } else if (selected == 'perimeter') {
            const lineDistance =
              dynamicPolyLine?.points?.length > 4
                ? calculatePolygonPerimeter(dynamicPolyLine?.points, scale)
                : calcLineDistance(dynamicPolyLine?.points, scale, true);
            setDraw((prevDraw: any) => ({
              ...prevDraw,
              perimeter: [
                ...(prevDraw?.perimeter ? prevDraw.perimeter : []),
                {
                  ...dynamicPolyLine,
                  // strokeWidth: 10,
                  stroke: color,
                  lineCap: 'round',
                  id: `perimeter-${(draw?.perimeter?.length ?? 0) + 1}`,
                  projectName: 'Perimeter Measurement',
                  category: selectedCategory ?? 'Perimeter Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
                  subcategory: selectedSubCategory,
                  user,
                  textColor,
                  text: lineDistance.toString(),
                },
              ],
            }));
            updateDrawHistory(pageNumber.toString(), 'perimeter', {
              ...dynamicPolyLine,
              // strokeWidth: 10,
              stroke: color,
              lineCap: 'round',
              id: `perimeter-${(draw?.perimeter?.length ?? 0) + 1}`,
              projectName: 'Perimeter Measurement',
              category: selectedCategory ?? 'Perimeter Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
              subcategory: selectedSubCategory,
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
      <div className=" flex justify-center space-x-4 absolute bottom-0 left-[48%] z-50 ">
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
      {/* Image Loading */}
      {imgLoading && (
        <div className="rounded-t-2xl absolute top-0 left-0 w-[100%] h-[100%] bg-slate-200 flex justify-center items-center bg-opacity-30 z-40">
          <Spin size="large" />
        </div>
      )}
      <Stage
        // width={parentWdith || uploadFileData.width || 600}
        // height={parentHeight || uploadFileData.height || 600}
        width={parentWdith ?? 600}
        height={parentHeight ?? 600}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        draggable={isDrag}
        // draggable
        // onDragStart={()=>{
        //   setCurrentLine(defaultCurrentLineState);
        //   setCompletingLine(defaultCurrentLineState);
        //   setPolyLine(defaultPolyLineState);
        //   setDynamicPolyLine(defaultPolyLineState);
        //   handleChangeMeasurements(defaultMeasurements);
        // }}
        // ref={stageRef}
        className={`flex justify-center cursor-pointer bg-gray-200 ${['area', 'volume', 'dynamic', 'length', 'perimeter'].includes(selected) ? '!cursor-crosshair' : ''}`}
      >
        <Layer
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          imageSmoothingEnabled={true}
        >
          <KonvaImage
            image={myImage}
            width={uploadFileData.width || myImage.width || 600}
            height={uploadFileData.height || myImage.height || 600}
          />

          {/* <EditableCurvedShape /> */}

          {/* Scale Drawing Line */}
          {draw?.scale &&
            Array.isArray(draw?.scale) &&
            draw?.scale?.map(({ textUnit, ...rest }: any, index: number) => {
              const id = `line-${index}`;
              // const lineDistance = calcLineDistance(rest.points, scale, true);
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
                    text={''}
                    // text={lineDistance.toString()}
                    fill="red"
                  />
                </Group>
              );
            })}
          {/* texts writings */}
          {/* {texts.map((text: any) => ( */}
          {draw?.texts &&
            Array.isArray(draw?.texts) &&
            draw?.texts?.length > 0 &&
            draw.texts.map((text: any) => (
              <EditableText
                key={text.id}
                id={text.id}
                x={text.x}
                y={text.y}
                initialText={text.text ?? text.initialText}
                fontSize={text.fontSize}
                rotation={text.rotation}
                onChange={(newTextProps) =>
                  handleTextChange(text.id, newTextProps)
                }
                textColor={textColor}
                handleDelete={handleDelete}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                ctrlPressed={ctrlPressed}
              />
            ))}

          {/* Drawing Line */}
          {draw?.line?.map(({ textUnit, ...rest }: any, index: number) => {
            const id = `line-${index}`;
            const lineDistance =
              scaleUnits == 'feet'
                ? calcLineDistance(rest?.points, scale, true)
                : `${Number(Number(calcLineDistance(rest?.points, scale, false)) * 0.0254).toFixed(3)} meter`;
            // const distanceInInches = calcLineDistance(rest?.points, scale, false)
            const lineMidPoint = calculateMidpoint(rest?.points);

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
                  stroke={selectedShape === id ? 'maroon' : rest?.stroke}
                  pointerAtEnding={true}
                  pointerAtBeginning={true}
                  draggable
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
                    const originalPoints =
                      draw?.line[shapeNumber]?.points.slice(); // Copy the original points

                    // Get the initial position from the drag start event
                    const initialPos = node._initialPos || { x: 0, y: 0 };

                    // Calculate the total translation (dx, dy)
                    const dx = node.x() - initialPos.x;
                    const dy = node.y() - initialPos.y;

                    // Update all points based on the total translation distance
                    const newPoints: any[] = [];
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints.push(
                        originalPoints[i] + dx,
                        originalPoints[i + 1] + dy
                      );
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
                      line: draw.line.map((line: any, index: number) =>
                        index === +shapeNumber
                          ? { ...line, points: newPoints }
                          : line
                      ),
                    };

                    // Set the updated draw object to state
                    setDraw(updatedDraw);

                    // Save the current position as the last known position
                    node._lastPos = { x: node.x(), y: node.y() };
                  }}
                />
                <KonvaText
                  {...lineMidPoint}
                  fontSize={textUnit}
                  text={lineDistance.toString()}
                  fill={rest?.textColor ?? 'red'}
                />
              </Group>
            );
          })}

          {/* Drawing Dynamic Fill */}
          {draw?.dynamic?.map(({ ...rest }: any, index: number) => {
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
                  lineCap={selectedShape === id ? 'square' : rest?.lineCap}
                  stroke={selectedShape === id ? 'maroon' : rest?.stroke}
                  draggable={true}
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
                    const originalPoints =
                      draw?.dynamic[shapeNumber]?.points.slice(); // Copy the original points

                    // Get the initial position from the drag start event
                    const initialPos = node._initialPos || { x: 0, y: 0 };

                    // Calculate the total translation (dx, dy)
                    const dx = node.x() - initialPos.x;
                    const dy = node.y() - initialPos.y;

                    // Update all points based on the total translation distance
                    const newPoints: any[] = [];
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints.push(
                        originalPoints[i] + dx,
                        originalPoints[i + 1] + dy
                      );
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
                      dynamic: draw.dynamic.map((line: any, index: number) =>
                        index === +shapeNumber
                          ? { ...line, points: newPoints }
                          : line
                      ),
                    };

                    // Set the updated draw object to state
                    setDraw(updatedDraw);

                    // Save the current position as the last known position
                    node._lastPos = { x: node.x(), y: node.y() };
                  }}
                />
              </Group>
            );
          })}
          {/* Drawing Perimeter Fill */}
          {draw?.perimeter?.map(({ ...rest }: any, index: number) => {
            const id = `perimeter-${index}`;

            // const lineDistance = calcPerimeterDistance(rest.points, scale, true);
            // const lineMidPoint = calculateMidpoint(rest.points);
            const lineDistance =
              rest?.points?.length > 4
                ? calculatePolygonPerimeter(rest?.points, scale)
                : calcLineDistance(rest?.points, scale, true);
            const lineMidPoint =
              rest?.points?.length > 4
                ? calculatePolygonCenter(rest?.points)
                : calculateMidpoint(rest?.points);

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
                  draggable={true}
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
                    const originalPoints =
                      draw?.perimeter[shapeNumber]?.points.slice(); // Copy the original points

                    // Get the initial position from the drag start event
                    const initialPos = node._initialPos || { x: 0, y: 0 };

                    // Calculate the total translation (dx, dy)
                    const dx = node.x() - initialPos.x;
                    const dy = node.y() - initialPos.y;

                    // Update all points based on the total translation distance
                    const newPoints: any[] = [];
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints.push(
                        originalPoints[i] + dx,
                        originalPoints[i + 1] + dy
                      );
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
                      perimeter: draw.perimeter.map(
                        (line: any, index: number) =>
                          index === +shapeNumber
                            ? { ...line, points: newPoints }
                            : line
                      ),
                    };

                    // Set the updated draw object to state
                    setDraw(updatedDraw);

                    // Save the current position as the last known position
                    node._lastPos = { x: node.x(), y: node.y() };
                  }}
                />
                <KonvaText
                  {...lineMidPoint}
                  fontSize={rest?.textUnit}
                  text={lineDistance.toString()}
                  fill={rest?.textColor ?? 'red'}
                />
              </Group>
            );
          })}
          {!!dynamicPolyLine.points.length && <Line {...dynamicPolyLine} />}

          {/* Drawing Curve */}
          {draw?.curve?.map((cur: any, index: number) => {
            const { textUnit, ...rest } = cur;
            console.log(textUnit);
            const polygonCoordinates = rest.points;
            // const center = calculatePolygonCenter(polygonCoordinates);
            const area = calculatePolygonArea(polygonCoordinates, scale);
            console.log(area);

            // const text = scaleUnits == 'feet' ? `${area?.toFixed(4) || ''}SF` : `${Number(area * 0.092903).toFixed(3)}SM`;
            const id = `curve-${index}`;

            return (
              <Group
                id={id}
                key={id}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  setSelectedShape(e.currentTarget.attrs?.id || '');
                }}
              >
                <EditableCurvedShape
                  scale={scale}
                  cur={cur}
                  draw={draw}
                  setDraw={setDraw}
                  id={id}
                  scaleUnits={scaleUnits}
                  selectedShape={selectedShape}
                  setSelectedShape={setSelectedShape}
                  key={id}
                />
                {/* <Line
                  {...rest}
                  id={id}
                  closed={true}
                  dash={selectedShape === id ? [10, 10] : []}
                  stroke={selectedShape === id ? 'maroon' : rest?.stroke}
                  onMouseDown={(e) => {
                    e.cancelBubble = true;
                    setSelectedShape(e.currentTarget.attrs?.id || '');
                  }}
                  fill={rest?.fillColor ?? "rgba(255, 0, 0, 0.2)"}
                  draggable={true}
                  onDragStart={(e) => {
                    //Local variable storage
                    const node = e.target;
                    // Store the initial position
                    node._initialPos = {
                      x: node.x(),
                      y: node.y()
                    };
                  }}
                  onDragEnd={(e) => {
                    const [shapeName, shapeNumber] = id.split('-');
                    const node = e.target;
                    const originalPoints = draw?.curve[shapeNumber]?.points.slice(); // Copy the original points

                    // Get the initial position from the drag start event
                    const initialPos = node._initialPos || { x: 0, y: 0 };

                    // Calculate the total translation (dx, dy)
                    const dx = node.x() - initialPos.x;
                    const dy = node.y() - initialPos.y;

                    // Update all points based on the total translation distance
                    const newPoints = [];
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints.push(originalPoints[i] + dx, originalPoints[i + 1] + dy);
                    }

                    // Log for debugging purposes
                    console.log(originalPoints, newPoints, dx, dy, " ===> original and new points are here");

                    // Reset the node position to the initial position
                    node.position(initialPos);

                    // Update the draw object
                    const updatedDraw = {
                      ...draw,
                      curve: draw.curve.map((line, index) =>
                        index === +shapeNumber ? { ...line, points: newPoints } : line
                      ),
                    };

                    // Set the updated draw object to state
                    setDraw(updatedDraw);

                    // Save the current position as the last known position
                    node._lastPos = { x: node.x(), y: node.y() };
                  }}
                />
                <KonvaText
                  {...center}
                  fontSize={textUnit}
                  text={text}
                  offsetX={30}
                  fill={rest?.textColor ?? "red"}
                /> */}
              </Group>
            );
          })}

          {/* Drawing Area */}
          {draw?.area?.map(({ textUnit, ...rest }: any, index: number) => {
            const polygonCoordinates = rest.points;
            const center = calculatePolygonCenter(polygonCoordinates);
            const area = calculatePolygonArea(polygonCoordinates, scale);

            const text =
              scaleUnits == 'feet'
                ? `${area?.toFixed(4) || ''}SF`
                : `${Number(area * 0.092903).toFixed(3)}m²`;
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
                  stroke={selectedShape === id ? 'maroon' : rest?.stroke}
                  onMouseDown={(e) => {
                    e.cancelBubble = true;
                    setSelectedShape(e.currentTarget.attrs?.id || '');
                  }}
                  fill={rest?.fillColor ?? 'rgba(255, 0, 0, 0.2)'}
                  draggable={true}
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
                    const originalPoints =
                      draw?.area[shapeNumber]?.points.slice(); // Copy the original points

                    // Get the initial position from the drag start event
                    const initialPos = node._initialPos || { x: 0, y: 0 };

                    // Calculate the total translation (dx, dy)
                    const dx = node.x() - initialPos.x;
                    const dy = node.y() - initialPos.y;

                    // Update all points based on the total translation distance
                    const newPoints: any[] = [];
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints.push(
                        originalPoints[i] + dx,
                        originalPoints[i + 1] + dy
                      );
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
                      area: draw.area.map((line: any, index: number) =>
                        index === +shapeNumber
                          ? { ...line, points: newPoints }
                          : line
                      ),
                    };

                    // Set the updated draw object to state
                    setDraw(updatedDraw);

                    // Save the current position as the last known position
                    node._lastPos = { x: node.x(), y: node.y() };
                  }}
                />
                <KonvaText
                  {...center}
                  fontSize={textUnit}
                  text={text}
                  offsetX={30}
                  fill={rest?.textColor ?? 'red'}
                />
              </Group>
            );
          })}

          {!!polyLine.points.length && <Line {...polyLine} />}

          {/* Drawing Volume */}
          {draw?.volume?.map(
            ({ depth, textUnit, ...rest }: any, index: number) => {
              const polygonCoordinates = rest?.points;
              const center = calculatePolygonCenter(polygonCoordinates);
              const volume = calculatePolygonVolume(
                polygonCoordinates,
                depth || 1,
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
                    stroke={selectedShape === id ? 'maroon' : rest?.stroke}
                    onMouseDown={(e) => {
                      e.cancelBubble = true;
                      setSelectedShape(e.currentTarget.attrs?.id || '');
                    }}
                    fill={rest?.fillColor ?? 'rgba(255, 255, 0, 0.2)'}
                    draggable={true}
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
                      const originalPoints =
                        draw?.volume[shapeNumber]?.points.slice(); // Copy the original points

                      // Get the initial position from the drag start event
                      const initialPos = node._initialPos || { x: 0, y: 0 };

                      // Calculate the total translation (dx, dy)
                      const dx = node.x() - initialPos.x;
                      const dy = node.y() - initialPos.y;

                      // Update all points based on the total translation distance
                      const newPoints: any[] = [];
                      for (let i = 0; i < originalPoints.length; i += 2) {
                        newPoints.push(
                          originalPoints[i] + dx,
                          originalPoints[i + 1] + dy
                        );
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
                        volume: draw.volume.map((line: any, index: number) =>
                          index === +shapeNumber
                            ? { ...line, points: newPoints }
                            : line
                        ),
                      };

                      // Set the updated draw object to state
                      setDraw(updatedDraw);

                      // Save the current position as the last known position
                      node._lastPos = { x: node.x(), y: node.y() };
                    }}
                  />
                  <KonvaText
                    {...center}
                    fontSize={textUnit}
                    text={text}
                    offsetX={30}
                    fill={rest?.textColor ?? 'red'}
                  />
                </Group>
              );
            }
          )}

          {/* Runtime rectangle drawing */}
          {currentLine.startingPoint &&
            currentLine.endingPoint &&
            selected == 'rectangle' && (
              <Line
                points={[
                  currentLine.startingPoint.x,
                  currentLine.startingPoint.y,

                  currentLine.endingPoint.x,
                  currentLine.startingPoint.y,

                  currentLine.endingPoint.x,
                  currentLine.endingPoint.y,

                  currentLine.startingPoint.x,
                  currentLine.endingPoint.y,

                  currentLine.startingPoint.x,
                  currentLine.startingPoint.y,
                ]}
                stroke={color}
                strokeWidth={border}
              />
            )}
          {/* line rectangle drawing */}
          {currentLine.startingPoint &&
            currentLine.endingPoint &&
            selected !== 'count' &&
            selected !== 'rectangle' &&
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
          {draw?.count?.map(({ ...rest }, index: number) => {
            const id = `count-${index}`;

            return (
              // <KonvaImage
              //   id={`count-${index}`}
              //   key={`count-${index}`}
              //   image={getCounterImage(rest?.countType ?? 'tick')}
              //   // image={counterImage}
              //   fill={selectedShape === id ? 'gray' : ''}
              //   width={20}
              //   height={20}
              //   {...rest}
              //   onMouseDown={(e) => {
              //     e.cancelBubble = true;
              //     setSelectedShape(e.currentTarget.attrs?.id || '');
              //   }}
              // />
              <Path
                id={`count-${index}`}
                key={`count-${index}`}
                // image={getCounterImage(rest?.countType ?? 'tick')}
                // image={counterImage}
                data={getCounterImagePath(rest?.countType ?? 'tick')}
                stroke={
                  selectedShape === id ? 'gray' : rest?.textColor ?? 'red'
                }
                // fill={selectedShape === id ? 'gray' : (rest?.textColor ?? 'red')}
                // width={20}
                // height={20}
                scaleX={rest?.textUnit / 12 || 1}
                scaleY={rest?.textUnit / 12 || 1}
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
