'use client';
import Button from '@/app/component/customButton/button';
// import Image from 'next/image';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { dataInterface } from '@/app/component/captureComponent';
import { useDraw } from '@/app/hooks';
import { Stage, Layer } from 'react-konva';
import ReportCard from '@/app/component/reportCard';
import { Spin } from 'antd';
import generatePDF from '@/app/component/captureComponent/generatePdf';
import { ScaleData } from '../../scale/page';
import { toast } from 'react-toastify';

// const groupByType = (items: dataInterface[]): dataInterface[][] => {
//   console.log(items, ' ===> Data interface');

//   const grouped = items.reduce(
//     (acc, item) => {
//       // Initialize the array for this type if it doesn't already exist
//       if (!acc[item.details.projectName]) {
//         acc[item.details.projectName] = [];
//       }
//       // Push the current item into the appropriate group
//       acc[item.details.projectName].push(item);
//       return acc;
//     },
//     {} as Record<string, dataInterface[]>
//   );

//   // Extract and return just the array of groups
//   return Object.values(grouped);
// };

interface ControlPoint {
  x: number;
  y: number;
  index: number;
  offsetX: number;
  offsetY: number;
}

// const getCounterImagePath = (type: string) => {
//   let retimg =
//     'M12.0893 0.715545C12.1634 0.784058 12.2232 0.866492 12.2653 0.958135C12.3075 1.04978 12.3312 1.14883 12.335 1.24963C12.3389 1.35043 12.3228 1.45101 12.2878 1.5456C12.2527 1.64019 12.1994 1.72694 12.1308 1.8009L5.21718 9.26408C5.08555 9.40838 4.92527 9.52365 4.74658 9.60251C4.5679 9.68138 4.37473 9.72211 4.17941 9.72211C3.98409 9.72211 3.79092 9.68138 3.61223 9.60251C3.43355 9.52365 3.27327 9.40838 3.14164 9.26408L0.257843 6.15155C0.119412 6.00212 0.0460094 5.80383 0.0537827 5.60028C0.061556 5.39674 0.149868 5.20462 0.299292 5.06619C0.448716 4.92776 0.647012 4.85435 0.850556 4.86213C1.0541 4.8699 1.24622 4.95821 1.38465 5.10764L4.04425 7.9798C4.11716 8.05854 4.24166 8.05854 4.31458 7.97981L11.004 0.756995C11.0725 0.682956 11.1549 0.623147 11.2466 0.580989C11.3382 0.538831 11.4372 0.515151 11.538 0.511301C11.6389 0.507452 11.7394 0.523509 11.834 0.558555C11.9286 0.593601 12.0154 0.646947 12.0893 0.715545ZM15.9272 0.715545C16.0013 0.784058 16.0611 0.866492 16.1032 0.958135C16.1454 1.04978 16.1691 1.14883 16.1729 1.24963C16.1768 1.35043 16.1607 1.45101 16.1257 1.5456C16.0906 1.64019 16.0373 1.72694 15.9687 1.8009L9.05584 9.26408C8.91741 9.41351 8.72529 9.50182 8.52175 9.50959C8.31821 9.51737 8.11991 9.44396 7.97049 9.30553C7.82106 9.1671 7.73275 8.97498 7.72498 8.77144C7.7172 8.56789 7.79061 8.3696 7.92904 8.22017L14.8426 0.756995C14.981 0.607696 15.1729 0.519458 15.3763 0.511685C15.5797 0.503912 15.7779 0.577241 15.9272 0.715545Z';
//   if (type == 'tick')
//     retimg =
//       'M12.0893 0.715545C12.1634 0.784058 12.2232 0.866492 12.2653 0.958135C12.3075 1.04978 12.3312 1.14883 12.335 1.24963C12.3389 1.35043 12.3228 1.45101 12.2878 1.5456C12.2527 1.64019 12.1994 1.72694 12.1308 1.8009L5.21718 9.26408C5.08555 9.40838 4.92527 9.52365 4.74658 9.60251C4.5679 9.68138 4.37473 9.72211 4.17941 9.72211C3.98409 9.72211 3.79092 9.68138 3.61223 9.60251C3.43355 9.52365 3.27327 9.40838 3.14164 9.26408L0.257843 6.15155C0.119412 6.00212 0.0460094 5.80383 0.0537827 5.60028C0.061556 5.39674 0.149868 5.20462 0.299292 5.06619C0.448716 4.92776 0.647012 4.85435 0.850556 4.86213C1.0541 4.8699 1.24622 4.95821 1.38465 5.10764L4.04425 7.9798C4.11716 8.05854 4.24166 8.05854 4.31458 7.97981L11.004 0.756995C11.0725 0.682956 11.1549 0.623147 11.2466 0.580989C11.3382 0.538831 11.4372 0.515151 11.538 0.511301C11.6389 0.507452 11.7394 0.523509 11.834 0.558555C11.9286 0.593601 12.0154 0.646947 12.0893 0.715545ZM15.9272 0.715545C16.0013 0.784058 16.0611 0.866492 16.1032 0.958135C16.1454 1.04978 16.1691 1.14883 16.1729 1.24963C16.1768 1.35043 16.1607 1.45101 16.1257 1.5456C16.0906 1.64019 16.0373 1.72694 15.9687 1.8009L9.05584 9.26408C8.91741 9.41351 8.72529 9.50182 8.52175 9.50959C8.31821 9.51737 8.11991 9.44396 7.97049 9.30553C7.82106 9.1671 7.73275 8.97498 7.72498 8.77144C7.7172 8.56789 7.79061 8.3696 7.92904 8.22017L14.8426 0.756995C14.981 0.607696 15.1729 0.519458 15.3763 0.511685C15.5797 0.503912 15.7779 0.577241 15.9272 0.715545Z';
//   if (type == 'branch')
//     retimg =
//       'M10.3433 1.37549V19.7974M16.8564 4.07332L3.83015 17.0996M19.5542 10.5864H1.13232M16.8564 17.0996L3.83015 4.07332';
//   if (type == 'cross')
//     retimg =
//       'M12.8696 0.949707L1.81641 12.0029M1.81641 0.949707L12.8696 12.0029';
//   if (type == 'home')
//     retimg =
//       'M1.05322 9.31971C1.05322 8.79068 1.05322 8.52616 1.12141 8.28256C1.18181 8.06677 1.28107 7.86382 1.41432 7.68367C1.56474 7.48029 1.77354 7.31789 2.19114 6.99309L8.43829 2.13419C8.76189 1.8825 8.92369 1.75666 9.10236 1.70828C9.26 1.6656 9.42616 1.6656 9.58381 1.70828C9.76247 1.75666 9.92428 1.8825 10.2479 2.1342L16.495 6.99309C16.9126 7.31789 17.1214 7.48029 17.2719 7.68367C17.4051 7.86382 17.5044 8.06677 17.5648 8.28256C17.6329 8.52616 17.6329 8.79068 17.6329 9.31971V15.9838C17.6329 17.0155 17.6329 17.5314 17.4322 17.9254C17.2555 18.2721 16.9737 18.5539 16.6271 18.7305C16.233 18.9313 15.7172 18.9313 14.6854 18.9313H4.00073C2.969 18.9313 2.45314 18.9313 2.05908 18.7305C1.71245 18.5539 1.43063 18.2721 1.25401 17.9254C1.05322 17.5314 1.05322 17.0155 1.05322 15.9838V9.31971Z';
//   if (type == 'info')
//     retimg =
//       'M7.66289 7.76847C7.87945 7.15287 8.30688 6.63378 8.86949 6.30313C9.43209 5.97248 10.0936 5.85161 10.7368 5.96194C11.3799 6.07226 11.9633 6.40665 12.3836 6.90589C12.8038 7.40513 13.0339 8.03699 13.0329 8.68957C13.0329 10.5318 10.2696 11.4529 10.2696 11.4529M10.3433 15.1372H10.3525M19.5542 10.5318C19.5542 15.6188 15.4304 19.7427 10.3433 19.7427C5.25621 19.7427 1.13232 15.6188 1.13232 10.5318C1.13232 5.44469 5.25621 1.3208 10.3433 1.3208C15.4304 1.3208 19.5542 5.44469 19.5542 10.5318Z';
//   return retimg;
// };

