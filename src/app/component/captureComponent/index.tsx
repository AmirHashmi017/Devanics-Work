import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

// import UploadFileContext, {
//   UploadFileContextProps,
// } from '@/app/(pages)/takeoff/context/UploadFileContext';
import ReportCard from '../reportCard';

// import { DrawHistoryContext } from '@/app/(pages)/takeoff/context';
import {
  // ReportDataContextProps,
  ReportDataInterface,
} from '@/app/(pages)/takeoff/context/ReportDataContext';

// import uploadToS3 from './uploadToS3';

// import { AppDispatch } from '@/redux/store';
// import { useDispatch } from 'react-redux';
// import { createTakeoffSummary, updateTakeoffSummary } from '@/redux/takeoffSummaries/takeoffSummaries.thunk';
import { useDraw } from '@/app/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { takeoffSummaryService } from '@/app/services/takeoffSummary.service';

export interface dataInterface {
  image: string;
  details: ReportDataInterface;
}
const groupByType = (items: dataInterface[]): dataInterface[][] => {
  console.log(items, ' ===> Data interface');

  const grouped = items.reduce(
    (acc, item) => {
      // Initialize the array for this type if it doesn't already exist
      if (!acc[item.details.projectName]) {
        acc[item.details.projectName] = [];
      }
      // Push the current item into the appropriate group
      acc[item.details.projectName].push(item);
      return acc;
    },
    {} as Record<string, dataInterface[]>
  );

  // Extract and return just the array of groups
  return Object.values(grouped);
};
const CaptureComponent = ({
  // name,
  save,
  // onSaveSuccess,
  // selectedClient,
}: {
  name: string;
  save: number;
  onSaveSuccess: () => void;
  selectedClient?: any;
  // itemsToCapture: DrawHistoryContextInterface;
  // onCapture: (url: string, key: number) => void;
}) => {
  const router = useRouter();
  const counterImage = new Image();
  counterImage.src = '/count-draw.png';

  const stageRef = useRef<Konva.Stage>(null);
  const [data, setData] = useState<dataInterface[]>([]);
  const [isSaving] = useState<boolean>(false);
  // const dispatch = useDispatch<AppDispatch>();
  const { calculateMidpoint, calculatePolygonCenter } = useDraw();
  // const { uploadFileData } = useContext(
  //   UploadFileContext
  // ) as UploadFileContextProps;

  // const { reportData } = useContext(
  //   ReportDataContext
  // ) as ReportDataContextProps;
  // const { drawHistory } = useContext(DrawHistoryContext)
  const [reportData, setreportData] = useState<any>([]);
  const [uploadFileData, setuploadFileData] = useState<any>([]);

  console.log('reportData', reportData, uploadFileData);

  const [takeOff, settakeOff] = useState<any>({});
  const [loading, setloading] = useState<boolean>(true);
  const params = useSearchParams();
  const edit_id = params.get('edit_id');
  const getTakeOffDetails = async (id: string) => {
    try {
      const data = await takeoffSummaryService.httpGetSignleTakeOffSummary(id);
      console.log(data, ' ===> Data coming for single record of summaruy');
      settakeOff(data?.data);
    } catch (error) {
      console.log(error, 'error');
      router.push('/take-off');
    }
  };

  useEffect(() => {
    if (edit_id && edit_id?.length > 0) {
      getTakeOffDetails(edit_id);
    } else {
      router.push('/take-off');
    }
  }, [edit_id]);

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

  useEffect(() => {
    console.log(reportData, uploadFileData, ' ===> loading of capture ');
    if (
      Array.isArray(reportData) &&
      reportData?.length > 0 &&
      Array.isArray(uploadFileData) &&
      uploadFileData?.length > 0
    ) {
      setloading(true);
      console.log(
        uploadFileData,
        reportData,
        ' ===> Data of pages and reports'
      );
      const loadImage = (src: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          //@ts-ignore
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = (e: any) => reject(e);
        });
      };

      const captureShape = async (
        shape: any,
        background: HTMLImageElement,
        shapeType: string
      ) => {
        // Create a temporary container for off-screen stage
        const container = document.createElement('div');
        container.style.display = 'none'; // Hide the container
        document.body.appendChild(container); // This is required for Konva.Stage initialization

        return new Promise<string>((resolve) => {
          // Initialize a temporary stage with the container
          const tempStage = new Konva.Stage({
            container: container,
            width: background.width,
            height: background.height,
          });

          const layer = new Konva.Layer();
          tempStage.add(layer);

          // Add the background image to the layer
          const bgImage = new Konva.Image({
            image: background,
            width: background.width,
            height: background.height,
          });
          layer.add(bgImage);

          let minX: number, minY: number, maxX: number, maxY: number;

          // Initialize variables to ensure they cover the shape with margins later
          minX = minY = Number.MAX_SAFE_INTEGER;
          maxX = maxY = 0;

          // Determine the type of shape and render accordingly
          switch (shapeType) {
            case 'count': {
              // Example for a circle shape
              const { x, y, radius = 20 } = shape;
              const circle = new Konva.Image({
                image: counterImage,
                width: 20,
                height: 20,
                x,
                y,
                radius,
              });
              layer.add(circle);

              // Adjust bounds for the circle, considering the radius and a margin
              minX = x - radius - 20;
              minY = y - radius - 20;
              maxX = x + radius + 20;
              maxY = y + radius + 20;
              break;
            }

            case 'line':
            case 'perimeter':
            case 'dynamic':
            case 'area':
            case 'volume':
              {
                // Example for a line or polygon shape
                const { points, stroke, strokeWidth, lineCap } = shape;
                const line = new Konva.Line({
                  points,
                  stroke,
                  strokeWidth,
                  lineCap,
                  closed: shapeType === 'area' || shapeType === 'volume', // Close path for areas and volumes
                });
                layer.add(line);
                console.warn(shape, 'sssss');
                let xText = 0,
                  yText = 0;
                if (
                  shapeType === 'area' ||
                  shapeType === 'volume' ||
                  shapeType === 'dynamic'
                ) {
                  const { x, y } = calculatePolygonCenter(points);
                  xText = x - 20;
                  yText = y - 20;
                } else {
                  const { x, y } = calculateMidpoint(points);
                  xText = x - 20;
                  yText = y - 20;
                }

                // Calculate bounds for lines and polygons, include margin
                const xs = points.filter((_: any, i: number) => i % 2 === 0);
                const ys = points.filter((_: any, i: number) => i % 2 !== 0);
                minX = Math.min(...xs) - 20;
                minY = Math.min(...ys) - 20;
                maxX = Math.max(...xs) + 20;
                maxY = Math.max(...ys) + 20;
                const textSize = ((maxX - minX) * (maxY - minY)) / 100000;

                console.warn(textSize);
                const text = new Konva.Text({
                  x: xText,
                  y: yText,
                  text: shape.text,
                  fontSize: Math.floor(textSize) * 10 + 25,
                  fontFamily: 'Calibri',
                  fill: 'red',
                });
                layer.add(text);
              }
              break;

            default:
              console.error('Unknown shape type:', shapeType);
              return;
          }

          layer.draw(); // Force drawing the layer to render shapes

          // Use toImage to capture the specified region
          tempStage.toImage({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            callback: (img) => {
              // Create a canvas to get the cropped image data
              const canvas = document.createElement('canvas');
              canvas.width = maxX - minX;
              canvas.height = maxY - minY;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL();
                resolve(dataURL); // Resolve the promise with the cropped image data URL
              }
              // Cleanup: remove the temporary container from the document
              document.body.removeChild(container);
            },
          });
        });
      };

      const captureShapes = async () => {
        setloading(true);
        try {
          // for(let j = 0; j<uploadFileData?.length; j++){

          // }
          // const background = await loadImage(uploadFileData[1]?.src || ''); // Update based on actual data structure
          const promises = reportData.map(async (item) => {
            const page = uploadFileData?.find(
              (pg: any) => pg?.pageId == item?.pageId
            );
            console.log(page, ' ===> Data of pages and reports for Page');
            let background: any = {};
            if (page) {
              background = await loadImage(page?.src || '');
            } else {
              background = await loadImage(uploadFileData[0]?.src || '');
            }
            console.log(background, ' ===> Data of pages and reports for Page');
            const url = await captureShape(
              { ...item.config, text: item.comment, name: item.projectName },
              background,
              item.type
            );
            return {
              image: url,
              details: { ...item },
            };
          });

          const newData = await Promise.all(promises);
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

  const saveData = () => {
    // if (data.length > 0) {
    //   setIsSaving(true);
    //   setTimeout(() => {
    //     uploadToS3('capture', uploadFileData).then((result: any) => {
    //       console.log(result, "result measurements");
    //       let clientD = {}
    //       if (selectedClient?._id) clientD = { client: selectedClient?._id }
    //       //@ts-ignore
    //       if (urlSearch && urlSearch.get('edit_id') && urlSearch.get('edit_id')?.length > 0) {
    //         dispatch(
    //           updateTakeoffSummary({
    //             id: urlSearch.get('edit_id'),
    //             data: {
    //               name: name || 'Untitled',
    //               scope: data.length,
    //               createdBy: 99999,
    //               url: result?.url,
    //               // pages: result?.pages,
    //               measurements: drawHistory,
    //               ...clientD
    //             }
    //           })
    //         );
    //       } else {
    //         dispatch(
    //           createTakeoffSummary({
    //             name: name || 'Untitled',
    //             scope: data.length,
    //             createdBy: 99999,
    //             url: result?.url,
    //             pages: result?.pages,
    //             measurements: drawHistory,
    //             ...clientD
    //           })
    //         );
    //       }
    //       setIsSaving(false);
    //       onSaveSuccess();
    //       router.push('/takeoff')
    //     });
    //   }, 2000);
    // }
  };
  useEffect(() => {
    if (save) saveData();
  }, [save]);

  console.warn('data', reportData);
  return (
    <div>
      <Stage
        ref={stageRef}
        width={800}
        height={1800}
        style={{ display: 'none' }}
      >
        <Layer />
      </Stage>
      <div>
        <div className="grid grid-cols-2 gap-4 m-12 " id="capture">
          {groupByType(data).map((entity, index) => (
            <div
              key={index}
              className="w-full flex flex-col border-[1px] border-gray-300 rounded-2xl justify-between p-4"
            >
              <ReportCard entity={entity} />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center my-4">
          {isSaving ? (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureComponent;
