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
}

const ReportModal = ({ setModalOpen, takeOff }: Props) => {
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
    let reportData: any = [];
    if (
      takeOff?.measurements &&
      Object.keys(takeOff?.measurements) &&
      Object.keys(takeOff?.measurements)?.length > 0
    ) {
      Object.keys(takeOff?.measurements)?.map((key: any) => {
        if (
          takeOff?.measurements[key] &&
          Object.keys(takeOff?.measurements[key]) &&
          Object.keys(takeOff?.measurements[key])?.length > 0
        ) {
          Object.keys(takeOff?.measurements[key])?.map((type: any) => {
            reportData = [
              ...reportData,
              ...(takeOff?.measurements[key][type] &&
              Array.isArray(takeOff?.measurements[key][type]) &&
              takeOff?.measurements[key][type]?.length > 0
                ? takeOff.measurements[key][type].map((arrit: any) => {
                    return {
                      ...arrit,
                      pageId: key,
                      type,
                      pageData: takeOff?.pages?.find(
                        (pg: any) => pg?.pageId == key
                      ),
                      pageLabel: takeOff?.pages?.find(
                        (pg: any) => pg?.pageId == key
                      )?.pageNum,
                      color: arrit?.stroke,
                      config: arrit,
                    };
                  })
                : []),
            ];
          });
        }
      });
    }
    console.log(reportData, ' ===> Take offs reportData');
    return reportData;
  };
  // getPageData()
  useEffect(() => {
    setreportData(getPageData() ?? []);
    setuploadFileData(takeOff?.pages ?? []);
  }, [takeOff]);
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

                curtxt =
                  shapeType == 'line'
                    ? calcLineDistance(points, scale, true)
                    : shapeType == 'perimeter'
                      ? points?.length > 4
                        ? calculatePolygonPerimeter(points, scale)
                        : calcLineDistance(points, scale, true)
                      : shapeType == 'area'
                        ? calculatePolygonArea(points, scale)
                        : shapeType == 'volume'
                          ? calculatePolygonVolume(
                              points,
                              shape?.depth || 1,
                              scale
                            )
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