const groupByCategory = (items: dataInterface[]): dataInterface[][] => {
  console.log(items, ' ===> Data interface');

  const grouped = items.reduce(
    (acc, item) => {
      // Initialize the array for this type if it doesn't already exist
      if (!acc[item.details.category]) {
        acc[item.details.category] = [];
      }
      // Push the current item into the appropriate group
      acc[item.details.category].push(item);
      return acc;
    },
    {} as Record<string, dataInterface[]>
  );

  // Extract and return just the array of groups
  return Object.values(grouped);
};

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  takeOff?: any;
  modalOpen?: any;
  takeOffMsr?: any[];
}

const ReportModal = ({ setModalOpen, takeOff, takeOffMsr }: Props) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [data, setData] = useState<dataInterface[]>([]);
  const [reportData, setreportData] = useState<any>([]);
  const [uploadFileData, setuploadFileData] = useState<any>([]);
  const {
    calculateMidpoint,
    calculatePolygonCenter,
    calcLineDistance,
    calculatePolygonArea,
    calculatePolygonPerimeter,
    calculatePolygonVolume,
  } = useDraw();
  // const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(true);

  //@ts-ignore
  const counterImage = new Image();
  counterImage.src = '/count-draw.png';

  console.log(takeOff, ' ====> Take offs');
  const getPageData = () => {
    let reportData1: any = [];
    // if (
    //   takeOff?.measurements &&
    //   Object.keys(takeOff?.measurements) &&
    //   Object.keys(takeOff?.measurements)?.length > 0
    // ) {
    //   Object.keys(takeOff?.measurements)?.map((key: any) => {
    //     if (
    //       takeOff?.measurements[key] &&
    //       Object.keys(takeOff?.measurements[key]) &&
    //       Object.keys(takeOff?.measurements[key])?.length > 0
    //     ) {
    //       Object.keys(takeOff?.measurements[key])?.map((type: any) => {
    //         reportData1 = [
    //           ...reportData1,
    //           ...(takeOff?.measurements[key][type] &&
    //           Array.isArray(takeOff?.measurements[key][type]) &&
    //           takeOff?.measurements[key][type]?.length > 0
    //             ? takeOff.measurements[key][type].map((arrit: any) => {
    //                 return {
    //                   ...arrit,
    //                   pageId: key,
    //                   type,
    //                   pageData: takeOff?.pages?.find(
    //                     (pg: any) => pg?.pageId == key
    //                   ),
    //                   pageLabel: takeOff?.pages?.find(
    //                     (pg: any) => pg?.pageId == key
    //                   )?.pageNum,
    //                   color: arrit?.stroke,
    //                   config: arrit,
    //                 };
    //               })
    //             : []),
    //         ];
    //       });
    //     }
    //   });
    // }
    if (takeOffMsr && takeOffMsr?.length > 0) {
      takeOffMsr
        ?.filter((i) => i?.type != 'texts')
        ?.forEach((i) => {
          reportData1 = [
            ...reportData1,
            {
              ...i,
              pageData: takeOff?.pages?.find(
                (pg: any) => pg?.pageId == i?.pageId
              ),
              pageLabel: takeOff?.pages?.find(
                (pg: any) => pg?.pageId == i?.pageId
              )?.pageNum,
              color: i?.stroke,
              config: i,
            },
          ];
        });
    }
    console.log(reportData1, ' ===> Take offs reportData1');
    return reportData1;
  };
  // getPageData()
  useEffect(() => {
    setreportData(getPageData() ?? []);
    setuploadFileData(takeOff?.pages ?? []);
  }, [takeOff, takeOffMsr]);
  const [perText, setperText] = useState<string>('');

  //Oldest
  // useEffect(() => {
  //   console.log(reportData, uploadFileData, " ===> loading of capture ")
  //   if (Array.isArray(reportData) && reportData?.length > 0 && Array.isArray(uploadFileData) && uploadFileData?.length > 0) {
  //     setloading(true)
  //     setData(reportData.map((i)=>({image:'/overview.png',details:{...i}})))
  //     console.log(uploadFileData, reportData, " ===> Data of pages and reports")
  //     const loadImage = (src: string) => {
  //       return new Promise<HTMLImageElement>((resolve, reject) => {
  //         //@ts-ignore
  //         const img = new Image();
  //         img.crossOrigin = 'anonymous';
  //         img.src = `${src}?cacheBust=${new Date().getTime()}`;
  //         img.onload = () => resolve(img);
  //         img.onerror = (e: any) => { console.log(e, " ==> Page image loading of capture"); reject(e) };
  //       });
  //     };

  //     const captureShape = async (
  //       shape: any,
  //       background: HTMLImageElement,
  //       shapeType: string
  //     ) => {
  //       // Create a temporary container for off-screen stage
  //       const container = document.createElement('div');
  //       container.style.display = 'none'; // Hide the container
  //       document.body.appendChild(container); // This is required for Konva.Stage initialization

  //       return new Promise<string>((resolve) => {
  //         // Initialize a temporary stage with the container
  //         const tempStage = new Konva.Stage({
  //           container: container,
  //           width: background.width,
  //           height: background.height,
  //         });

  //         const layer = new Konva.Layer();
  //         tempStage.add(layer);

  //         // Add the background image to the layer
  //         const bgImage = new Konva.Image({
  //           image: background,
  //           width: background.width,
  //           height: background.height,
  //         });
  //         layer.add(bgImage);

  //         let minX: number, minY: number, maxX: number, maxY: number;

  //         // Initialize variables to ensure they cover the shape with margins later
  //         minX = minY = Number.MAX_SAFE_INTEGER;
  //         maxX = maxY = 0;

  //         // Determine the type of shape and render accordingly
  //         switch (shapeType) {
  //           case 'count': {
  //             // Example for a circle shape
  //             const { x, y, radius = 20 } = shape;
  //             const circle = new Konva.Image({
  //               image: counterImage,
  //               width: 20,
  //               height: 20,
  //               x,
  //               y,
  //               radius,
  //             });
  //             layer.add(circle);

  //             // Adjust bounds for the circle, considering the radius and a margin
  //             minX = x - radius - 20;
  //             minY = y - radius - 20;
  //             maxX = x + radius + 20;
  //             maxY = y + radius + 20;
  //             break;
  //           }

  //           case 'line':
  //           case 'perimeter':
  //           case 'dynamic':
  //           case 'area':
  //           case 'volume':
  //             {
  //               // Example for a line or polygon shape
  //               const { points, stroke, strokeWidth, lineCap } = shape;
  //               const line = new Konva.Line({
  //                 points,
  //                 stroke,
  //                 strokeWidth,
  //                 lineCap,
  //                 closed: shapeType === 'area' || shapeType === 'volume', // Close path for areas and volumes
  //                 fill: shape?.fillColor
  //               });
  //               layer.add(line);
  //               console.warn(shape, 'sssss');
  //               let xText = 0,
  //                 yText = 0;
  //               if (
  //                 shapeType === 'area' ||
  //                 shapeType === 'volume' ||
  //                 shapeType === 'dynamic'
  //               ) {
  //                 const { x, y } = calculatePolygonCenter(points);
  //                 xText = x - 20;
  //                 yText = y - 20;
  //               } else {
  //                 const { x, y } = calculateMidpoint(points);
  //                 xText = x - 20;
  //                 yText = y - 20;
  //               }

  //               // Calculate bounds for lines and polygons, include margin
  //               const xs = points.filter((_: any, i: number) => i % 2 === 0);
  //               const ys = points.filter((_: any, i: number) => i % 2 !== 0);
  //               minX = Math.min(...xs) - 20;
  //               minY = Math.min(...ys) - 20;
  //               maxX = Math.max(...xs) + 20;
  //               maxY = Math.max(...ys) + 20;
  //               const textSize = ((maxX - minX) * (maxY - minY)) / 100000;

  //               console.warn(textSize);
  //               const text = new Konva.Text({
  //                 x: xText,
  //                 y: yText,
  //                 text: shape.text,
  //                 fontSize: Math.floor(textSize) * 10 + 25,
  //                 fontFamily: 'Calibri',
  //                 fill: shape?.textColor ?? 'red',
  //               });
  //               layer.add(text);
  //             }
  //             break;

  //           default:
  //             console.error('Unknown shape type:', shapeType);
  //             return;
  //         }

  //         layer.draw(); // Force drawing the layer to render shapes

  //         // Use toImage to capture the specified region
  //         tempStage.toImage({
  //           x: minX,
  //           y: minY,
  //           width: maxX - minX,
  //           height: maxY - minY,
  //           callback: (img) => {
  //             // Create a canvas to get the cropped image data
  //             const canvas = document.createElement('canvas');
  //             canvas.width = maxX - minX;
  //             canvas.height = maxY - minY;
  //             const ctx = canvas.getContext('2d');
  //             if (ctx) {
  //               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //               const dataURL = canvas.toDataURL();
  //               resolve(dataURL); // Resolve the promise with the cropped image data URL
  //             }
  //             // Cleanup: remove the temporary container from the document
  //             document.body.removeChild(container);
  //           },
  //         });
  //       });
  //     };

  //     const captureShapes = async () => {
  //       setloading(true);
  //       try {
  //         // for(let j = 0; j<uploadFileData?.length; j++){

  //         // }
  //         // const background = await loadImage(uploadFileData[1]?.src || ''); // Update based on actual data structure
  //         const promises = reportData.map(async (item) => {
  //           const page = uploadFileData?.find(
  //             (pg: any) => pg?.pageId == item?.pageId
  //           );
  //           console.log(
  //             page,
  //             ' ===> Data of pages and reports for Page loading of capture'
  //           );
  //           let background: any = {};
  //           if (page) {
  //             background = await loadImage(page?.src || '');
  //           } else {
  //             background = await loadImage(uploadFileData[0]?.src || '');
  //           }
  //           console.log(
  //             background,
  //             ' ===> Data of pages and reports for Page bottom loading of capture'
  //           );
  //           const url = await captureShape(
  //             { ...item.config, text: item.text, name: item.projectName },
  //             background,
  //             item.type
  //           );
  //           return {
  //             image: url,
  //             details: { ...item },
  //           };
  //         });

  //         const processInBatches = async (promisesArray: any[], batchSize: number) => {
  //           const results = [];

  //           for (let i = 0; i < promisesArray.length; i += batchSize) {
  //             setperText(`${i}/${promisesArray?.length}`)
  //             // Extract a batch of promises
  //             const batch = promisesArray.slice(i, i + batchSize);

  //             // Wait for all promises in the current batch to resolve
  //             const batchResults = await Promise.all(batch.map((promiseFn) => promiseFn));
  //             results.push(...batchResults); // Store the results
  //             setData(ps=>(ps?.map((it,ind)=>{
  //               if(ind == i){
  //                 return {...it,image:batchResults[0].image}
  //               }else{
  //                 return it
  //               }
  //             })))
  //           }

  //           return results;
  //         }

  //         // const newData = await Promise.all(promises);
  //         const newData = await processInBatches(promises, 1);
  //         setData(newData);
  //         setloading(false);
  //       } catch (error) {
  //         setloading(false);
  //         console.log(error, 'error while capturing loading of capture');
  //       }
  //     };

  //     if (reportData.length) captureShapes();
  //   } else {
  //     setData([])
  //     setloading(false)
  //   }
  // }, [reportData, uploadFileData])

  //New working right and optimized but points fails on right place
  // useEffect(() => {
  //   console.log(reportData, uploadFileData, " ===> loading of capture ")
  //   if (Array.isArray(reportData) && reportData?.length > 0 && Array.isArray(uploadFileData) && uploadFileData?.length > 0) {
  //     setloading(true)
  //     setData(reportData.map((i)=>({image:'/overview.png',details:{...i}})))
  //     console.log(uploadFileData, reportData, " ===> Data of pages and reports")
  //     const loadImage = (src: string) => {
  //       return new Promise<HTMLImageElement>((resolve, reject) => {
  //         //@ts-ignore
  //         const img = new Image();
  //         img.crossOrigin = 'anonymous';
  //         img.src = `${src}?cacheBust=${new Date().getTime()}`;
  //         img.onload = () => {
  //           let wi = img.width
  //           let hi = img.height
  //           let nw = 500;
  //           let nh = nw * (hi/wi)
  //           img.width = nw;
  //           img.height = nh;
  //           img.id = `${wi}-${hi}-${new Date().getTime()}`
  //           resolve(img)
  //         };
  //         img.onerror = (e: any) => { console.log(e, " ==> Page image loading of capture"); reject(e) };
  //       });
  //     };

  //     const captureShape = async (
  //       shape: any,
  //       background: HTMLImageElement,
  //       shapeType: string
  //     ) => {
  //       // Create a temporary container for off-screen stage
  //       const container = document.createElement('div');
  //       container.style.display = 'none'; // Hide the container
  //       document.body.appendChild(container); // This is required for Konva.Stage initialization

  //       return new Promise<string>((resolve) => {
  //         // const [w,h] = background.id?.split('-')
  //         // Initialize a temporary stage with the container
  //         const tempStage = new Konva.Stage({
  //           container: container,
  //           width: background.width,
  //           height: background.height,
  //         });

  //         const layer = new Konva.Layer();
  //         tempStage.add(layer);

  //         // Add the background image to the layer
  //         const bgImage = new Konva.Image({
  //           image: background,
  //           width: background.width,
  //           height: background.height,
  //         });
  //         layer.add(bgImage);

  //         let minX: number, minY: number, maxX: number, maxY: number;

  //         // Initialize variables to ensure they cover the shape with margins later
  //         minX = minY = Number.MAX_SAFE_INTEGER;
  //         maxX = maxY = 0;

  //         // Determine the type of shape and render accordingly
  //         switch (shapeType) {
  //           case 'count': {
  //             // Example for a circle shape
  //             const { x, y, radius = 20 } = shape;
  //             const circle = new Konva.Image({
  //               image: counterImage,
  //               width: 20,
  //               height: 20,
  //               x,
  //               y,
  //               radius,
  //             });
  //             layer.add(circle);

  //             // Adjust bounds for the circle, considering the radius and a margin
  //             minX = x - radius - 20;
  //             minY = y - radius - 20;
  //             maxX = x + radius + 20;
  //             maxY = y + radius + 20;
  //             break;
  //           }

  //           case 'line':
  //           case 'perimeter':
  //           case 'dynamic':
  //           case 'area':
  //           case 'volume':
  //             {
  //               // Example for a line or polygon shape
  //               const { points, stroke, strokeWidth, lineCap } = shape;
  //               const line = new Konva.Line({
  //                 points,
  //                 stroke,
  //                 strokeWidth,
  //                 lineCap,
  //                 closed: shapeType === 'area' || shapeType === 'volume', // Close path for areas and volumes
  //                 fill: shape?.fillColor
  //               });
  //               layer.add(line);
  //               console.warn(shape, 'sssss');
  //               let xText = 0,
  //                 yText = 0;
  //               if (
  //                 shapeType === 'area' ||
  //                 shapeType === 'volume' ||
  //                 shapeType === 'dynamic'
  //               ) {
  //                 const { x, y } = calculatePolygonCenter(points);
  //                 xText = x - 20;
  //                 yText = y - 20;
  //               } else {
  //                 const { x, y } = calculateMidpoint(points);
  //                 xText = x - 20;
  //                 yText = y - 20;
  //               }

  //               // Calculate bounds for lines and polygons, include margin
  //               const xs = points.filter((_: any, i: number) => i % 2 === 0);
  //               const ys = points.filter((_: any, i: number) => i % 2 !== 0);
  //               minX = Math.min(...xs) - 20;
  //               minY = Math.min(...ys) - 20;
  //               maxX = Math.max(...xs) + 20;
  //               maxY = Math.max(...ys) + 20;
  //               const textSize = ((maxX - minX) * (maxY - minY)) / 100000;

  //               console.warn(textSize);
  //               const text = new Konva.Text({
  //                 x: xText,
  //                 y: yText,
  //                 text: shape.text,
  //                 fontSize: Math.floor(textSize) * 10 + 25,
  //                 fontFamily: 'Calibri',
  //                 fill: shape?.textColor ?? 'red',
  //               });
  //               layer.add(text);
  //             }
  //             break;

  //           default:
  //             console.error('Unknown shape type:', shapeType);
  //             return;
  //         }

  //         layer.draw(); // Force drawing the layer to render shapes

  //         // Use toImage to capture the specified region
  //         tempStage.toImage({
  //           x: minX,
  //           y: minY,
  //           width: maxX - minX,
  //           height: maxY - minY,
  //           callback: (img) => {
  //             // Create a canvas to get the cropped image data
  //             const canvas = document.createElement('canvas');
  //             canvas.width = maxX - minX;
  //             canvas.height = maxY - minY;
  //             const ctx = canvas.getContext('2d');
  //             if (ctx) {
  //               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //               const dataURL = canvas.toDataURL();
  //               resolve(dataURL); // Resolve the promise with the cropped image data URL
  //             }
  //             // Cleanup: remove the temporary container from the document
  //             document.body.removeChild(container);
  //           },
  //         });
  //       });
  //     };

  //     const captureShapes = async () => {
  //       setloading(true);
  //       try {
  //         // for(let j = 0; j<uploadFileData?.length; j++){

  //         // }
  //         // const background = await loadImage(uploadFileData[1]?.src || ''); // Update based on actual data structure
  //         const promises = reportData.map(async (item) => {
  //           const page = uploadFileData?.find(
  //             (pg: any) => pg?.pageId == item?.pageId
  //           );
  //           console.log(
  //             page,
  //             ' ===> Data of pages and reports for Page loading of capture'
  //           );
  //           let background: any = {};
  //           if (page) {
  //             background = await loadImage(page?.src || '');
  //           } else {
  //             background = await loadImage(uploadFileData[0]?.src || '');
  //           }
  //           console.log(
  //             background,
  //             ' ===> Data of pages and reports for Page bottom loading of capture'
  //           );
  //           const url = await captureShape(
  //             { ...item.config, text: item.text, name: item.projectName },
  //             background,
  //             item.type
  //           );
  //           return {
  //             image: url,
  //             details: { ...item },
  //           };
  //         });

  //         const processInBatches = async (promisesArray: any[], batchSize: number) => {
  //           const results = [];

  //           for (let i = 0; i < promisesArray.length; i += batchSize) {
  //             setperText(`${i}/${promisesArray?.length}`)
  //             // Extract a batch of promises
  //             const batch = promisesArray.slice(i, i + batchSize);

  //             // Wait for all promises in the current batch to resolve
  //             const batchResults = await Promise.all(batch.map((promiseFn) => promiseFn));
  //             results.push(...batchResults); // Store the results
  //             setData(ps=>(ps?.map((it,ind)=>{
  //               if(ind == i){
  //                 return {...it,image:batchResults[0].image}
  //               }else{
  //                 return it
  //               }
  //             })))
  //           }

  //           return results;
  //         }

  //         // const newData = await Promise.all(promises);
  //         const newData = await processInBatches(promises, 1);
  //         setData(newData);
  //         setloading(false);
  //       } catch (error) {
  //         setloading(false);
  //         console.log(error, 'error while capturing loading of capture');
  //       }
  //     };

  //     if (reportData.length) captureShapes();
  //   } else {
  //     setData([])
  //     setloading(false)
  //   }
  // }, [reportData, uploadFileData])

  const getBezierPointsCurve = (
    customPoints: number[],
    controlPoints: ControlPoint[]
  ) => {
    if (!Array.isArray(controlPoints) || !(controlPoints.length > 0))
      return customPoints;
    try {
      const bezierPoints: number[] = [];
      for (let i = 0; i < customPoints.length; i += 2) {
        const nextIndex = (i + 2) % customPoints.length;
        const controlIndex = i / 2;
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

  const getBezierPointsArc = (
    customPoints: number[],
    controlPoints: ControlPoint[]
  ) => {
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
  //GPT Try
  useEffect(() => {
    console.log(reportData, uploadFileData, ' ===> loading of capture ');
    if (
      Array.isArray(reportData) &&
      reportData.length > 0 &&
      Array.isArray(uploadFileData) &&
      uploadFileData.length > 0
    ) {
      setloading(true);
      setData(
        reportData.map((i) => ({ image: '/overview.png', details: { ...i } }))
      );
      console.log(
        uploadFileData,
        reportData,
        ' ===> Data of pages and reports'
      );

      const loadImage = (src: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = `${src}?cacheBust=${new Date().getTime()}&quality=${30}`;
          img.onload = () => {
            let wi = img.width;
            let hi = img.height;
            let nw = 1000; //img.width;
            let nh = nw * (hi / wi);
            img.width = nw;
            img.height = nh;
            // img.id = `${wi}-${hi}-${new Date().getTime()}`;
            //@ts-ignore
            resolve({ img, scaleX: nw / wi, scaleY: nh / hi });
          };
          img.onerror = (e: any) => {
            console.log(e, ' ==> Page image loading of capture');
            reject(e);
          };
        });
      };

      const captureShape = async (
        shape: any,
        background: { img: HTMLImageElement; scaleX: number; scaleY: number },
        shapeType: string,
        scale: ScaleData
      ) => {
        console.log(shape, shapeType, ' ===> Shape inside generate reports');
        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);

        return new Promise<{ url: string; text: string }>((resolve) => {
          const tempStage = new Konva.Stage({
            container: container,
            width: background.img.width,
            height: background.img.height,
          });

          const layer = new Konva.Layer();
          tempStage.add(layer);

          const bgImage = new Konva.Image({
            image: background.img,
            width: background.img.width,
            height: background.img.height,
          });
          layer.add(bgImage);

          let minX: number, minY: number, maxX: number, maxY: number;
          minX = minY = Number.MAX_SAFE_INTEGER;
          maxX = maxY = 0;

          const scaleX = background.scaleX;
          const scaleY = background.scaleY;

          let curtxt: string | number = '';

          switch (shapeType) {
            case 'text':
              break;
            case 'count': {
              const { x, y, radius = 20 } = shape;
              const circle = new Konva.Image({
                image: counterImage,
                width: 20,
                height: 20,
                x: x * scaleX,
                y: y * scaleY,
                radius,
              });
              // const circle = new Konva.Path({
              //   data: getCounterImagePath(shape?.countType ?? 'tick'),
              //   width: 20,
              //   height: 20,
              //   x: x * scaleX,
              //   y: y * scaleY,
              //   // ...shape
              // })
              layer.add(circle);

              minX = x * scaleX - radius - 20;
              minY = y * scaleY - radius - 20;
              maxX = x * scaleX + radius + 20;
              maxY = y * scaleY + radius + 20;
              break;
            }

            case 'line':
            case 'perimeter':
            case 'dynamic':
            case 'arc':
            case 'curve':
            case 'area':
            case 'volume':
              {
                const { points, stroke, strokeWidth, lineCap } = shape;
                let scaledPoints = points.map((point: number, index: number) =>
                  index % 2 === 0 ? point * scaleX : point * scaleY
                );
                if (shapeType == 'curve') {
                  let pnts = getBezierPointsCurve(points, shape?.controlPoints);
                  scaledPoints = pnts.map((point: number, index: number) =>
                    index % 2 === 0 ? point * scaleX : point * scaleY
                  );
                }
                if (shapeType == 'arc') {
                  let pnts = getBezierPointsArc(points, shape?.controlPoints);
                  scaledPoints = pnts.map((point: number, index: number) =>
                    index % 2 === 0 ? point * scaleX : point * scaleY
                  );
                }

                // curtxt =
                //   shapeType == 'line'
                //     ? calcLineDistance(points, scale, true)
                //     : shapeType == 'perimeter'
                //       ? points?.length > 4
                //         ? calculatePolygonPerimeter(points, scale)
                //         : calcLineDistance(points, scale, true)
                //       : shapeType == 'area'
                //         ? calculatePolygonArea(points, scale)
                //         : shapeType == 'volume'
                //           ? calculatePolygonVolume(
                //               points,
                //               shape?.depth || 1,
                //               scale
                //             )
                //           : shapeType == 'arc' || shapeType == 'curve'
                //             ? shape?.text ?? ''
                //             : '';

                curtxt =
                  shapeType == 'line'
                    ? shape?.scalUnits == 'feet'
                      ? calcLineDistance(shape?.points, scale, true)
                      : `${Number(Number(calcLineDistance(shape?.points, scale, false)) * 0.0254).toFixed(3)} meter`
                    : shapeType == 'perimeter'
                      ? points?.length > 4
                        ? calculatePolygonPerimeter(points, scale)
                        : calcLineDistance(points, scale, true)
                      : shapeType == 'area'
                        ? shape?.scalUnits == 'feet'
                          ? `${calculatePolygonArea(points, scale)?.toFixed(4) || ''}SF`
                          : `${Number(calculatePolygonArea(points, scale) * 0.092903).toFixed(3)}m²`
                        : shapeType == 'volume'
                          ? shape?.scalUnits == 'feet'
                            ? `${calculatePolygonVolume(points, shape?.depth || 1, scale)?.toFixed(2) || ''} CF`
                            : `${Number(calculatePolygonVolume(points, shape?.depth || 1, scale) * 0.0283168).toFixed(3)} m³`
                          : shapeType == 'arc' || shapeType == 'curve'
                            ? shape?.text ?? ''
                            : '';

                const line = new Konva.Line({
                  points: scaledPoints,
                  stroke,
                  strokeWidth,
                  lineCap,
                  closed:
                    shapeType === 'area' ||
                    shapeType === 'volume' ||
                    shapeType == 'curve',
                  fill: shape?.fillColor,
                  bezier: shapeType === 'arc' || shapeType === 'curve',
                });
                layer.add(line);

                let xText = 0,
                  yText = 0;
                if (
                  shapeType === 'area' ||
                  shapeType === 'volume' ||
                  shapeType === 'dynamic' ||
                  shapeType === 'curve'
                ) {
                  const { x, y } = calculatePolygonCenter(scaledPoints);
                  xText = x - 20;
                  yText = y - 20;
                } else {
                  const { x, y } = calculateMidpoint(scaledPoints);
                  xText = x - 20;
                  yText = y - 20;
                }

                const xs = scaledPoints.filter((_: any, i: any) => i % 2 === 0);
                const ys = scaledPoints.filter((_: any, i: any) => i % 2 !== 0);
                minX = Math.min(...xs) - 20;
                minY = Math.min(...ys) - 20;
                maxX = Math.max(...xs) + 20;
                maxY = Math.max(...ys) + 20;
                const textSize = ((maxX - minX) * (maxY - minY)) / 100000;

                const text = new Konva.Text({
                  x: xText,
                  y: yText,
                  text: `${curtxt}`, //shape.text,
                  fontSize: Math.floor(textSize) * 10 + 25,
                  fontFamily: 'Calibri',
                  fill: shape?.textColor ?? 'red',
                });
                layer.add(text);
              }
              break;

            default:
              console.error('Unknown shape type:', shapeType);
              return;
          }

          layer.draw();

          tempStage.toImage({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            callback: (img) => {
              const canvas = document.createElement('canvas');
              canvas.width = maxX - minX;
              canvas.height = maxY - minY;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL();
                resolve({ url: dataURL, text: `${curtxt}` });
              }
              document.body.removeChild(container);
            },
          });
        });
      };

      const captureShapes = async () => {
        setloading(true);
        try {
          const promises = reportData.map(async (item) => {
            const page = uploadFileData.find(
              (pg: any) => pg?.pageId == item?.pageId
            );
            let background: any = {};
            if (page) {
              background = await loadImage(page?.src || '');
            } else {
              background = await loadImage(uploadFileData[0]?.src || '');
            }
            const scale = page?.scale ?? {
              xScale: `1in=1in`,
              yScale: `1in=1in`,
              precision: '1',
            };
            const { url, text } = await captureShape(
              { ...item.config, text: item.text, name: item.projectName },
              background,
              item.type,
              scale
            );
            return {
              image: url,
              details: { ...item, text },
            };
          });

          const processInBatches = async (
            promisesArray: any[],
            batchSize: number
          ) => {
            const results = [];

            for (let i = 0; i < promisesArray.length; i += batchSize) {
              setperText(`${i}/${promisesArray?.length}`);
              const batch = promisesArray.slice(i, i + batchSize);
              const batchResults = await Promise.all(
                batch.map((promiseFn) => promiseFn)
              );
              results.push(...batchResults);
              setData((ps) =>
                ps.map((it, ind) =>
                  ind === i
                    ? {
                        details: {
                          ...it.details,
                          text: batchResults[0]?.details?.text,
                        },
                        image: batchResults[0].image,
                      }
                    : it
                )
              );
            }

            return results;
          };

          const newData = await processInBatches(promises, 1);
          setData(newData);
          setloading(false);
        } catch (error) {
          setloading(false);
          console.log(error, 'error while capturing loading of capture');
        }
      };

      if (reportData.length) captureShapes();
    } else {
      setData([]);
      setloading(false);
    }
  }, [reportData, uploadFileData]);

  useEffect(() => {
    console.log(loading, ' ===> loading of capture');
  }, [loading]);
  useEffect(() => {
    return () => {
      setData([]);
      setuploadFileData([]);
      setreportData([]);
    };
  }, []);
  console.log(data, ' ===> data to capture');
  const [downloadLoading, setdownloadLoading] = useState(false);
  const donwnloadpdf = async () => {
    try {
      setdownloadLoading(true);
      await generatePDF('capture');
      setdownloadLoading(false);
    } catch (error) {
      setdownloadLoading(false);
      console.log(error);
      toast.error('Error while downloading');
    }
  };

  return (
    <div className="py-2.5 px-6 bg-white border border-solid border-elboneyGray rounded-[4px] z-50 w-[90vw] h-[90vh] flex flex-col">
      <section className="w-full">
        <div className="flex justify-between items-center border-b-Gainsboro ">
          <div>
            <QuaternaryHeading
              title={`Report ${perText}`}
              className="text-graphiteGray font-bold"
            />
            {loading && <Spin />}
            {/* <QuinaryHeading
              title="Select any existing client from here."
              className="text-coolGray"
            /> */}
          </div>
          {/* <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          /> */}
        </div>
      </section>
      <section className="w-full grow overflow-y-auto">
        <div>
          {/* Report Generation Loading */}
          {/* {loading &&
            <div className='rounded-t-2xl absolute top-0 left-0 w-[100%] h-[100%] bg-slate-200 flex justify-center items-center bg-opacity-30 z-50' >
              <Spin size='large' />
            </div>
          } */}
          <Stage
            ref={stageRef}
            width={800}
            height={1800}
            style={{ display: 'none' }}
          >
            <Layer />
          </Stage>
          <div>
            <div className="grid grid-cols-1 gap-4 m-12 " id="capture">
              {/* {groupByType(data).map((entity, index) => ( */}
              {groupByCategory(data).map((entity, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col border rounded-2xl justify-between"
                >
                  <ReportCard entity={entity} />
                </div>
              ))}
            </div>
            {loading && (
              <div className="w-full flex flex-col rounded-2xl justify-between">
                <Spin size="large" />
              </div>
            )}
            <div className="flex justify-center items-center my-4">
              {/* {isSaving ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                ''
              )} */}
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-4 mt-5 mb-2">
        <div>
          <Button
            text="Cancel"
            className="!bg-snowWhite !text-abyssalBlack !py-1.5 "
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div>
          <Button
            text="Download PDF"
            onClick={() => donwnloadpdf()}
            className="!py-1.5"
            isLoading={downloadLoading}
          />
        </div>
        {/* <div>
          <Button
            text="Save"
            onClick={() => { }}
            className="!py-1.5"
          />
        </div> */}
      </div>
    </div>
  );
};

export default ReportModal;
