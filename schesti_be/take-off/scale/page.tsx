'use client';
import { useState, useContext, useEffect, useRef } from 'react';
import ModalComponent from '@/app/component/modal';
import ScaleModal from '../components/scale';
import ModalsWrapper from './components/ModalWrapper';
import {
  Avatar,
  ColorPicker,
  Dropdown,
  Empty,
  InputNumber,
  Menu,
  Popover,
  Progress,
  Select,
  Space,
  Spin,
} from 'antd';
import { EditContext, ScaleContext, UploadFileContext } from '../context';
import { UploadFileContextProps } from '../context/UploadFileContext';
import Konva from 'konva';
import jsPDF from 'jspdf';
import {
  Measurements,
  ScaleInterface,
  Units,
  defaultMeasurements,
} from '../types';
import NextImage from 'next/image';
import { ScaleNavigation, Draw } from './components';
import { ScaleDataContextProps } from '../context/ScaleContext';
import { useRouter, useSearchParams } from 'next/navigation';
// import CusotmButton from '@/app/component/customButton/button';
// import { ReportDataContextProps } from '../context/ReportDataContext';
// import SelectPageModal from '../components/selectPageModal';
// import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/authSlices/auth.selector';

////////////////////////New Take OffData///////////////////////////////////
import CustomButton from '@/app/component/customButton/button';
import { bg_style } from '@/globals/tailwindvariables';
import {
  AppstoreOutlined,
  BorderLeftOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  DragOutlined,
  EditOutlined,
  FileOutlined,
  FolderFilled,
  FolderOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftOutlined,
  MenuOutlined,
  MinusOutlined,
  MoreOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Button, Divider, Input, Table } from 'antd';
//@ts-ignore
import type { ColumnsType } from 'antd/es/table';
import { takeoffSummaryService } from '@/app/services/takeoffSummary.service';
import { EditableText } from '@/app/component/EditableText';
import ReportModal from '../components/ReportModal';
// import TertiaryHeading from '@/app/component/headings/tertiary';
import CreateProgressModal from '../components/createProgressModal';
// import { UploadFileData } from '../context/EditContext';
// import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import AwsS3 from '@/app/utils/S3Intergration';
import { toast } from 'react-toastify';
// import { AnyArn } from 'aws-sdk/clients/groundstation';
// import { AnyCnameRecord } from 'dns';
import useWheelZoom from './components/useWheelZoom';
import Draggable from 'react-draggable';
// import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { useDraw } from '@/app/hooks';
import { Option } from 'antd/es/mentions';
import moment from 'moment';
import { withAuth } from '@/app/hoc/withAuth';
// import { AnyArn } from 'aws-sdk/clients/groundstation';
// import { AnyAaaaRecord } from 'dns';
// import axios from 'axios';
// import axios from 'axios';

interface ControlPoint {
  x: number;
  y: number;
  index: number;
  offsetX: number;
  offsetY: number;
}

const groupDataForFileTable = (input: any[]) => {
  const groupedData = input?.reduce((result: any, currentItem: any) => {
    const {
      id,
      name,
      bucketUrl,
      file,
      page,
      status,
      width,
      height,
      src,
      pageId,
      pageNumber,
      index,
      // fileId
    } = currentItem;

    // Check if there's already an entry with the same projectName and pageLabel
    const existingEntry = result?.find(
      (entry: any) =>
        // entry.projectName === projectName && entry.pageLabel === pageLabel
        entry.file?.name === file?.name
    );

    if (existingEntry) {
      existingEntry?.children?.push({
        id,
        name,
        bucketUrl,
        file,
        page,
        status,
        width,
        height,
        src,
        pageId,
        pageNumber,
        index,
      });
    } else {
      result.push({
        key: result?.length + 1, // Assuming keys start from 1
        id,
        name: file?.name,
        isParent: true,
        bucketUrl,
        file,
        page,
        status,
        index,
        children: [
          {
            id,
            name,
            bucketUrl,
            file,
            page,
            status,
            width,
            height,
            src,
            pageId,
            pageNumber,
            index,
          },
        ],
      });
    }

    return result;
  }, []);

  let rtar: any = [];
  if (Array.isArray(groupedData)) {
    groupedData.forEach((val: any) => {
      let cur = val;
      cur?.children?.sort((a: any, b: any) => a?.index - b?.index);
      rtar.push(cur);
    });
  }

  // return groupedData;
  return rtar;
};

const getSingleMeasurements = (draw: any, pageId: any) => {
  let singleArr: any = [];
  // let returningArr: any = [];
  if (Object?.keys(draw)?.length > 0) {
    Object.keys(draw)?.map((key: string) => {
      if (Array.isArray(draw[`${key}`]) && draw[`${key}`]?.length > 0) {
        singleArr = [
          ...singleArr,
          ...draw[`${key}`].map((i: any) => ({ ...i, type: key, pageId })),
        ];
      }
      return '';
    });
    console.log(
      singleArr,
      pageId,
      ' =====> measurementsTableData measurementsTableData'
    );
    // if (singleArr?.length > 0) {
    //   //Reduce code for category
    //   returningArr = singleArr?.reduce((result: any, currentItem: any) => {
    //     const { category, subcategory, dateTime, points, projectName, stroke, strokeWidth, textUnit, id, lineCap, depth, x, y, user, type } = currentItem
    //     // Check if there's already an entry with the same projectName and pageLabel
    //     const existingEntry = result?.find((entry: any) => entry.category === category);
    //     if (existingEntry) { existingEntry?.children?.push({ category, subcategory, dateTime, points, projectName, stroke, strokeWidth, textUnit, id, lineCap, depth, x, y, user, isParent: false, pageId, type }) }
    //     else {
    //       result?.push({
    //         isParent: true, category, subcategory, dateTime, points, projectName, stroke, strokeWidth, textUnit, id, lineCap, depth, x, y, user, pageId, type,
    //         children: [{ isParent: false, category, subcategory, dateTime, points, projectName, stroke, strokeWidth, textUnit, id, lineCap, depth, x, y, pageId, type, user }]
    //       })
    //     }
    //     return result
    //   }, [])
    // }
  }
  return singleArr;
};

// const { DirectoryTree, TreeNode } = Tree;
////////////////////////New Take OffData///////////////////////////////////

export interface ScaleData {
  xScale: string;
  yScale: string;
  precision: string;
}

export interface PageScale {
  [pageNumber: string]: ScaleData;
}

const TakeOffNewPage = () => {
  /////////////New TakeOff Files Sates, methods and data///////////////////////

  // const pdfjs = useCallback(async () => {
  //   const pdfjs = await import('pdfjs-dist');
  //   await import('pdfjs-dist/build/pdf.worker.min.mjs');

  //   return pdfjs;
  // }, []);
  const [selectedFiles, setselectedFiles] = useState<any>([]);
  const [progressModalOpen, setprogressModalOpen] = useState(false);
  const [fullData, setfullData] = useState({
    files: [],
    pages: [],
  });
  const [allPages] = useState<any>([]);
  const [isApiCalling, setisApiCalling] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  // const handleUpdatePages = (pageIndex: any, s3Url: any, fileIndex: any, success: any, width: any, height: any, fileId: any, ar: any) => {
  //   setfullData((ps: any) => ({ ...ps, pages: [...ps.pages, { pageNum: pageIndex + 1, pageId: `${new Date().getTime()}`, fileId: fileId, width, height, name: `${pageIndex + 1} page`, src: s3Url, success: success, file: { name: ar[fileIndex]?.name ?? fileIndex, index: fileIndex } }] }))
  // }

  // const processSinglePage = async (pageIndex: any, pdf: PDFDocumentProxy, fileIndex: any, fileId: any, ar: any) => {
  //   try {
  //     const page: PDFPageProxy = await pdf.getPage(pageIndex + 1);
  //     console.log(page, typeof (page), " ===> pages while uplaoding")
  //     const scale = 1;
  //     const viewport = page.getViewport({ scale });
  //     const canvas = document.createElement('canvas');
  //     const context = canvas.getContext('2d');
  //     canvas.width = viewport.width;
  //     canvas.height = viewport.height;
  //     const renderContext: any = {
  //       canvasContext: context,
  //       viewport: viewport,
  //     };
  //     await page.render(renderContext).promise;
  //     const obj = {
  //       src: canvas.toDataURL('image/png') || '',
  //       height: viewport.height,
  //       width: viewport.width,
  //     }
  //     const s3Url = await new AwsS3(obj.src, 'documents/takeoff-reports/').uploadS3URL()
  //     handleUpdatePages(pageIndex, s3Url, fileIndex, true, viewport?.width, viewport?.height, fileId, ar)
  //     page.cleanup()
  //   } catch (error) {
  //     console.log(error, " ===> Error insdie process single page");
  //     handleUpdatePages(pageIndex, "", fileIndex, false, 0, 0, fileId, ar)
  //   }
  // }
  // const processSingleFile = async (i: any, ar: any) => {
  //   try {
  //     const curFile = ar[i]
  //     const fileId = `${new Date()?.getTime()}`
  //     console.log(curFile, " ===> Current File Running");
  //     if (curFile) {
  //       const PDFJS = await pdfjs();
  //       // const pdfPagesData: UploadFileData[] = [];
  //       const reader = new FileReader();
  //       reader.onload = async (event: any) => {
  //         const data = new Uint8Array(event.target.result);
  //         const pdf: PDFDocumentProxy = await PDFJS.getDocument(data).promise;
  //         setfullData((ps: any) => ({ ...ps, files: [...ps.files, { name: curFile?.name ?? i, fileId, index: i, totalPages: pdf?.numPages ?? 5 }] }))
  //         for (let index = 0; index < pdf.numPages; index++) {
  //           await processSinglePage(index, pdf, i, fileId, ar)
  //         }
  //       }
  //       reader.readAsArrayBuffer(curFile);
  //     }
  //   } catch (error) {
  //     console.log(error, " Error while processing single file.");
  //   }
  // }

  const [fileLoading, setfileLoading] = useState(false);
  const [fileState, setfileState] = useState<
    {
      name: string;
      status: 'uploading' | 'processing' | 'failed' | 'done';
      uploadProgress: number;
    }[]
  >([]);
  console.log(fileState, ' ===> log to filestate change');
  // const processSingleFileNew = async (i: any, ar: any) => {
  //   const curFile = ar[i]
  //   setfileState(ps => ([...ps, { name: curFile?.name, status: 'uploading', uploadProgress: 0 }]))
  //   try {
  //     console.log(curFile, " ===> Current file happening here")

  //     const formData = new FormData();
  //     formData.append('pdfFiles', curFile);
  //     formData.append('id', `${edit_id}`)
  //     //https://api.schesti.com/api/takeoff-summary/processFiles
  //     // const res = await takeoffSummaryService.httpProcessFiles(formData)

  //     //axios.defaults!.headers!['Authorization'] = `Bearer ${token}`
  //     await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/takeoff-summary/processFiles`, formData,
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         },
  //         onUploadProgress: (progressEvent) => {
  //           if (progressEvent?.total && progressEvent?.loaded) {
  //             // Calculate the upload progress percentage
  //             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //             console.log(`Upload progress: ${progress}%`);
  //             setfileState((ps) => {
  //               return ps.map(i => {
  //                 if (i.name == curFile?.name) {
  //                   return { ...i, uploadProgress: progress }
  //                 } else {
  //                   return i
  //                 }
  //               })
  //             })
  //             if (progress > 99) {
  //               setfileState((ps) => {
  //                 return ps.map(i => {
  //                   if (i.name == curFile?.name) {
  //                     return { ...i, status: 'processing' }
  //                   } else {
  //                     return i
  //                   }
  //                 })
  //               })
  //             }
  //           }
  //         },
  //       }
  //     )
  //     setfileState((ps) => {
  //       return ps.map(i => {
  //         if (i.name == curFile?.name) {
  //           return { ...i, status: 'done' }
  //         } else {
  //           return i
  //         }
  //       })
  //     })
  //   } catch (error) {
  //     console.log(error, " Error while processing single file.");
  //     setfileState((ps) => {
  //       return ps.map(i => {
  //         if (i.name == curFile?.name) {
  //           return { ...i, status: 'failed' }
  //         } else {
  //           return i
  //         }
  //       })
  //     })
  //   }
  // }

  const processSingleFileNew = async (i: any, ar: any) => {
    const curFile = ar[i];
    setfileState((ps) => [
      ...ps,
      { name: curFile?.name, status: 'uploading', uploadProgress: 0 },
    ]);
    try {
      console.log(curFile, ' ===> Current file happening here');

      //https://api.schesti.com/api/takeoff-summary/processFiles
      // const res = await takeoffSummaryService.httpProcessFiles(formData)

      //axios.defaults!.headers!['Authorization'] = `Bearer ${token}`
      const url = await new AwsS3(
        curFile,
        'documents/take-off/'
      ).getS3URLWithProgress((progress) => {
        // calculate progress upto 100%
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setfileState((ps) => {
          return ps.map((i) => {
            if (i.name == curFile?.name) {
              return { ...i, uploadProgress: percent };
            } else {
              return i;
            }
          });
        });
        if (percent > 99) {
          setfileState((ps) => {
            return ps.map((i) => {
              if (i.name == curFile?.name) {
                return { ...i, status: 'processing' };
              } else {
                return i;
              }
            });
          });
        }
      });

      const formData = new FormData();
      formData.append('s3PdfUrl', url);
      formData.append('id', `${edit_id}`);
      // const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/takeoff-summary/processFiles`, formData,
      //     {
      //         headers: {
      //             'Authorization': `Bearer ${token}`,
      //             'Content-Type': 'multipart/form-data'
      //         },
      //         timeout: 3600000,
      //         onUploadProgress: (progressEvent) => {
      //             if (progressEvent?.total && progressEvent?.loaded) {
      //                 // Calculate the upload progress percentage
      //                 const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //                 console.log(`Upload progress: ${progress}%`);
      //                 setfileState((ps) => {
      //                     return ps.map(i => {
      //                         if (i.name == curFile?.name) {
      //                             return { ...i, uploadProgress: progress }
      //                         } else {
      //                             return i
      //                         }
      //                     })
      //                 })
      //                 if (progress > 99) {
      //                     setfileState((ps) => {
      //                         return ps.map(i => {
      //                             if (i.name == curFile?.name) {
      //                                 return { ...i, status: 'processing' }
      //                             } else {
      //                                 return i
      //                             }
      //                         })
      //                     })
      //                 }
      //             }
      //         },
      //     }
      // )
      await takeoffSummaryService.httpProcessFiles(formData);
      setfileState((ps) => {
        return ps.map((i) => {
          if (i.name == curFile?.name) {
            return { ...i, status: 'done' };
          } else {
            return i;
          }
        });
      });
    } catch (error) {
      console.log(error, ' Error while processing single file.');
      setfileState((ps) => {
        return ps.map((i) => {
          if (i.name == curFile?.name) {
            return { ...i, status: 'failed' };
          } else {
            return i;
          }
        });
      });
    }
  };

  const startProcess = async (ar: any) => {
    setisLoading(true);
    if (Array.isArray(ar) && ar?.length > 0) {
      try {
        setfileLoading(true);
        for (let i = 0; i < ar?.length; i++) {
          // await processSingleFile(i, ar)
          await processSingleFileNew(i, ar);
        }
        // setisLoading(false)
        setfileLoading(false);
      } catch (error) {
        console.log(error, ' Error startProcess');
        setisLoading(false);
        setfileLoading(false);
      }
    }
  };

  const makeApiCall = async () => {
    try {
      setisApiCalling(true);
      setisLoading(true);
      const newupdatedMeasurements: any =
        await takeoffSummaryService.httpUpdateTakeoffSummary({
          id: takeOff?._id,
          //@ts-ignore
          data: {
            pages: [
              ...(Array.isArray(takeOff?.pages) ? takeOff.pages : []),
              ...(Array.isArray(fullData?.pages) ? fullData.pages : []),
            ],
            files: [
              ...(Array.isArray(takeOff?.files) ? takeOff.files : []),
              ...(Array.isArray(fullData?.files) ? fullData.files : []),
            ],
          },
        });
      console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
      settakeOff(newupdatedMeasurements?.data);
      setisApiCalling(false);
      setfullData({
        files: [],
        pages: [],
      });
      setselectedFiles([]);
      setprogressModalOpen(false);
      toast.success('Added Successfully!');
    } catch (error) {
      setisApiCalling(false);
      console.log(error, ' ===> Error while making api call');
      setisLoading(false);
    }
  };

  // const addFileToWorkspace = () => {
  //   if (Array.isArray(fullData?.pages) && fullData?.pages?.length > 0) {
  //     if (fullData?.files?.every((i: any) => {
  //       return i?.totalPages == fullData?.pages?.filter((pg: any) => (i?.fileId == pg?.fileId))?.length
  //     })) {
  //       // setisLoading(false)
  //       //   setshouldContinue(true)
  //       // toast.success('Ready to go.')
  //       makeApiCall()
  //     } else {
  //       toast.error(`Please wait until loading files.`)
  //     }
  //   } else {
  //     toast.error(`Please select atleast one file to continue.`)
  //   }
  // }
  /////////////New TakeOff States///////////////////////

  /////////////New TakeOff States///////////////////////
  // const [draw, setDraw] = useState<DrawInterface | any>({
  //   line: [],
  //   area: [],
  //   volume: [],
  //   count: [],
  //   dynamic: [],
  //   scale: [],
  //   perimeter: []
  // });
  const [draw, setDraw] = useState<any>({});
  const [takeOff, settakeOff] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [pdMeasurements, setpdMeasurements] = useState(null)
  const [selectedTakeOffTab, setselectedTakeOffTab] = useState<
    'overview' | 'page' | 'file'
  >('overview');
  const [selectedPage, setselectedPage] = useState<any>({});
  const [selectedPagesList, setselectedPagesList] = useState<any>([]);
  /////////////New TakeOff States///////////////////////
  const [leftOpened, setleftOpened] = useState<boolean>(true);
  const urlSearch: any = new URLSearchParams(window.location.search);
  console.log(
    window.location,
    urlSearch,
    urlSearch.get('edit_id'),
    ' Edit Data Edit Data'
  );
  const router = useRouter();
  const params = useSearchParams();
  const edit_id = params.get('edit_id');
  ////categories
  // const [allCategories, setallCategories] = useState<any>([])
  // const [selectedCategory, setselectedCategory] = useState<any>("")
  // const [inputtxt, setinputtxt] = useState<any>("")
  ////
  const [tool, setTool] = useState<ScaleInterface>({ selected: 'scale' });
  const [countType, setcountType] = useState<string>('');
  useEffect(() => {
    if (tool.selected != 'count') {
      setcountType('');
    }
  }, [tool]);
  const [showModal, setShowModal] = useState(false);
  const [border, setBorder] = useState<number>(4);
  const [color, setColor] = useState<string>('#1677ff');
  const [unit, setUnit] = useState<number>(14);
  const [depth, setDepth] = useState<number>(1);
  const [drawScale, setdrawScale] = useState<boolean>(false);
  const [scaleLine, setscaleLine] = useState<any>({});
  const [takeOffMsr, settakeOffMsr] = useState<any[]>([]);
  const [sideTabs, setsideTabs] = useState<'Plans' | 'TakeOff' | 'WBS'>(
    'Plans'
  );
  const [measurements, setMeasurements] =
    useState<Measurements>(defaultMeasurements);

  console.log(measurements, ' measurements changed');
  console.log(
    groupDataForFileTable(takeOff?.pages),
    takeOff?.pages,
    ' ===> New Data to map'
  );
  useEffect(() => {
    if (takeOff?.measurements) {
      console.log(
        measurementsTableData(takeOff),
        ' =====> measurementsTableData measurementsTableData'
      );
    }
  }, [takeOff]);

  const [tableLoading, settableLoading] = useState<any>(false);
  const updateTableChangeInTakeOff = async (
    pageId: string,
    type: any,
    dateTime: any,
    keyToUpdate: string,
    valueToUpdate: any
  ) => {
    console.log(
      pageId,
      type,
      dateTime,
      keyToUpdate,
      valueToUpdate,
      'Update Run'
    );
    if (pageId && type && dateTime && keyToUpdate && valueToUpdate) {
      try {
        let tempTakeOff = takeOff;
        let slpg = tempTakeOff?.measurements[pageId];
        if (slpg) {
          settableLoading(true);
          slpg = {
            ...slpg,
            [type]: slpg[type]?.map((it: any) => {
              if (
                new Date(it.dateTime).valueOf() === new Date(dateTime).valueOf()
              ) {
                return { ...it, [keyToUpdate]: valueToUpdate };
              } else {
                return it;
              }
            }),
          };
          tempTakeOff.measurements[pageId] = slpg;
          // console.log(tempTakeOff)
          const newupdatedMeasurements: any =
            await takeoffSummaryService.httpUpdateTakeoffSummary({
              id: takeOff?._id,
              //@ts-ignore
              data: { measurements: tempTakeOff.measurements },
            });
          console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
          settakeOff(newupdatedMeasurements?.data);
          settableLoading(false);
          // setDraw(
          //   newupdatedMeasurements?.data?.measurements[
          //   `${selectedPage?.pageId}`
          //   ]
          // );
        }
      } catch (error) {
        settableLoading(false);
        console.log(error, ' ===> Error while updating table data');
      }
    }
  };

  const updateTableCategory = async (
    pageId: string,
    type: any,
    dateTime: any,
    category: string,
    subcategory: string | null
  ) => {
    console.log(pageId, type, dateTime, category, subcategory, 'Update Run');
    if (pageId && type && dateTime && category) {
      try {
        let tempTakeOff = takeOff;
        let slpg = tempTakeOff?.measurements[pageId];
        if (slpg) {
          settableLoading(true);
          slpg = {
            ...slpg,
            [type]: slpg[type]?.map((it: any) => {
              if (
                new Date(it.dateTime).valueOf() === new Date(dateTime).valueOf()
              ) {
                return { ...it, category, subcategory: subcategory ?? null };
              } else {
                return it;
              }
            }),
          };
          tempTakeOff.measurements[pageId] = slpg;
          // console.log(tempTakeOff)
          const newupdatedMeasurements: any =
            await takeoffSummaryService.httpUpdateTakeoffSummary({
              id: takeOff?._id,
              //@ts-ignore
              data: { measurements: tempTakeOff.measurements },
            });
          console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
          settakeOff(newupdatedMeasurements?.data);
          settableLoading(false);
          // setDraw(
          //   newupdatedMeasurements?.data?.measurements[
          //   `${selectedPage?.pageId}`
          //   ]
          // );
        }
      } catch (error) {
        settableLoading(false);
        console.log(error, ' ===> Error while updating table data');
      }
    }
  };

  const updateColorSizes = async (keyToUpdate: string, valueToUpdate: any) => {
    if (!selectedPage || !selectedShape) {
      return;
    }
    // const pageId = selectedPage?.pageId;
    const [type, shapeNumber, _id] = selectedShape.split('-');
    console.log(type, shapeNumber);
    settakeOffMsr((ps) =>
      ps.map((i) => {
        if (i?._id == _id) {
          handleMsrOprations('update', {
            id: _id,
            data: { ...i, [keyToUpdate]: valueToUpdate },
          });
          return { ...i, [keyToUpdate]: valueToUpdate };
        } else {
          return i;
        }
      })
    );
    // console.log(
    //   pageId,
    //   type,
    //   shapeNumber,
    //   keyToUpdate,
    //   valueToUpdate,
    //   'bottom bar Update Run'
    // );
    // if (pageId && type && shapeNumber && keyToUpdate && valueToUpdate) {
    //   try {
    //     let tempTakeOff = takeOff;
    //     let slpg = tempTakeOff?.measurements[pageId];
    //     if (slpg) {
    //       settableLoading(true);
    //       slpg = {
    //         ...slpg,
    //         [type]: slpg[type]?.map((it: any, index: number) => {
    //           if (index === +shapeNumber) {
    //             return { ...it, [keyToUpdate]: valueToUpdate };
    //           } else {
    //             return it;
    //           }
    //         }),
    //       };
    //       tempTakeOff.measurements[pageId] = slpg;
    //       // console.log(tempTakeOff)
    //       const newupdatedMeasurements: any =
    //         await takeoffSummaryService.httpUpdateTakeoffSummary({
    //           id: takeOff?._id,
    //           //@ts-ignore
    //           data: { measurements: tempTakeOff.measurements },
    //         });
    //       console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
    //       settakeOff(newupdatedMeasurements?.data);
    //       settableLoading(false);
    //       // setDraw(
    //       //   newupdatedMeasurements?.data?.measurements[
    //       //   `${selectedPage?.pageId}`
    //       //   ]
    //       // );
    //     }
    //   } catch (error) {
    //     settableLoading(false);
    //     console.log(error, ' ===> Error while updating table data');
    //   }
    // }
  };

  const deleteTableChangeInTakeOff = async (
    pageId: string,
    type: any,
    dateTime: any
  ) => {
    // console.log(pageId, type, dateTime, keyToUpdate, valueToUpdate,'delete Run')
    if (pageId && type && dateTime) {
      try {
        let tempTakeOff = takeOff;
        let slpg = tempTakeOff?.measurements[pageId];
        if (slpg) {
          settableLoading(true);
          slpg = {
            ...slpg,
            // [type]: slpg[type]?.map((it: any) => {
            //   if (new Date(it.dateTime).valueOf() === new Date(dateTime).valueOf()) {
            //     return { ...it, [keyToUpdate]: valueToUpdate };
            //   } else {
            //     return it
            //   };
            // })
            [type]: slpg[type]?.filter((it: any) => {
              return (
                new Date(it.dateTime).valueOf() != new Date(dateTime).valueOf()
              );
              // if (new Date(it.dateTime).valueOf() === new Date(dateTime).valueOf()) {
              //   return { ...it, [keyToUpdate]: valueToUpdate };
              // } else {
              //   return it
              // };
            }),
          };
          tempTakeOff.measurements[pageId] = slpg;
          // console.log(tempTakeOff)
          const newupdatedMeasurements: any =
            await takeoffSummaryService.httpUpdateTakeoffSummary({
              id: takeOff?._id,
              //@ts-ignore
              data: { measurements: tempTakeOff.measurements },
            });
          console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
          settakeOff(newupdatedMeasurements?.data);
          settableLoading(false);
          // setDraw(
          //   newupdatedMeasurements?.data?.measurements[
          //   `${selectedPage?.pageId}`
          //   ]
          // );
        }
      } catch (error) {
        settableLoading(false);
        console.log(error, ' ===> Error while updating table data');
      }
    }
  };
  const handleMenuClick = async (
    key: any,
    item: any,
    newName: string = '',
    comment?: any
  ) => {
    const takeOffTemp = takeOff;
    const page = takeOffTemp?.pages?.find(
      (i: any) => i?.pageId == item?.pageId
    );
    const pageInd = takeOffTemp?.pages?.findIndex(
      (i: any) => i?.pageId == item?.pageId
    );
    console.log(item, key, page, pageInd, ' ===> clicked dropdown item');
    let pages = takeOffTemp?.pages;
    if (page) {
      if (key == 'duplicate') {
        const duplicatedPage = {
          ...page,
          pageId: `${new Date().getTime()}`,
          name: page?.name + ' (COPY)',
        };
        pages?.splice(pageInd + 1, 0, duplicatedPage);
      } else if (key == 'delete') {
        pages = pages?.filter((i: any) => i?.pageId != item?.pageId);
      } else if (key == 'rename') {
        pages = pages?.map((i: any) => {
          if (i?.pageId == item?.pageId) {
            return { ...i, name: newName };
          } else {
            return i;
          }
        });
      } else if (key == 'comment') {
        pages = pages?.map((i: any) => {
          if (i?.pageId == item?.pageId) {
            return {
              ...i,
              comments: [
                ...(item?.comments && Array.isArray(item?.comments)
                  ? item.comments
                  : []),
                comment,
              ],
            };
          } else {
            return i;
          }
        });
      }
      try {
        settableLoading(true);
        const newupdatedMeasurements: any =
          await takeoffSummaryService.httpUpdateTakeoffSummary({
            id: takeOff?._id,
            //@ts-ignore
            data: { pages },
          });
        console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
        settakeOff(newupdatedMeasurements?.data);
        settableLoading(false);
      } catch (error) {
        settableLoading(false);
        console.log(error, ' ===> Error while updatind');
      }
    }
  };

  const menu = (item: any) => (
    <Menu
      onClick={({ key }) => handleMenuClick(key, item)}
      items={[
        {
          label: 'Duplicate',
          key: 'duplicate',
          icon: <CopyOutlined />,
        },
        {
          label: 'Delete',
          key: 'delete',
          icon: <DeleteOutlined />,
          danger: true,
        },
      ]}
    />
  );

  const plansColumn: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div
          onClick={() => {
            if (!record?.isParent) {
              const pg = takeOff?.pages?.find(
                (pgs: any) => pgs?.pageId == record?.pageId
              );
              console.log(record, 'selected thing');
              setselectedPage(pg);
              setselectedTakeOffTab('page');
              if (
                !selectedPagesList?.find(
                  (i: any) => i?.pageId == record?.pageId
                )
              ) {
                //@ts-ignore
                setselectedPagesList((ps: any) => [...ps, pg]);
              }
            }
          }}
          className="flex items-center h-full cursor-pointer justify-between"
        >
          <div>
            {record?.isParent == true ? (
              <FolderOutlined className="mr-2" />
            ) : (
              <FileOutlined className="mr-2" />
            )}
            {record?.isParent == true ? (
              text
            ) : (
              <EditableText
                className={'inline-block'}
                initialText={text}
                smallText={text?.slice(0, 30)}
                toolTip={'double click to rename.'}
                onPressEnter={(value) => {
                  handleMenuClick('rename', record, value);
                }}
              />
            )}
          </div>
          {record?.isParent != true && (
            <Dropdown overlay={menu(record)} trigger={['click']}>
              <MoreOutlined
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="cursor-pointer text-[20px]"
              />
            </Dropdown>
          )}
        </div>
      ),
    },
  ];

  const categoryColumns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'category',
      width: 60,
      className: '!pr-0',
      render: (text, record) => (
        <div
          className={`${record?.isParent || record?.isSubParent ? 'text-[12px]' : ''} flex items-center h-full cursor-pointer ${selectedCate == text && record?.isParent ? '!bg-lavenderPurpleReplica !text-white !p-1 !rounded-md' : ''} ${selectedSubCate == record?.subcategory && record?.isSubParent ? '!bg-lavenderPurpleReplica !text-white !p-1 !rounded-md' : ''}`}
        >
          {record?.isParent ? (
            <span className="font-extrabold">
              {text?.slice(0, 7)}
              {selectedCate == text ? (
                <Button
                  size="small"
                  className="border-2 rounded-full ml-2"
                  onClick={() => {
                    setselectedCate(null);
                    setselectedSubCate(null);
                  }}
                >
                  unselect
                </Button>
              ) : (
                <Button
                  size="small"
                  className="border-2 rounded-full ml-2"
                  onClick={() => {
                    setselectedCate(text);
                  }}
                >
                  select
                </Button>
              )}
              {/* <Checkbox checked={selectedCate == text} onChange={(e) => {
            if (e.target.checked) { setselectedCate(text); }
            else { setselectedCate(null); setselectedSubCate(null) }
          }} /> */}
            </span>
          ) : record?.isSubParent ? (
            <span className="font-extrabold">
              {record?.subcategory?.slice(0, 7)}
              {selectedSubCate == record?.subcategory ? (
                <Button
                  size="small"
                  className="border-2 rounded-full ml-2"
                  onClick={() => {
                    setselectedCate(null);
                    setselectedSubCate(null);
                  }}
                >
                  unselect
                </Button>
              ) : (
                <Button
                  size="small"
                  className="border-2 rounded-full ml-2"
                  onClick={() => {
                    setselectedCate(text);
                    setselectedSubCate(record?.subcategory);
                  }}
                >
                  select
                </Button>
              )}
              {/* <Checkbox checked={selectedSubCate == record?.subcategory} onChange={(e) => {
            if (e.target.checked) { setselectedCate(text); setselectedSubCate(record?.subcategory) }
            else { setselectedCate(null); setselectedSubCate(null) }
          }} /> */}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <EditableText
                initialText={record?.projectName}
                smallText={record?.projectName?.slice(0, 10) + '...'}
                onPressEnter={(value) => {
                  updateTableChangeInTakeOff(
                    record?.pageId,
                    record?.type,
                    record?.dateTime,
                    'projectName',
                    value
                  );
                }}
                toolTip={
                  takeOff?.pages?.find(
                    (pg: any) => pg?.pageId == record?.pageId
                  )?.name +
                  `(${takeOff?.pages?.find((pg: any) => pg?.pageId == record?.pageId)?.file?.name})`
                }
              />
            </span>
          )}
        </div>
      ),
    },
    // {
    //   title: 'Category',
    //   dataIndex: 'category',
    //   width: 150,
    //   className: '!pr-0',
    //   render: (text, record) => (
    //     <div
    //       className="flex items-center h-full cursor-pointer">
    //       {(record?.isParent || record?.isSubParent) ? <></> : <span className='flex items-center gap-1'><EditableText initialText={text} smallText={text?.slice(0, 15) + "..."} onPressEnter={(value) => { updateTableChangeInTakeOff(record?.pageId, record?.type, record?.dateTime, 'category', value) }} toolTip={takeOff?.pages?.find((pg: any) => (pg?.pageId == record?.pageId))?.name + `(${takeOff?.pages?.find((pg: any) => (pg?.pageId == record?.pageId))?.file?.name})`} /></span>}
    //     </div>
    //   ),
    // },
    // {
    //   title: 'SubCategory',
    //   dataIndex: 'subcategory',
    //   width: 150,
    //   className: '!pr-0',
    //   render: (text, record) => (
    //     <div
    //       className="flex items-center h-full cursor-pointer">
    //       {(record?.isParent || record?.isSubParent) ? <></> : <span className='flex items-center gap-1'><EditableText initialText={text} smallText={text?.slice(0, 15) + "..."} onPressEnter={(value) => { updateTableChangeInTakeOff(record?.pageId, record?.type, record?.dateTime, 'subcategory', value) }} toolTip={takeOff?.pages?.find((pg: any) => (pg?.pageId == record?.pageId))?.name + `(${takeOff?.pages?.find((pg: any) => (pg?.pageId == record?.pageId))?.file?.name})`} /></span>}
    //     </div>
    //   ),
    // },
    {
      title: 'ID',
      dataIndex: 'subcategory',
      width: 30,
      className: '!pr-0',
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent || record?.isSubParent ? (
            <></>
          ) : (
            <span className="flex items-center gap-1">
              {`${new Date(record?.dateTime)?.getTime()}`?.slice(-6)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'category',
      className: '!px-0',
      // key: 'category',
      width: 40,
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent || record?.isSubParent ? (
            <></>
          ) : (
            <span className="flex items-center gap-1">
              <Menu
                items={[
                  {
                    className: '!p-0',
                    key: 'category',
                    expandIcon: (
                      <EditOutlined className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 rounded-full p-1" />
                    ),
                    children: [
                      {
                        key: 'category',
                        label: 'category',
                        children: [
                          ...[
                            ...(Array.isArray(takeOff?.categories)
                              ? takeOff.categories
                              : []),
                          ].map((i: any) => ({
                            key: i,
                            label: i,
                            onClick: () => {
                              updateTableChangeInTakeOff(
                                record?.pageId,
                                record?.type,
                                record?.dateTime,
                                'category',
                                i
                              );
                            },
                          })),
                        ],
                      },
                      {
                        key: 'sub-category',
                        label: 'sub-category',
                        children: [
                          ...[
                            ...(Array.isArray(takeOff?.subCategories)
                              ? takeOff.subCategories
                              : []),
                          ].map((i: any) => ({
                            key: i,
                            label: i,
                            onClick: () => {
                              updateTableChangeInTakeOff(
                                record?.pageId,
                                record?.type,
                                record?.dateTime,
                                'subcategory',
                                i
                              );
                            },
                          })),
                        ],
                      },
                    ],
                  },
                ]}
              />

              <DeleteOutlined
                className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 rounded-full p-1"
                onClick={() => {
                  deleteTableChangeInTakeOff(
                    record?.pageId,
                    record?.type,
                    record?.dateTime
                  );
                }}
              />
            </span>
          )}
        </div>
      ),
    },
  ];

  const measurementsColumn: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      className: '!pr-0',
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent ? (
            text
          ) : (
            <span
              className="flex items-center gap-1"
              onClick={() => {
                if (record?.type == 'count' || record?.type == 'texts') {
                  return;
                }
                openShap(record);
                const pg = takeOff?.pages?.find(
                  (pgs: any) => pgs?.pageId == record?.pageId
                );
                if (pg) {
                  if (
                    record?.points &&
                    Array.isArray(record?.points) &&
                    record?.points?.length > 1
                  ) {
                    // setStageValues(record?.points[0]-100, record?.points[1]-100)
                  }
                  setselectedPage(pg);
                  setselectedTakeOffTab('page');
                  if (
                    !selectedPagesList?.find(
                      (i: any) => i?.pageId == pg?.pageId
                    )
                  ) {
                    //@ts-ignore
                    setselectedPagesList((ps: any) => [...ps, pg]);
                  }
                }
              }}
            >
              <ColorPicker
                onChangeComplete={(val) => {
                  updateTableChangeInTakeOff(
                    record?.pageId,
                    record?.type,
                    record?.dateTime,
                    record?.type == 'count' || record?.type == 'texts'
                      ? 'textColor'
                      : 'stroke',
                    val.toHexString()
                  );
                }}
                className="!w-[2px] !h-[2px] border-none"
                value={record?.stroke ?? record?.textColor}
              />{' '}
              <EditableText
                initialText={record?.projectName}
                smallText={record?.projectName?.slice(0, 12) + '...'}
                onPressEnter={(value) => {
                  updateTableChangeInTakeOff(
                    record?.pageId,
                    record?.type,
                    record?.dateTime,
                    'projectName',
                    value
                  );
                }}
                toolTip={
                  takeOff?.pages?.find(
                    (pg: any) => pg?.pageId == record?.pageId
                  )?.name +
                  `(${takeOff?.pages?.find((pg: any) => pg?.pageId == record?.pageId)?.file?.name})`
                }
              />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Sheet Number',
      dataIndex: 'pageLabel',
      width: 70,
      className: '!pr-0',
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent ? (
            <></>
          ) : (
            <span className="flex items-center gap-1">
              {takeOff?.pages?.find((pp: any) => pp?.pageId == record?.pageId)
                ?.pageNum ?? ''}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Measurement',
      dataIndex: 'text',
      width: 120,
      className: '!pr-0',
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent ? (
            <></>
          ) : (
            <span className="">{text ?? record?.text ?? ''}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'category',
      width: 200,
      className: '!pr-0',
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent ? (
            <></>
          ) : (
            <span className="flex items-center gap-1">
              {<Avatar icon={<UserOutlined />} />}
              <span
                data-tooltip={`${record?.user?.firstName ?? record?.user?.email}`}
              >
                {(record?.user?.firstName ?? record?.user?.email ?? '')?.slice(
                  0,
                  17
                ) + '...'}
              </span>
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'category',
      width: 100,
      className: '!pr-0',
      render: (text, record) => (
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent ? (
            <></>
          ) : (
            <span className="flex items-center gap-1">
              {new Date(record?.dateTime)?.toLocaleDateString()}
            </span>
          )}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: '',
      width: 50,
      // key: 'category',
      render: (text, record) => (
        // <div
        //   className="flex items-center h-full cursor-pointer">
        //   {record?.isParent ? <></> : <span className='flex items-center gap-1'><MoreOutlined /></span>}
        // </div>
        <div className="flex items-center h-full cursor-pointer">
          {record?.isParent ? (
            <></>
          ) : (
            <span className="flex items-center gap-2">
              <Popover
                content={
                  <>
                    {Array.isArray(takeOff?.categories) &&
                      takeOff.categories.length > 0 &&
                      takeOff.categories.map((cat: string) => {
                        return (
                          <div key={cat}>
                            <h3
                              onClick={() => {
                                updateTableCategory(
                                  record?.pageId,
                                  record?.type,
                                  record?.dateTime,
                                  cat,
                                  null
                                );
                              }}
                              className={`font-bold my-1 cursor-pointer hover:bg-lavenderPurpleReplica hover:bg-opacity-15 p-1 rounded-lg px-2 ${record?.category == cat ? 'bg-lavenderPurpleReplica bg-opacity-20' : ''}`}
                            >
                              {cat}
                            </h3>
                            {Array.isArray(takeOff?.subCategories) &&
                              takeOff.subCategories
                                .filter((i: string) => i?.includes(cat))
                                .map((subcat: string) => {
                                  return (
                                    <li
                                      key={subcat}
                                      onClick={() => {
                                        updateTableCategory(
                                          record?.pageId,
                                          record?.type,
                                          record?.dateTime,
                                          cat,
                                          subcat
                                        );
                                      }}
                                      className={`list-disc my-1 cursor-pointer hover:bg-lavenderPurpleReplica hover:bg-opacity-15 p-1 px-2 rounded-lg ${record?.subcategory == subcat ? 'bg-lavenderPurpleReplica bg-opacity-20' : ''}`}
                                    >
                                      {subcat?.split('-')[0]}
                                    </li>
                                  );
                                })}
                          </div>
                        );
                      })}
                  </>
                }
                title="Edit WBS"
                trigger="click"
              >
                <EditOutlined className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 rounded-full p-1" />
              </Popover>
              <DeleteOutlined
                className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 rounded-full p-1"
                onClick={() => {
                  deleteTableChangeInTakeOff(
                    record?.pageId,
                    record?.type,
                    record?.dateTime
                  );
                }}
              />
            </span>
          )}
        </div>
      ),
    },
  ];

  const { handleScaleData } = useContext(ScaleContext) as ScaleDataContextProps;
  const { uploadFileData } = useContext(
    UploadFileContext
  ) as UploadFileContextProps;

  // const { reportData } = useContext(
  //   ReportDataContext
  // ) as ReportDataContextProps;
  const { editData } = useContext(EditContext);

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
      getTakeoffMsr();
    } else {
      router.push('/take-off');
    }
  }, [edit_id]);

  useEffect(() => {
    const newData: any = {};
    for (let i = 1; i <= uploadFileData.length; i++) {
      newData[i] = {
        xScale: `1in=1in`,
        yScale: `1in=1in`,
        precision: '1',
      };
    }
    handleScaleData(newData);
  }, []);
  useEffect(() => {
    console.log(measurements, ' ===> measurements');
  }, [measurements]);
  // const hadleNewDrawing = () => {
  //   try {

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const file = {
    src: 'https://schesti-dev.s3.eu-north-1.amazonaws.com/2024/documents/takeoff-reports/4264282fef9d5a5191b025fd29daeb59',
    height: 842.04,
    width: 595.56,
  };

  const updateMeasurements = async (newMeasurements: any) => {
    try {
      let updatedMeasurmentsR: any = takeOff?.measurements
        ? { ...takeOff?.measurements }
        : {};
      updatedMeasurmentsR[`${selectedPage?.pageId}`] = newMeasurements;
      const newupdatedMeasurements: any =
        await takeoffSummaryService.httpUpdateTakeoffSummary({
          id: takeOff?._id,
          //@ts-ignore
          data: { measurements: updatedMeasurmentsR },
        });
      console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
      settakeOff(newupdatedMeasurements?.data);
      // if(selectedPage?.pageId){

      // }
    } catch (error) {
      console.log(error, ' ===> Error Occured while measuring');
    }
  };

  const updateCategories = async (
    categories: string[],
    subCategories: any[]
  ) => {
    try {
      settableLoading(true);
      const newupdatedMeasurements: any =
        await takeoffSummaryService.httpUpdateTakeoffSummary({
          id: takeOff?._id,
          //@ts-ignore
          data: { categories, subCategories },
        });
      console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
      settakeOff(newupdatedMeasurements?.data);
      settableLoading(false);
      // if(selectedPage?.pageId){

      // }
    } catch (error) {
      settableLoading(false);
      console.log(error, ' ===> Error Occured while measuring');
    }
  };

  const handleSetScale = async (
    scale: { xScale: any; yScale: any; precision: any },
    optionsValue: string
  ) => {
    try {
      let pgs = takeOff?.pages?.slice();
      if (optionsValue == '1') {
        if (selectedPage) {
          pgs = pgs.map((i: any) => {
            if (selectedPage?.pageId == i?.pageId) {
              return { ...i, scale };
            } else {
              return i;
            }
          });
        }
        // } else if (optionsValue == '1-0') {
      } else if (optionsValue.includes('1-')) {
        pgs = pgs.map((i: any) => {
          return { ...i, scale };
        });
      }
      console.log(scale, optionsValue, pgs, ' scale in handleset scale');

      const newupdatedMeasurements: any =
        await takeoffSummaryService.httpUpdateTakeoffSummary({
          id: takeOff?._id,
          //@ts-ignore
          data: {
            pages: pgs?.length == takeOff?.pages?.length ? pgs : takeOff?.pages,
          },
        });
      console.log(newupdatedMeasurements, ' ==> newupdatedMeasurements');
      settakeOff(newupdatedMeasurements?.data);
      if (
        selectedPage?.pageId &&
        newupdatedMeasurements?.data?.pages?.find(
          (i: any) => i?.pageId == selectedPage?.pageId
        )
      ) {
        setselectedPage(
          newupdatedMeasurements?.data?.pages?.find(
            (i: any) => i?.pageId == selectedPage?.pageId
          )
        );
        setselectedPagesList((ps: any) =>
          ps.map((pg: any) => {
            return newupdatedMeasurements?.data?.pages?.find(
              (i: any) => i?.pageId == pg?.pageId
            );
          })
        );
      }
    } catch (error) {
      console.log(error, ' ===> Error Occured while measuring');
    }
  };

  useEffect(() => {
    console.log(draw, 'drawdrawdrawdrawdrawdrawdrawdrawdrawdraw');
    // updateMeasurements(draw);
  }, [draw]);

  useEffect(() => {
    // if (
    //   selectedPage &&
    //   takeOff?.measurements &&
    //   takeOff?.measurements[`${selectedPage?.pageId}`]
    // ) {
    //   console.log(
    //     selectedPage,
    //     takeOff?.measurements[`${selectedPage?.pageId}`],
    //     selectedPage?.pageId,
    //     takeOff?.measurements,
    //     ' ===> Selected Page in UseEffect'
    //   );
    //   if (draw != takeOff?.measurements[`${selectedPage?.pageId}`]) {
    //     setDraw(takeOff?.measurements[`${selectedPage?.pageId}`]);
    //   }
    // } else {
    //   setDraw({});
    // }
    if (selectedPage && selectedPage?.pageId && Array.isArray(takeOffMsr)) {
      setDraw(getPageMsr(selectedPage?.pageId, takeOffMsr));
    }
  }, [selectedPage, takeOffMsr]);

  const [sideSearch, setsideSearch] = useState<string>('');
  const [tableColumns, settableColumns] = useState<any>([]);
  const [tableData, settableData] = useState<any>([]);
  const [scalUnits, setscalUnits] = useState<'feet' | 'meter'>('feet');

  // WBS States And Functions
  const [categoryList, setcategoryList] = useState<any>([]);
  const [categoryText, setcategoryText] = useState<any>('');
  const [selectedCate, setselectedCate] = useState<any>(null);
  useEffect(() => {
    setisWBS(false);
  }, [sideTabs]);

  const [subcategoryList, setsubcategoryList] = useState<any>([]);
  const [subcategoryText, setsubcategoryText] = useState<any>('');
  const [selectedSubCate, setselectedSubCate] = useState<any>(null);

  const [isWBS, setisWBS] = useState<any>(false);
  // WBS States And Functions
  useEffect(() => {
    console.log(measurementsTableData(takeOff ?? {}), ' ===> Data to view');
    if (sideTabs == 'Plans') {
      settableColumns(plansColumn);
      if (sideSearch && sideSearch?.length > 0) {
        groupDataForFileTable(
          takeOff?.pages?.filter((i: any) =>
            i?.name
              ?.toLocaleLowerCase()
              ?.includes(sideSearch?.toLocaleLowerCase())
          )
        );
      } else {
        settableData(groupDataForFileTable(takeOff?.pages));
      }
    } else if (sideTabs == 'TakeOff') {
      settableColumns(measurementsColumn);
      settableData(measurementsTableData1(takeOff ?? {}, sideSearch));
    } else if (sideTabs == 'WBS') {
      settableColumns(categoryColumns);
      settableData(measurementsTableData(takeOff ?? {}, sideSearch));
    }
  }, [
    sideTabs,
    takeOff,
    sideSearch,
    categoryList,
    subcategoryList,
    selectedCate,
    selectedSubCate,
  ]);

  /////Image Loadings//////////////
  const [loadedImages, setLoadedImages] = useState<any>([]);

  const handleImageLoad = (index: any) => {
    setLoadedImages((prevLoadedImages: any) => [...prevLoadedImages, index]);
  };

  const isImgLoading = (index: any) => !loadedImages.includes(index);

  const [reportModal, setreportModal] = useState<boolean>(false);
  const {
    stageScale,
    stageX,
    stageY,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    handleDragEnd,
    // setStageValues
  } = useWheelZoom({
    compHeight: selectedPage.height || 600,
    compWidth: selectedPage.width || 600,
  });
  const [fillColor, setfillColor] = useState('rgba(255, 255, 0, 0.2)');
  const [textColor, settextColor] = useState('red');
  // const handleZoomIn = ()=>{}
  // const handleZoomOut = () => {}
  const handleRoomColorChange = (rgbaString: string) => {
    setfillColor(rgbaString);
  };

  const { user } = useSelector(selectUser);
  const handleAddComment = (comment: string) => {
    if (comment && selectedPage) {
      const cm = { comment, user };
      handleMenuClick('comment', selectedPage, '', cm);
      setselectedPage((ps: any) => ({
        ...ps,
        comments: [
          ...(ps?.comments && Array.isArray(ps?.comments) ? ps.comments : []),
          cm,
        ],
      }));
    }
  };

  //Download Markup functions
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
    //         reportData = [
    //           ...reportData,
    //           ...(takeOff?.measurements[key][type] &&
    //             Array.isArray(takeOff?.measurements[key][type]) &&
    //             takeOff?.measurements[key][type]?.length > 0
    //             ? takeOff.measurements[key][type].map((arrit: any) => {
    //               return {
    //                 ...arrit,
    //                 pageId: key,
    //                 type,
    //                 pageData: takeOff?.pages?.find(
    //                   (pg: any) => pg?.pageId == key
    //                 ),
    //                 pageLabel: takeOff?.pages?.find(
    //                   (pg: any) => pg?.pageId == key
    //                 )?.pageNum,
    //                 color: arrit?.stroke,
    //                 config: arrit,
    //               };
    //             })
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
    console.log(reportData1, ' ===> Take offs reportData');
    return reportData1;
  };
  // const getNumberFromText = (tx:string) => {
  //   if(tx && `${tx}`?.length>0){
  //     let txtArr = `${tx}`.split('')
  //     let retArr = '';
  //     for(let i = 0; i<txtArr?.length; i++){
  //       if(txtArr[i] == '.'){
  //         retArr += txtArr[i]
  //       }else if(!isNaN(Number(txtArr[i]))){
  //         retArr += txtArr[i]
  //       }
  //     }
  //     return Number(retArr)?.toFixed(2)
  //   }else{
  //     return tx
  //   }
  // }
  //@ts-ignore
  const counterImage = new Image();
  counterImage.src = '/count-draw.png';
  const {
    calculateMidpoint,
    calculatePolygonCenter,
    calcLineDistance,
    calculatePolygonArea,
    calculatePolygonVolume,
    calculatePolygonPerimeter,
  } = useDraw();

  const measurementsTableData1 = (takeOff: any, search?: string) => {
    let returningArr: any = [];
    if (
      takeOff?.measurements &&
      Object.keys(takeOff?.measurements) &&
      Object.keys(takeOff?.measurements)?.length > 0
    ) {
      Object.keys(takeOff?.measurements)?.map((key: any, ind: any) => {
        console.log(
          ind,
          takeOff?.measurements[key],
          ' =====> measurementsTableData measurementsTableData gotArr'
        );
        if (takeOff?.measurements[`${key}`]) {
          const gotArr = getSingleMeasurements(
            takeOff?.measurements[`${key}`],
            key
          );
          console.log(
            gotArr,
            takeOff?.measurements[`${key}`],
            ' =====> measurementsTableData measurementsTableData gotArr'
          );
          if (Array.isArray(gotArr)) {
            returningArr = [...returningArr, ...gotArr];
          }
        }
        return '';
      });
    }
    if (search && search?.length > 0) {
      returningArr = returningArr?.filter((i: any) => {
        return (
          i?.projectName
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase()) ||
          i?.category
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase()) ||
          i?.subcategory
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase())
        );
      });
    }
    console.log(
      returningArr,
      ' =====> measurementsTableData measurementsTableData all measurmetns in plan array'
    );
    if (returningArr?.length > 0) {
      //Reduce code for category
      returningArr = returningArr?.reduce((result: any, currentItem: any) => {
        const {
          category,
          subcategory,
          dateTime,
          points,
          projectName,
          stroke,
          strokeWidth,
          textUnit,
          id,
          lineCap,
          depth,
          x,
          y,
          user,
          type,
          pageId,
          text: tx,
        } = currentItem;
        //curpage and scaling runtime here
        const curmpage = takeOff?.pages?.find((i: any) => i?.pageId == pageId);
        const scale = curmpage?.scale ?? {
          xScale: `1in=1in`,
          yScale: `1in=1in`,
          precision: '1',
        };
        const text =
          type == 'line'
            ? calcLineDistance(points, scale, true)
            : type == 'perimeter'
              ? points?.length > 4
                ? calculatePolygonPerimeter(points, scale)
                : calcLineDistance(points, scale, true)
              : type == 'area'
                ? calculatePolygonArea(points, scale)?.toFixed(2)
                : type == 'volume'
                  ? calculatePolygonVolume(
                      points,
                      currentItem?.depth || 1,
                      scale
                    )?.toFixed(2)
                  : tx; //getNumberFromText(tx);
        // Check if there's already an entry with the same projectName and pageLabel
        const existingEntry = result?.find(
          (entry: any) => entry.category === category
        );
        if (existingEntry) {
          existingEntry?.children?.push({
            key: dateTime,
            category,
            subcategory,
            dateTime,
            points,
            projectName,
            stroke,
            strokeWidth,
            textUnit,
            id,
            lineCap,
            depth,
            x,
            y,
            user,
            isParent: false,
            type,
            pageId,
            text,
          });
        } else {
          result?.push({
            key: dateTime,
            isParent: true,
            category,
            subcategory,
            dateTime,
            points,
            projectName,
            stroke,
            strokeWidth,
            textUnit,
            id,
            lineCap,
            depth,
            x,
            y,
            user,
            type,
            pageId,
            text,
            children: [
              {
                key: dateTime,
                isParent: false,
                category,
                subcategory,
                dateTime,
                points,
                projectName,
                stroke,
                strokeWidth,
                textUnit,
                id,
                lineCap,
                depth,
                x,
                y,
                user,
                type,
                pageId,
                text,
              },
            ],
          });
        }
        return result;
      }, []);
    }
    return returningArr;
  };

  // const measurementsplanArray = (takeOff: any, search?: string): Array<any> => {
  //   let returningArr: any = [];
  //   if (
  //     takeOff?.measurements &&
  //     Object.keys(takeOff?.measurements) &&
  //     Object.keys(takeOff?.measurements)?.length > 0
  //   ) {
  //     Object.keys(takeOff?.measurements)?.map((key: any, ind: any) => {
  //       console.log(
  //         ind,
  //         takeOff?.measurements[key],
  //         ' =====> measurementsTableData measurementsTableData gotArr'
  //       );
  //       if (takeOff?.measurements[`${key}`]) {
  //         const gotArr = getSingleMeasurements(
  //           takeOff?.measurements[`${key}`],
  //           key
  //         );
  //         console.log(
  //           gotArr,
  //           takeOff?.measurements[`${key}`],
  //           ' =====> measurementsTableData measurementsTableData gotArr'
  //         );
  //         if (Array.isArray(gotArr)) {
  //           returningArr = [...returningArr, ...gotArr];
  //         }
  //       }
  //       return '';
  //     });
  //   }
  //   if (search && search?.length > 0) {
  //     returningArr = returningArr?.filter((i: any) => {
  //       return (
  //         i?.projectName
  //           ?.toLocaleLowerCase()
  //           ?.includes(search?.toLocaleLowerCase()) ||
  //         i?.category
  //           ?.toLocaleLowerCase()
  //           ?.includes(search?.toLocaleLowerCase()) ||
  //         i?.subcategory
  //           ?.toLocaleLowerCase()
  //           ?.includes(search?.toLocaleLowerCase())
  //       );
  //     });
  //   }
  //   console.log(
  //     returningArr,
  //     ' =====> measurementsTableData measurementsTableData all measurmetns in plan array'
  //   );
  //   return returningArr;
  // };

  const measurementsplanArray = (
    takeOffMsrArg: any,
    search?: string
  ): Array<any> => {
    let returningArr: any = takeOffMsrArg;
    // if (
    //   takeOff?.measurements &&
    //   Object.keys(takeOff?.measurements) &&
    //   Object.keys(takeOff?.measurements)?.length > 0
    // ) {
    //   Object.keys(takeOff?.measurements)?.map((key: any, ind: any) => {
    //     console.log(
    //       ind,
    //       takeOff?.measurements[key],
    //       ' =====> measurementsTableData measurementsTableData gotArr'
    //     );
    //     if (takeOff?.measurements[`${key}`]) {
    //       const gotArr = getSingleMeasurements(
    //         takeOff?.measurements[`${key}`],
    //         key
    //       );
    //       console.log(
    //         gotArr,
    //         takeOff?.measurements[`${key}`],
    //         ' =====> measurementsTableData measurementsTableData gotArr'
    //       );
    //       if (Array.isArray(gotArr)) {
    //         returningArr = [...returningArr, ...gotArr];
    //       }
    //     }
    //     return '';
    //   });
    // }
    if (search && search?.length > 0) {
      returningArr = returningArr?.filter((i: any) => {
        return (
          i?.projectName
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase()) ||
          i?.category
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase()) ||
          i?.subcategory
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase())
        );
      });
    }
    console.log(
      returningArr,
      ' =====> measurementsTableData measurementsTableData all measurmetns in plan array'
    );
    let newReturningArr: any[] = [];
    returningArr?.forEach((val: any) => {
      if (val?.type == 'count') {
        if (val?.category && val?.subcategory) {
          if (
            !newReturningArr?.some(
              (i: any) =>
                i?.countType == val?.countType &&
                i?.category == val?.category &&
                i?.subcategory == val?.subcategory &&
                i?.pageId == val?.pageId
            )
          ) {
            newReturningArr?.push(val);
          }
        } else if (val?.category && !val?.subcategory) {
          if (
            !newReturningArr?.some(
              (i: any) =>
                i?.countType == val?.countType &&
                i?.category == val?.category &&
                !val?.subcategory &&
                i?.pageId == val?.pageId
            )
          ) {
            newReturningArr?.push(val);
          }
        }
      } else {
        newReturningArr?.push(val);
      }
    });
    // return returningArr;
    return newReturningArr;
  };

  const getText = (record: any) => {
    const { pageId, type, points } = record;
    //curpage and scaling runtime here
    const curmpage = takeOff?.pages?.find((i: any) => i?.pageId == pageId);
    const scale = curmpage?.scale ?? {
      xScale: `1in=1in`,
      yScale: `1in=1in`,
      precision: '1',
    };
    const text =
      type == 'line'
        ? record?.scalUnits == 'feet'
          ? calcLineDistance(record?.points, scale, true)
          : `${Number(Number(calcLineDistance(record?.points, scale, false)) * 0.0254).toFixed(3)} meter`
        : type == 'perimeter'
          ? points?.length > 4
            ? calculatePolygonPerimeter(points, scale)
            : calcLineDistance(points, scale, true)
          : type == 'area'
            ? record?.scalUnits == 'feet'
              ? `${calculatePolygonArea(points, scale)?.toFixed(4) || ''}SF`
              : `${Number(calculatePolygonArea(points, scale) * 0.092903).toFixed(3)}m²`
            : type == 'volume'
              ? record?.scalUnits == 'feet'
                ? `${calculatePolygonVolume(points, record?.depth || 1, scale)?.toFixed(2) || ''} CF`
                : `${Number(calculatePolygonVolume(points, record?.depth || 1, scale) * 0.0283168).toFixed(3)} m³`
              : `${record?.text}`.slice(0, 8);
    return text;
  };

  const measurementsTableData = (takeOff: any, search?: string) => {
    let returningArr: any = [];
    if (
      takeOff?.measurements &&
      Object.keys(takeOff?.measurements) &&
      Object.keys(takeOff?.measurements)?.length > 0
    ) {
      Object.keys(takeOff?.measurements)?.map((key: any, ind: any) => {
        console.log(
          ind,
          takeOff?.measurements[key],
          ' =====> measurementsTableData measurementsTableData gotArr'
        );
        if (takeOff?.measurements[`${key}`]) {
          const gotArr = getSingleMeasurements(
            takeOff?.measurements[`${key}`],
            key
          );
          console.log(
            gotArr,
            takeOff?.measurements[`${key}`],
            ' =====> measurementsTableData measurementsTableData gotArr'
          );
          if (Array.isArray(gotArr)) {
            returningArr = [...returningArr, ...gotArr];
          }
        }
        return '';
      });
    }
    if (search && search?.length > 0) {
      returningArr = returningArr?.filter((i: any) => {
        return (
          i?.projectName
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase()) ||
          i?.category
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase()) ||
          i?.subcategory
            ?.toLocaleLowerCase()
            ?.includes(search?.toLocaleLowerCase())
        );
      });
    }
    let emptyCategories = [];
    if (Array.isArray(takeOff?.categories)) {
      for (let i = 0; i < takeOff?.categories?.length; i++) {
        const cur = takeOff?.categories[i];
        if (!returningArr?.find((i: any) => i?.category == cur)) {
          emptyCategories.push(cur);
        }
      }
    }
    console.log(
      returningArr,
      emptyCategories,
      ' =====> measurementsTableData measurementsTableData first returning array object'
    );
    if (returningArr?.length > 0) {
      //Reduce code for category
      returningArr = returningArr?.reduce((result: any, currentItem: any) => {
        const {
          category,
          subcategory,
          dateTime,
          points,
          projectName,
          stroke,
          strokeWidth,
          textUnit,
          id,
          lineCap,
          depth,
          x,
          y,
          user,
          type,
          pageId,
          // text
        } = currentItem;

        //curpage and scaling runtime here
        const curmpage = takeOff?.pages?.find((i: any) => i?.pageId == pageId);
        const scale = curmpage?.scale ?? {
          xScale: `1in=1in`,
          yScale: `1in=1in`,
          precision: '1',
        };
        const text =
          type == 'line'
            ? calcLineDistance(points, scale, true)
            : type == 'perimeter'
              ? points?.length > 4
                ? calculatePolygonPerimeter(points, scale)
                : calcLineDistance(points, scale, true)
              : type == 'area'
                ? calculatePolygonArea(points, scale)
                : type == 'volume'
                  ? calculatePolygonVolume(
                      points,
                      currentItem?.depth || 1,
                      scale
                    )
                  : '';

        // Check if there's already an entry with the same projectName and pageLabel
        const existingEntry = result?.find(
          (entry: any) => entry.category === category
        );
        if (existingEntry) {
          const existingEntrySubCategory = existingEntry?.children?.find(
            (entry: any) => entry?.subcategory === subcategory
          );
          const existingEntrySubCategoryIndex =
            existingEntry?.children?.findIndex(
              (entry: any) => entry?.subcategory === subcategory
            );
          if (
            existingEntrySubCategory &&
            subcategory &&
            existingEntrySubCategoryIndex != -1
          ) {
            existingEntrySubCategory['isSubParent'] = true;
            if (
              Array.isArray(
                existingEntry?.children[existingEntrySubCategoryIndex]?.children
              )
            ) {
              existingEntry?.children[
                existingEntrySubCategoryIndex
              ]?.children?.push({
                key: dateTime,
                isChild: true,
                category,
                subcategory,
                dateTime,
                points,
                projectName,
                stroke,
                strokeWidth,
                textUnit,
                id,
                lineCap,
                depth,
                x,
                y,
                user,
                isParent: false,
                type,
                pageId,
                text,
              });
            } else {
              existingEntry.children[existingEntrySubCategoryIndex].children = [
                {
                  key: dateTime,
                  isChild: true,
                  category,
                  subcategory,
                  dateTime,
                  points,
                  projectName,
                  stroke,
                  strokeWidth,
                  textUnit,
                  id,
                  lineCap,
                  depth,
                  x,
                  y,
                  user,
                  isParent: false,
                  type,
                  pageId,
                  text,
                },
              ];
            }
            console.log(
              returningArr,
              subcategory,
              result,
              ' =====> measurementsTableData measurementsTableData the final obj given code runs here'
            );
          } else {
            existingEntry?.children?.push(
              subcategory
                ? {
                    key: dateTime,
                    isSubParent: true,
                    isParent: false,
                    category,
                    subcategory,
                    dateTime,
                    points,
                    projectName,
                    stroke,
                    strokeWidth,
                    textUnit,
                    id,
                    lineCap,
                    depth,
                    x,
                    y,
                    user,
                    type,
                    pageId,
                    text,
                    children: [
                      {
                        key: dateTime,
                        isParent: false,
                        isChild: true,
                        category,
                        subcategory,
                        dateTime,
                        points,
                        projectName,
                        stroke,
                        strokeWidth,
                        textUnit,
                        id,
                        lineCap,
                        depth,
                        x,
                        y,
                        user,
                        type,
                        pageId,
                        text,
                      },
                    ],
                  }
                : {
                    key: dateTime,
                    category,
                    subcategory,
                    dateTime,
                    points,
                    projectName,
                    stroke,
                    strokeWidth,
                    textUnit,
                    id,
                    lineCap,
                    depth,
                    x,
                    y,
                    user,
                    isParent: false,
                    type,
                    pageId,
                    text,
                  }
            );
          }
        } else {
          result?.push({
            key: dateTime,
            isParent: true,
            category,
            subcategory,
            dateTime,
            points,
            projectName,
            stroke,
            strokeWidth,
            textUnit,
            id,
            lineCap,
            depth,
            x,
            y,
            user,
            type,
            pageId,
            text,
            children: subcategory
              ? [
                  {
                    key: dateTime,
                    isSubParent: true,
                    isParent: false,
                    category,
                    subcategory,
                    dateTime,
                    points,
                    projectName,
                    stroke,
                    strokeWidth,
                    textUnit,
                    id,
                    lineCap,
                    depth,
                    x,
                    y,
                    user,
                    type,
                    pageId,
                    text,
                    children: [
                      {
                        key: dateTime,
                        isParent: false,
                        isChild: true,
                        category,
                        subcategory,
                        dateTime,
                        points,
                        projectName,
                        stroke,
                        strokeWidth,
                        textUnit,
                        id,
                        lineCap,
                        depth,
                        x,
                        y,
                        user,
                        type,
                        pageId,
                        text,
                      },
                    ],
                  },
                ]
              : [
                  {
                    key: dateTime,
                    isParent: false,
                    category,
                    subcategory,
                    dateTime,
                    points,
                    projectName,
                    stroke,
                    strokeWidth,
                    textUnit,
                    id,
                    lineCap,
                    depth,
                    x,
                    y,
                    user,
                    type,
                    pageId,
                    text,
                  },
                ],
          });
        }
        return result;
      }, []);
    }
    returningArr = [
      ...returningArr,
      ...emptyCategories.map((i: any, ind: number) => ({
        category: i,
        children: [
          ...(Array.isArray(takeOff?.subCategories)
            ? [
                ...takeOff.subCategories.map((it: any, index: number) => ({
                  category: i,
                  isSubParent: true,
                  isParent: false,
                  key: new Date()?.toString() + ind + index,
                  subcategory: it,
                })),
              ]
            : []),
        ],
        isParent: true,
        key: new Date()?.toString() + ind,
      })),
    ];
    console.log(
      returningArr,
      ' =====> measurementsTableData measurementsTableData first returning array object'
    );
    return returningArr;
  };

  // const captureShape = async (
  //   shape: any,
  //   background: HTMLImageElement,
  //   shapeType: string
  // ) => {
  //   // Create a temporary container for off-screen stage
  //   const container = document.createElement('div');
  //   container.style.display = 'none'; // Hide the container
  //   document.body.appendChild(container); // This is required for Konva.Stage initialization

  //   return new Promise<string | any>((resolve) => {
  //     // Initialize a temporary stage with the container
  //     const tempStage = new Konva.Stage({
  //       container: container,
  //       width: background.width,
  //       height: background.height,
  //     });

  //     const layer = new Konva.Layer();
  //     tempStage.add(layer);

  //     // Add the background image to the layer
  //     const bgImage = new Konva.Image({
  //       image: background,
  //       width: background.width,
  //       height: background.height,
  //     });
  //     layer.add(bgImage);

  //     let minX: number, minY: number, maxX: number, maxY: number;

  //     // Initialize variables to ensure they cover the shape with margins later
  //     minX = minY = Number.MAX_SAFE_INTEGER;
  //     maxX = maxY = 0;

  //     // Determine the type of shape and render accordingly
  //     switch (shapeType) {
  //       case 'count': {
  //         // Example for a circle shape
  //         const { x, y, radius = 20 } = shape;
  //         const circle = new Konva.Image({
  //           image: counterImage,
  //           width: 20,
  //           height: 20,
  //           x,
  //           y,
  //           radius,
  //         });
  //         layer.add(circle);

  //         // Adjust bounds for the circle, considering the radius and a margin
  //         minX = x - radius - 20;
  //         minY = y - radius - 20;
  //         maxX = x + radius + 20;
  //         maxY = y + radius + 20;
  //         break;
  //       }

  //       case 'line':
  //       case 'perimeter':
  //       case 'dynamic':
  //       case 'area':
  //       case 'volume':
  //         {
  //           // Example for a line or polygon shape
  //           const { points, stroke, strokeWidth, lineCap } = shape;
  //           const line = new Konva.Line({
  //             points,
  //             stroke,
  //             strokeWidth,
  //             lineCap,
  //             closed: shapeType === 'area' || shapeType === 'volume', // Close path for areas and volumes
  //             fill: shape?.fillColor
  //           });
  //           layer.add(line);
  //           console.warn(shape, 'sssss');
  //           let xText = 0,
  //             yText = 0;
  //           if (
  //             shapeType === 'area' ||
  //             shapeType === 'volume' ||
  //             shapeType === 'dynamic'
  //           ) {
  //             const { x, y } = calculatePolygonCenter(points);
  //             xText = x - 20;
  //             yText = y - 20;
  //           } else {
  //             const { x, y } = calculateMidpoint(points);
  //             xText = x - 20;
  //             yText = y - 20;
  //           }

  //           // Calculate bounds for lines and polygons, include margin
  //           const xs = points.filter((_: any, i: number) => i % 2 === 0);
  //           const ys = points.filter((_: any, i: number) => i % 2 !== 0);
  //           minX = Math.min(...xs) - 20;
  //           minY = Math.min(...ys) - 20;
  //           maxX = Math.max(...xs) + 20;
  //           maxY = Math.max(...ys) + 20;
  //           const textSize = ((maxX - minX) * (maxY - minY)) / 100000;

  //           console.warn(textSize);
  //           const text = new Konva.Text({
  //             x: xText,
  //             y: yText,
  //             text: shape.text,
  //             fontSize: Math.floor(textSize) * 10 + 25,
  //             fontFamily: 'Calibri',
  //             fill: shape?.textColor ?? 'red',
  //           });
  //           layer.add(text);
  //         }
  //         break;

  //       default:
  //         console.error('Unknown shape type:', shapeType);
  //         return;
  //     }

  //     layer.draw(); // Force drawing the layer to render shapes

  //     // Use toImage to capture the specified region
  //     tempStage.toImage({
  //       // x: minX,
  //       // y: minY,sss
  //       // width: maxX - minX,
  //       // height: maxY - minY,
  //       x: 0,
  //       y: 0,
  //       width: background.width,
  //       height: background.height,
  //       callback: (img) => {
  //         resolve(img)
  //         // Create a canvas to get the cropped image data
  //         // console.log(img, " ===> Image got from tempStage")
  //         // const canvas = document.createElement('canvas');
  //         // // canvas.width = maxX - minX;
  //         // // canvas.height = maxY - minY;
  //         // canvas.width = background.width;
  //         // canvas.height = background.height;
  //         // const ctx = canvas.getContext('2d');
  //         // if (ctx) {
  //         //   ctx.drawImage(img, 0, 0)//, canvas.width, canvas.height);
  //         //   const dataURL = canvas.toDataURL();
  //         //   resolve(dataURL); // Resolve the promise with the cropped image data URL
  //         // }
  //         // // Cleanup: remove the temporary container from the document
  //         // document.body.removeChild(container);
  //       },
  //     });
  //   });
  // };

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
  const captureShape = async (
    shapeArr: any[],
    background: HTMLImageElement
    // shapeType: string
  ) => {
    // Create a temporary container for off-screen stage
    const container = document.createElement('div');
    container.style.display = 'none'; // Hide the container
    document.body.appendChild(container); // This is required for Konva.Stage initialization

    return new Promise<string | any>((resolve) => {
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

      for (let i = 0; i < shapeArr?.length; i++) {
        const { type: shapeType, ...shape } = shapeArr[i];
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
          case 'arc':
          case 'curve':
            {
              // Example for a line or polygon shape
              const { points, stroke, strokeWidth, lineCap } = shape;
              let pts =
                shapeType == 'curve'
                  ? getBezierPointsCurve(points, shape?.controlPoints)
                  : shapeType == 'arc'
                    ? getBezierPointsArc(points, shape?.controlPoints)
                    : points;
              const line = new Konva.Line({
                points: pts,
                stroke,
                strokeWidth,
                lineCap,
                closed:
                  shapeType === 'area' ||
                  shapeType === 'volume' ||
                  shapeType == 'curve', // Close path for areas and volumes
                fill: shape?.fillColor,
                bezier: shapeType === 'arc' || shapeType === 'curve',
              });
              layer.add(line);
              console.warn(shape, 'sssss');
              let xText = 0,
                yText = 0;
              if (
                shapeType === 'area' ||
                shapeType === 'volume' ||
                shapeType === 'dynamic' ||
                shapeType === 'curve'
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
                fill: shape?.textColor ?? 'red',
              });
              layer.add(text);
            }
            break;

          default:
            console.error('Unknown shape type:', shapeType);
            return;
        }
      }

      layer.draw(); // Force drawing the layer to render shapes

      // Use toImage to capture the specified region
      tempStage.toImage({
        // x: minX,
        // y: minY,sss
        // width: maxX - minX,
        // height: maxY - minY,
        x: 0,
        y: 0,
        width: background.width,
        height: background.height,
        callback: (img) => {
          resolve(img);
          // Create a canvas to get the cropped image data
          // console.log(img, " ===> Image got from tempStage")
          // const canvas = document.createElement('canvas');
          // // canvas.width = maxX - minX;
          // // canvas.height = maxY - minY;
          // canvas.width = background.width;
          // canvas.height = background.height;
          // const ctx = canvas.getContext('2d');
          // if (ctx) {
          //   ctx.drawImage(img, 0, 0)//, canvas.width, canvas.height);
          //   const dataURL = canvas.toDataURL();
          //   resolve(dataURL); // Resolve the promise with the cropped image data URL
          // }
          // // Cleanup: remove the temporary container from the document
          // document.body.removeChild(container);
        },
      });
    });
  };
  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      //@ts-ignore
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `${src}?cacheBust=${new Date().getTime()}`;
      img.onload = () => resolve(img);
      img.onerror = (e: any) => {
        console.log(e, ' ==> Page image loading of capture');
        reject(e);
      };
    });
  };
  const imagesToPdf = (images: any, name: string = 'output.pdf') => {
    try {
      const pdf = new jsPDF();

      images.forEach((imgData: any, index: number) => {
        if (index !== 0) {
          pdf.addPage();
        }
        pdf.addImage(
          imgData.src,
          'JPEG',
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );
        // console.log(imgData?.width, imgData?.height, " ===> file page with its measurments final images error images to pdf function width height")
        // pdf.addImage(imgData?.src, 'JPEG', 0, 0, imgData?.width, imgData?.height);
      });

      pdf.save(name);
    } catch (error) {
      console.log(
        error,
        ' ===> file page with its measurments final images error images to pdf function'
      );
    }
  };
  const [markuploading, setmarkuploading] = useState(false);
  // const downloadMarkup = async (file: any) => {
  //   if (!file?.fileId) return;
  //   try {
  //     const allpgs = takeOff?.pages?.filter(
  //       (i: any) => i?.fileId == file?.fileId
  //     );
  //     const arrMsr = getPageData(); // converting measurements to array
  //     if (!Array.isArray(arrMsr) || !(arrMsr.length > 0)) {
  //       return;
  //     }
  //     console.log(file, takeOff, allpgs, getPageData(), ' ===> file');
  //     let imgArr: any[] = [];
  //     if (allpgs && Array.isArray(allpgs) && allpgs?.length > 0) {
  //       setmarkuploading(true);
  //       await Promise.all(
  //         allpgs?.slice(0, 6)?.map(async (it: any) => {
  //           const curPgMsr = arrMsr.filter((i: any) => i?.pageId == it?.pageId);
  //           console.log(it, curPgMsr, ' ===> file page with its measurments');
  //           const background = await loadImage(it?.src);
  //           if (curPgMsr && Array.isArray(curPgMsr) && curPgMsr?.length > 0) {
  //             const img = await captureShape(
  //               [
  //                 ...curPgMsr.map((i) => ({
  //                   ...i?.config,
  //                   text: i?.text,
  //                   name: i?.projectName,
  //                   type: i?.type,
  //                 })),
  //               ],
  //               background
  //             );
  //             imgArr.push(img);
  //             // await Promise.all(
  //             //   curPgMsr.map(async (curMsr: any) => {
  //             //     try {
  //             //       const img = await captureShape({ ...curMsr.config, text: curMsr.text, name: curMsr.projectName }, background, curMsr?.type ?? 'line')
  //             //       console.log(img, " ===> file page with its measurments final images img ")
  //             //       imgArr.push({ src: img, width: background.width, height: background.height })
  //             //     } catch (error) {
  //             //       console.log(error, " ===> file page with its measurments final images error ")
  //             //     }
  //             //   })
  //             // )
  //           } else {
  //             imgArr?.push(background);
  //           }
  //         })
  //       );
  //       console.log(
  //         imgArr,
  //         ' ===> file page with its measurments final images'
  //       );
  //       imagesToPdf(imgArr?.reverse());
  //       setmarkuploading(false);
  //     }
  //   } catch (error) {
  //     setmarkuploading(false);
  //     console.log(error);
  //   }
  // };

  const downloadMarkupByCategory = async (file: any) => {
    if (!file) return;
    try {
      let arrMsr = getPageData(); // converting measurements to array
      arrMsr = Array.isArray(arrMsr)
        ? arrMsr?.filter((i) => i?.category == file)
        : [];
      let requiredPages = new Set<any>([]);
      arrMsr.forEach((msr: any) => requiredPages.add(msr?.pageId));
      const pagesArr = Array.from(requiredPages);
      const allpgs = takeOff?.pages?.filter((i: any) =>
        pagesArr?.some((pg) => pg == i?.pageId)
      );
      console.log(arrMsr, file, requiredPages, allpgs, ' ===> ArrMeasurements');
      let imgArr: any[] = [];
      if (
        pagesArr &&
        pagesArr.length > 0 &&
        allpgs &&
        Array.isArray(allpgs) &&
        allpgs?.length > 0
      ) {
        setmarkuploading(true);
        await Promise.all(
          allpgs?.slice(0, 6)?.map(async (it: any) => {
            const curPgMsr = arrMsr.filter((i: any) => i?.pageId == it?.pageId);
            console.log(it, curPgMsr, ' ===> file page with its measurments');
            const background = await loadImage(it?.src);
            if (curPgMsr && Array.isArray(curPgMsr) && curPgMsr?.length > 0) {
              const img = await captureShape(
                [
                  ...curPgMsr.map((i) => ({
                    ...i?.config,
                    text: i?.text,
                    name: i?.projectName,
                    type: i?.type,
                  })),
                ],
                background
              );
              imgArr.push(img);
            } else {
              imgArr?.push(background);
            }
          })
        );
      }
      imagesToPdf(imgArr, `${file}.pdf`);
      setmarkuploading(false);
    } catch (error) {
      setmarkuploading(false);
      console.log(error);
    }
  };

  const [expandedKeys, setexpandedKeys] = useState({
    files: [1],
    takeOff: [1],
    wbs: [1],
  });
  const [isDrag, setisDrag] = useState<boolean>(false);
  const [selectedShape, setSelectedShape] = useState('');

  const openShap = (record: any) => {
    if (
      record &&
      record?.pageId
      // &&
      // takeOff &&
      // takeOff?.measurements[`${record?.pageId}`] &&
      // takeOff?.measurements[`${record?.pageId}`][`${record?.type}`] &&
      // Array.isArray(
      //   takeOff?.measurements[`${record?.pageId}`][`${record?.type}`]
      // )
    ) {
      if (record?.type == 'count' || record?.type == 'texts') {
        return;
      }
      const pg = takeOff?.pages?.find((i: any) => i?.pageId == record?.pageId);
      const dd = getPageMsr(record?.pageId, takeOffMsr);
      const shape = dd[`${record?.type}`]?.find(
        (i: any) =>
          // i?.points[0] == record?.points[0] && i?.points[1] == record?.points[1]
          i?._id == record?._id
      );
      const shapeIndex = dd[`${record?.type}`]?.findIndex(
        (i: any) =>
          // i?.points[0] == record?.points[0] && i?.points[1] == record?.points[1]
          i?._id == record?._id
      );
      console.log(
        dd,
        record,
        pg,
        shape,
        shapeIndex,
        ' ===> Data of record and takeoff'
      );
      if (shapeIndex != -1) {
        const text = `${record?.type}-${shapeIndex}-${record?._id}`;
        setSelectedShape(text);
        setselectedPage(pg);
        setselectedTakeOffTab('page');
      }
    }
  };
  console.log(draw, takeOff, ' ===> draw');

  const [iscolorpickeropen, setiscolorpickeropen] = useState(false);
  const getWidth = (pg: any, height: number) => {
    //w 3 h 5 nh 10
    if (pg?.width && pg.height && height) {
      const ratio = height / pg?.height;
      return pg?.width * ratio;
    } else {
      return 250;
    }
  };

  console.log(selectedShape, selectedPage, ' ===> selected shape here');

  useEffect(() => {
    //drag resize handle
    const parent = document.getElementById('drag-container');
    const child1 = document.getElementById('left-side');
    const child2 = document.getElementById('right-side');
    const handle = document.getElementById('handle');

    if (parent && handle && child1 && child2) {
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();

        // Get the initial positions and sizes
        const initialX = e.clientX;
        const initialChild1Width = child1.offsetWidth;
        // const initialChild2Width = child2.offsetWidth;
        const parentWidth = parent.offsetWidth;

        function onMouseMove(e: any) {
          // Calculate the new width of child1
          const deltaX = e.clientX - initialX;
          const newChild1Width = initialChild1Width + deltaX;
          const newChild1WidthPercent = (newChild1Width / parentWidth) * 100;

          // Set the new width for child1 and adjust child2 accordingly
          //@ts-ignore
          child1.style.width = `${newChild1WidthPercent}%`;
          //@ts-ignore
          child2.style.width = `${100 - newChild1WidthPercent - 2}%`; // -2% accounts for the handle width
        }

        function onMouseUp() {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

        // Attach the listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }
  }, [leftOpened]);

  // const [catDDOpen, setcatDDOpen] = useState(true);
  const [catopened, setcatopened] = useState<number[]>([]);

  const [closedFilesIndArray, setclosedFilesIndArray] = useState<number[]>([]);
  console.log(closedFilesIndArray, ' closed files array');

  const getPageMsr = (pageId: string, arr: any[]) => {
    let retObj: any = {
      line: [],
      arc: [],
      area: [],
      count: [],
      curve: [],
      dynamic: [],
      perimeter: [],
      texts: [],
      volume: [],
    };
    const pagemsr = arr.filter((i) => i?.pageId == pageId);
    console.log(pagemsr, pageId, arr);
    pagemsr.forEach((i) => {
      retObj[i?.type] = [...retObj[i?.type], i];
    });
    return retObj;
  };

  const handleMsrOprations = async (
    type: 'create' | 'update' | 'delete',
    data: any
  ) => {
    try {
      settableLoading(true);
      if (type == 'create') {
        if (!selectedPage?.pageId) {
          return;
        }
        const res = await takeoffSummaryService.httpCreateMeasurement({
          ...data,
          scalUnits,
          takeoff: edit_id,
          pageId: selectedPage?.pageId,
        });
        console.log(res, ' success while getting takeoff measurements');
        settakeOffMsr(res.data);
      } else if (type == 'update') {
        const res = await takeoffSummaryService.httpUpdateMeasurement(
          data?.id,
          data?.data
        );
        console.log(res, ' success while getting takeoff measurements');
        settakeOffMsr(res.data);
      } else if (type == 'delete') {
        const res = await takeoffSummaryService.httpDeleteMeasurement(data?.id);
        console.log(res, ' success while getting takeoff measurements');
        settakeOffMsr(res.data);
      } else {
        toast.error('Invalid type selected');
      }
    } catch (error) {
      console.log(error, ' ===> Error while performing measurement operation.');
    } finally {
      settableLoading(false);
    }
  };
  const getTakeoffMsr = async () => {
    try {
      if (!edit_id) return;
      const res =
        await takeoffSummaryService.httpGetProjectMeasurements(edit_id);
      console.log(res, ' success while getting takeoff measurements');
      settakeOffMsr(res.data);
    } catch (error) {
      console.log(error, ' error while getting takeoff measurements');
    }
  };

  // const getAiTakeOff = async (spg: any) => {
  //   const curmpage = takeOff?.pages?.find((i: any) => i?.pageId == spg?.pageId);
  //   if (!spg?.src) {
  //     console.log(spg)
  //     toast.error('Invalid page selected')
  //     return
  //   }
  //   try {
  //     const data = await axios.post('http://localhost:8000/detect_shapes/', {
  //       s3_url: spg?.src  // Send the s3_url in the body
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json'  // Set the correct content type
  //       }
  //     })
  //     console.log(data, " ===> data from here")
  //     const scale = curmpage?.scale ?? {
  //       xScale: `1in=1in`,
  //       yScale: `1in=1in`,
  //       precision: '1',
  //     };
  //     let lineShapes: any[] = []
  //     let areaShapes: any[] = []
  //     if (Array.isArray(data.data?.shapes) && data.data.shapes.length > 0) {
  //       [...data.data.shapes].forEach((it: any) => {
  //         if (!Array.isArray(it?.points)) return
  //         let points: number[] = []
  //         it?.points?.forEach?.((vl: number[]) => {
  //           points = [...points, ...vl]
  //         })
  //         console.log(points, it, "Points shape made with things")
  //         if (it?.type == "rectangle" || it?.type == "polygon") {
  //           console.log(points, it, "rectangle shape logic Points shape made with things")
  //           let areaShape = {
  //             points,
  //             stroke: color,
  //             strokeWidth: border,
  //             textUnit: unit,
  //             dateTime: moment().toDate(),
  //             projectName: 'Area Measurement',
  //             category: 'Area Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
  //             subcategory: null,
  //             user,
  //             textColor: textColor,
  //             fillColor: fillColor,
  //             text: calculatePolygonArea(points, scale)
  //           }
  //           console.log(areaShape, "Area shape made with things")
  //           areaShapes.push(areaShape)
  //         } else if (it?.type == "line") {
  //           let lineShape = {
  //             points,
  //             stroke: color,
  //             strokeWidth: border,
  //             textUnit: unit,
  //             dateTime: moment().toDate(),
  //             "projectName": "Length Measurement",
  //             "category": "Length Measurement",
  //             "subcategory": null,
  //             "user": user,
  //             textColor: textColor,
  //             text: calcLineDistance(points, scale, true)
  //           }
  //           console.log(lineShape, "Line shape made with things")
  //           lineShapes.push(lineShape)
  //         }
  //       })
  //       setDraw((prevDraw: any) => {
  //         return {
  //           ...prevDraw,
  //           area: [...(prevDraw?.area ? prevDraw.area : []), ...areaShapes],
  //           line: [...(prevDraw?.area ? prevDraw.area : []), ...lineShapes],
  //         };
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const clearPageTakeOff = async (spg: any) => {
  //   const curmpage = takeOff?.pages?.find((i: any) => i?.pageId == spg?.pageId);
  //   if (!spg?.src) {
  //     console.log(spg)
  //     toast.error('Invalid page selected')
  //     return
  //   }
  //   try {
  //     setDraw({
  //       line: [],
  //       area: [],
  //       volume: [],
  //       count: [],
  //       dynamic: [],
  //       scale: [],
  //       perimeter: []
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  const [fullScreen, setfullScreen] = useState(false);

  const getTotalCount = (record: any) => {
    console.log(takeOffMsr, ' ====> take off msr');
    if (record?.category && record?.subcategory) {
      const samePgCategroyMsr = takeOffMsr?.filter(
        (i: any) =>
          i?.countType == record?.countType &&
          i?.category == record?.category &&
          i?.subcategory == record?.subcategory &&
          i?.pageId == record?.pageId
      );
      return samePgCategroyMsr?.length > 0 ? samePgCategroyMsr?.length : 1;
    } else if (record?.category && !record?.subcategory) {
      const samePgCategroyMsr = takeOffMsr?.filter(
        (i: any) =>
          i?.countType == record?.countType &&
          i?.category == record?.category &&
          !i?.subcategory &&
          i?.pageId == record?.pageId
      );
      return samePgCategroyMsr?.length > 0 ? samePgCategroyMsr?.length : 1;
    }
    return 1;
  };

  return (
    <>
      <section
        id="fullscreen-container"
        className={`${fullScreen ? 'p-0 m-0 fixed top-0 left-0 w-screen h-screen' : 'px-8 pb-4 mt-5'}`}
      >
        {fullScreen == false && (
          <div className="flex justify-between">
            <h2>
              {takeOff?.name ?? ''}
              {/* - {JSON.stringify(selectedPage?.scale)} */}
            </h2>
            <div className="flex gap-x-2">
              <CustomButton
                text="Generate Report"
                className="!w-auto shadow-md"
                // icon="plus.svg"
                iconwidth={20}
                iconheight={20}
                onClick={() => {
                  setreportModal(true);
                }}
                // onClick={() => {
                //   //@ts-ignore
                //   (urlSearch && urlSearch.get('edit_id') && urlSearch.get('edit_id')?.length > 0) ? router.push(`/take-off/report?edit_id=${urlSearch.get('edit_id')}&scale=${JSON?.stringify(scaleData[1] ?? { xScale: `1in=1in`, yScale: `1in=1in`, precision: '1', })}`) : router.push('/take-off/report')
                // }}
              />
              <Popover
                title={'Select File'}
                content={
                  <div>
                    {/* {takeOff?.files &&
                    Array.isArray(takeOff?.files) &&
                    takeOff?.files?.length > 0 &&
                    takeOff.files.map((it: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-lavenderPurpleReplica hover:text-white p-1 rounded"
                          onClick={() => {
                            downloadMarkup(it);
                          }}
                        >
                          {it?.name?.slice(0, 30)}
                        </div>
                      );
                    })} */}
                    {takeOff?.categories &&
                      Array.isArray(takeOff?.categories) &&
                      takeOff?.categories?.length > 0 &&
                      takeOff.categories.map((it: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="cursor-pointer hover:bg-lavenderPurpleReplica hover:text-white p-1 rounded"
                            onClick={() => {
                              // downloadMarkup(it);
                              downloadMarkupByCategory(it);
                            }}
                          >
                            {it?.slice(0, 30)}
                          </div>
                        );
                      })}
                  </div>
                }
                placement="bottom"
                trigger="click"
              >
                <CustomButton
                  text="Download Markup"
                  className="!w-auto shadow-md"
                  // icon="plus.svg"
                  iconwidth={20}
                  iconheight={20}
                  isLoading={markuploading}
                  icon={<DownOutlined />}
                  // onClick={() => { downloadMarkup((takeOff?.files && Array.isArray(takeOff?.files) && takeOff?.files?.length > 0) ? takeOff?.files[0] : {}) }}
                />
              </Popover>
            </div>
          </div>
        )}

        {/* grid place-items-center shadow-sceneryShadow  */}
        <div
          id="drag-container"
          className={`flex ${leftOpened ? 'gap-x-5' : 'gap-x-0'} justify-between rounded-lg my-4 !shadow-none ${bg_style} ${fullScreen ? '!h-full !my-0' : 'h-[800px] !my-4'} flex flex-wrap justify-between`}
        >
          {/* Left Bar */}
          {/* {leftOpened && ( */}
          <div
            id="left-side"
            className={`h-[100%] relative rounded-2xl shadow-secondaryTwist border flex flex-col !bg-white !transition-all duration-300 ease-in-out ${leftOpened ? 'w-[27%]' : '!w-0 !opacity-0'}`}
          >
            {leftOpened && (
              <>
                {/* sideBarHeader */}
                <div className="!py-0 w-[full] h-[25%] border-b bg-gradient-to-r from-[#8449EB]/5 to-[#6A56F6]/5 flex flex-col px-3 bg-transparent rounded-t-2xl">
                  {/* upper */}
                  <div className="h-[70%] flex flex-col justify-evenly">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => {
                          setsideTabs('Plans');
                        }}
                        className={`!border-none ${sideTabs == 'Plans' ? 'bg-lavenderPurpleReplica text-white font-semibold' : '!bg-gray-100'}`}
                      >
                        Plans
                      </Button>
                      <Button
                        onClick={() => {
                          setsideTabs('TakeOff');
                        }}
                        className={`!border-none ${sideTabs == 'TakeOff' ? 'bg-lavenderPurpleReplica text-white font-semibold' : '!bg-gray-100'}`}
                      >
                        Takeoff
                      </Button>
                      <Button
                        onClick={() => {
                          setsideTabs('WBS');
                        }}
                        className={`!border-none ${sideTabs == 'WBS' ? 'bg-lavenderPurpleReplica text-white font-semibold' : '!bg-gray-100'}`}
                      >
                        WBS / Category
                      </Button>
                    </div>
                    <div className="flex gap-x-2 w-[95%]">
                      <Input
                        className="grow"
                        placeholder="Search"
                        onChange={(e) => {
                          setsideSearch(e.target.value);
                        }}
                        prefix={<SearchOutlined />}
                      />
                      <Button
                        onClick={() => {
                          setselectedTakeOffTab('file');
                        }}
                        className="bg-lavenderPurpleReplica text-white font-semibold"
                        icon={<CloudUploadOutlined className="text-[16px]" />}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                  {/* lower */}
                  <div className="h-[30%] flex justify-between gap-x-3 items-center">
                    <div className="grow flex gap-x-4 items-center">
                      <MenuOutlined className="text-lavenderPurpleReplica text-[20px]" />
                      <span className="font-inter font-[200] text-gray-800">
                        {sideTabs == 'Plans'
                          ? 'Plan & Documents'
                          : sideTabs == 'TakeOff'
                            ? 'TakeOff'
                            : sideTabs == 'WBS'
                              ? 'WBS'
                              : ''}
                      </span>
                      {tableLoading && <Spin />}
                    </div>
                    {/* <MoreOutlined className='cursor-pointer text-[20px]' size={90} /> */}
                    {sideTabs == 'WBS' && !isWBS && (
                      <Button
                        onClick={() => {
                          setisWBS(true);
                        }}
                        className="bg-white !px-2 border-lavenderPurpleReplica text-lavenderPurpleReplica font-semibold"
                        icon={<PlusOutlined className="text-[16px]" />}
                      >
                        Add WBS
                      </Button>
                    )}
                    {sideTabs == 'WBS' && isWBS && (
                      <div className="flex flex-col gap-y-1">
                        <Select
                          className="!w-52 !mb-1"
                          style={{ width: 300 }}
                          placeholder="Category"
                          // onSelect={(value: any) => {
                          //   if (selectedCate === value) {
                          //     setselectedCate(null);
                          //   } else {
                          //     setselectedCate(value);
                          //   }
                          // }}
                          value={'Category'}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: '8px 0' }} />
                              <Space style={{ padding: '0 8px 4px' }}>
                                <Input
                                  placeholder="Please enter item"
                                  // ref={inputRef}
                                  value={categoryText}
                                  onChange={(e: any) => {
                                    setcategoryText(e?.target?.value);
                                  }}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                                <Button
                                  type="text"
                                  icon={<PlusOutlined />}
                                  onClick={() => {
                                    updateCategories(
                                      [
                                        ...(Array.isArray(takeOff?.categories)
                                          ? takeOff.categories
                                          : []),
                                        categoryText,
                                      ],
                                      [
                                        ...(Array.isArray(
                                          takeOff?.subCategories
                                        )
                                          ? takeOff.subCategories
                                          : []),
                                      ]
                                    );
                                    // setDraw((ps:any)=>({...ps,categories:[...(Array.isArray(ps?.categories) ? ps?.categories : []),categoryText]}));
                                    setcategoryList((ps: any) => [
                                      ...ps,
                                      categoryText,
                                    ]);
                                    setcategoryText('');
                                  }}
                                >
                                  Add
                                </Button>
                              </Space>
                            </>
                          )}
                          // options={[...(Array.isArray(takeOff?.categories) ? takeOff?.categories : [])].map((item: any) => ({ label: item, value: item }))}
                        >
                          {[
                            ...(Array.isArray(takeOff?.categories)
                              ? takeOff.categories
                              : []),
                          ].map((item: any, index: number) => (
                            <Option key={index + ''} value={item}>
                              <span>{item}</span>
                              <span style={{ float: 'right' }}>
                                <DeleteOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateCategories(
                                      takeOff.categories.filter(
                                        (i: string) => i != item
                                      ),
                                      [
                                        ...(Array.isArray(
                                          takeOff?.subCategories
                                        )
                                          ? takeOff.subCategories
                                          : []),
                                      ]
                                    );
                                    setselectedCate(null);
                                    setselectedSubCate(null);
                                  }}
                                />
                              </span>
                            </Option>
                          ))}
                        </Select>
                        <Select
                          className="!w-52 !mb-1"
                          disabled={!selectedCate}
                          style={{ width: 300 }}
                          placeholder="SubCategory"
                          // onSelect={(value: any) => {
                          //   if (selectedSubCate === value) {
                          //     setselectedSubCate(null);
                          //   } else {
                          //     setselectedSubCate(value);
                          //   }
                          // }}
                          value={'Sub Category'}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: '8px 0' }} />
                              {selectedCate && (
                                <Space style={{ padding: '0 8px 4px' }}>
                                  <Input
                                    placeholder="Please enter item"
                                    // ref={inputRef}
                                    value={subcategoryText}
                                    onChange={(e: any) => {
                                      setsubcategoryText(e?.target?.value);
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                  />
                                  <Button
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                      if (!selectedCate) {
                                        return;
                                      }
                                      updateCategories(
                                        [
                                          ...(Array.isArray(takeOff?.categories)
                                            ? takeOff.categories
                                            : []),
                                        ],
                                        [
                                          ...(Array.isArray(
                                            takeOff?.subCategories
                                          )
                                            ? takeOff.subCategories
                                            : []),
                                          subcategoryText + '-' + selectedCate,
                                        ]
                                      );
                                      // setDraw((ps:any)=>({...ps,subCategories:[...(Array.isArray(ps?.subCategories) ? ps?.subCategories : []),subcategoryText]}));
                                      setsubcategoryList((ps: any) => [
                                        ...ps,
                                        subcategoryText + '-' + selectedCate,
                                      ]);
                                      setsubcategoryText('');
                                    }}
                                  >
                                    Add
                                  </Button>
                                </Space>
                              )}
                            </>
                          )}
                          // options={[...(Array.isArray(takeOff?.subCategories) ? takeOff?.subCategories : [])].map((item: any) => (
                          //   { label: item, value: item }
                          // ))}
                        >
                          {[
                            ...(Array.isArray(takeOff?.subCategories)
                              ? takeOff.subCategories.filter((val: string) =>
                                  val?.includes(selectedCate)
                                )
                              : []),
                          ].map((item: any, index: number) => (
                            <Option key={index + ''} value={item}>
                              <span>{item?.split('-')[0]}</span>
                              <span style={{ float: 'right' }}>
                                <DeleteOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateCategories(
                                      [
                                        ...(Array.isArray(takeOff?.categories)
                                          ? takeOff.categories
                                          : []),
                                      ],
                                      takeOff.subCategories.filter(
                                        (i: string) => i != item
                                      )
                                    );
                                    setselectedSubCate(null);
                                  }}
                                />
                              </span>
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                {/* sideBar Main */}
                {sideTabs == 'Plans' && (
                  <div className="grow flex !border-black">
                    <Table
                      columns={tableColumns}
                      expandable={{
                        // expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
                        rowExpandable: (record) => record?.isParent == true,
                        // expandIcon:(record:any) => <DownOutlined />
                      }}
                      // dataSource={groupDataForFileTable(pages)}
                      dataSource={tableData}
                      className="grow bg-transparent transparent-table"
                      scroll={{ y: 580 }}
                      pagination={false}
                      showHeader={false}
                      bordered
                      style={{ backgroundColor: 'transparent' }}
                      rowClassName={'table-row-transparent'}
                      rootClassName="table-row-transparent"
                      expandedRowKeys={expandedKeys.files}
                      onExpand={(expanded, record) => {
                        if (expanded) {
                          setexpandedKeys((ps) => ({
                            ...ps,
                            files: [record.key],
                          }));
                        } else {
                          setexpandedKeys((ps) => ({ ...ps, files: [] }));
                        }
                      }}
                    />
                  </div>
                )}
                {sideTabs == 'TakeOff' && (
                  <div className="grow flex items-start justify-center !border-black">
                    {/* <Table
                    columns={tableColumns}
                    expandable={{
                      rowExpandable: (record) => record?.isParent == true,
                    }}
                    dataSource={tableData}
                    className="grow bg-transparent transparent-table"
                    scroll={{ y: 580 }}
                    pagination={false}
                    showHeader={true}
                    style={{ backgroundColor: 'transparent' }}
                    rowClassName={'table-row-transparent'}
                    rootClassName="table-row-transparent"
                  /> */}
                    <div className="w-[98%] max-h-[580px] overflow-auto border rounded-md my-2 flex flex-col">
                      <div className="flex bg-lavenderPurpleReplica bg-opacity-10 min-w-max">
                        <span className="w-[40%] min-w-[167px] text-[10px] font-bold flex items-center justify-center text-[#475467] mx-1 py-1">
                          Name
                        </span>
                        <span className="w-[10%] min-w-[42px] text-[10px] font-bold flex items-center justify-center text-[#475467] mx-1 py-1">
                          Sheet Number
                        </span>
                        <span className="w-[9%] min-w-[37px] text-[10px] font-bold flex items-center justify-center text-[#475467] mx-1 py-1">
                          Measu- rement
                        </span>
                        <span className="w-[21%] min-w-[90px] text-[10px] font-bold flex items-center justify-center text-[#475467] mx-1 py-1">
                          User
                        </span>
                        <span className="w-[13%] min-w-[58px] text-[10px] font-bold flex items-center justify-center text-[#475467] mx-1 py-1">
                          Date
                        </span>
                        <span className="w-[3%] min-w-[15px] text-[10px] font-bold flex items-center justify-center text-[#475467] mx-1 py-1"></span>
                      </div>
                      <div className="flex flex-col min-w-max">
                        <div className="flex flex-col min-w-max">
                          {(!Array.isArray(
                            measurementsplanArray(takeOffMsr, sideSearch)
                          ) ||
                            !(
                              measurementsplanArray(takeOffMsr, sideSearch)
                                .length > 0
                            )) && (
                            <div className="flex items-center justify-center w-[100%] py-5">
                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </div>
                          )}
                          {[
                            ...(Array.isArray(takeOff?.categories)
                              ? takeOff.categories
                              : []),
                            'Length Measurement',
                            'Arc Length Measurement',
                            'Area Measurement',
                            'Volume Measurement',
                            'Curve Area Measurement',
                            'Count Measurement',
                            'Text Measurement',
                            'Dynamic Measurement',
                            'Perimeter Measurement',
                          ]
                            .filter((ct: string) =>
                              measurementsplanArray(
                                takeOffMsr,
                                sideSearch
                              ).some((m: any) => m?.category == ct)
                            )
                            .map((prct: string) => {
                              return (
                                <>
                                  <div className="min-w-max p-2 text-[#333E4F] bg-[#475467] bg-opacity-0 font-extrabold border-b text-[10px] w-[100%]">
                                    {prct}
                                  </div>
                                  {[
                                    ...(Array.isArray(takeOff?.subCategories)
                                      ? takeOff.subCategories
                                      : []),
                                  ]
                                    .filter(
                                      (sct: string) =>
                                        measurementsplanArray(
                                          takeOffMsr,
                                          sideSearch
                                        ).some(
                                          (m: any) => m?.subcategory == sct
                                        ) && sct?.includes(prct)
                                    )
                                    .map((prsct: string) => {
                                      return (
                                        <>
                                          <div className="min-w-max p-2 pl-5 text-[#333E4F] bg-[#475467] bg-opacity-0 font-extrabold border-b text-[10px]">
                                            {prsct}
                                          </div>
                                          {measurementsplanArray(
                                            takeOffMsr,
                                            sideSearch
                                          )
                                            .filter(
                                              (gvl: any) =>
                                                gvl?.subcategory == prsct
                                            )
                                            .map((pmsr: any) => {
                                              return (
                                                <>
                                                  <div
                                                    className="flex min-w-max border-b pl-6 hover:bg-[#475467] hover:bg-opacity-20 cursor-pointer"
                                                    onClick={() => {
                                                      if (
                                                        pmsr?.type == 'count' ||
                                                        pmsr?.type == 'texts'
                                                      ) {
                                                        return;
                                                      }
                                                      openShap(pmsr);
                                                      const pg =
                                                        takeOff?.pages?.find(
                                                          (pgs: any) =>
                                                            pgs?.pageId ==
                                                            pmsr?.pageId
                                                        );
                                                      if (pg) {
                                                        if (
                                                          pmsr?.points &&
                                                          Array.isArray(
                                                            pmsr?.points
                                                          ) &&
                                                          pmsr?.points?.length >
                                                            1
                                                        ) {
                                                          // setStageValues(record?.points[0]-100, record?.points[1]-100)
                                                        }
                                                        setselectedPage(pg);
                                                        setselectedTakeOffTab(
                                                          'page'
                                                        );
                                                        if (
                                                          !selectedPagesList?.find(
                                                            (i: any) =>
                                                              i?.pageId ==
                                                              pg?.pageId
                                                          )
                                                        ) {
                                                          //@ts-ignore
                                                          setselectedPagesList(
                                                            (ps: any) => [
                                                              ...ps,
                                                              pg,
                                                            ]
                                                          );
                                                        }
                                                      }
                                                    }}
                                                  >
                                                    <span className="w-[40%] min-w-[197px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1 gap-x-2">
                                                      <ColorPicker
                                                        onChangeComplete={(
                                                          val
                                                        ) => {
                                                          // updateTableChangeInTakeOff(
                                                          //   pmsr?.pageId,
                                                          //   pmsr?.type,
                                                          //   pmsr?.dateTime,
                                                          //   pmsr?.type == 'count' || pmsr?.type == 'texts'
                                                          //     ? 'textColor'
                                                          //     : 'stroke',
                                                          //   val.toHexString()
                                                          // );
                                                          settakeOffMsr((ps) =>
                                                            ps.map((i) => {
                                                              if (
                                                                i?._id ==
                                                                pmsr?._id
                                                              ) {
                                                                if (
                                                                  pmsr?.type ==
                                                                    'count' ||
                                                                  pmsr?.type ==
                                                                    'texts'
                                                                ) {
                                                                  handleMsrOprations(
                                                                    'update',
                                                                    {
                                                                      id: pmsr?._id,
                                                                      data: {
                                                                        ...i,
                                                                        textColor:
                                                                          val.toHexString(),
                                                                      },
                                                                    }
                                                                  );
                                                                  return {
                                                                    ...i,
                                                                    textColor:
                                                                      val.toHexString(),
                                                                  };
                                                                } else {
                                                                  handleMsrOprations(
                                                                    'update',
                                                                    {
                                                                      id: pmsr?._id,
                                                                      data: {
                                                                        ...i,
                                                                        stroke:
                                                                          val.toHexString(),
                                                                      },
                                                                    }
                                                                  );
                                                                  return {
                                                                    ...i,
                                                                    stroke:
                                                                      val.toHexString(),
                                                                  };
                                                                }
                                                              } else {
                                                                return i;
                                                              }
                                                            })
                                                          );
                                                        }}
                                                        className="!w-[2px] !h-[2px] border-none"
                                                        value={
                                                          pmsr?.stroke ??
                                                          pmsr?.textColor
                                                        }
                                                        size="small"
                                                      />{' '}
                                                      {pmsr?.projectName}
                                                    </span>
                                                    <span className="w-[10%] min-w-[42px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                                      {takeOff?.pages?.find(
                                                        (pp: any) =>
                                                          pp?.pageId ==
                                                          pmsr?.pageId
                                                      )?.pageNum ?? ''}
                                                    </span>
                                                    <span className="w-[9%] min-w-[37px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                                      {pmsr?.type == 'count'
                                                        ? getTotalCount(pmsr) +
                                                          ' ' +
                                                          pmsr?.countType
                                                        : getText(pmsr)}
                                                    </span>
                                                    <span className="w-[21%] min-w-[90px] text-[10px] font-bold flex items-center justify-start text-[#475467] gap-x-2 mx-1 py-1">
                                                      <Avatar
                                                        size={'small'}
                                                        icon={<UserOutlined />}
                                                      />{' '}
                                                      {`${pmsr?.user?.name ?? pmsr?.user?.email}`?.slice(
                                                        0,
                                                        10
                                                      )}
                                                    </span>
                                                    <span className="w-[13%] min-w-[58px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                                      {moment(
                                                        new Date(pmsr?.dateTime)
                                                      ).format('DD.MM.yyyy')}
                                                    </span>
                                                    <span className="w-[3%] min-w-[15px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                                      {pmsr?.type !=
                                                        'count' && (
                                                        <Popover
                                                          content={
                                                            <div className="flex flex-col">
                                                              <span
                                                                className="font-bold cursor-pointer bg-red-600 bg-opacity-15 hover:bg-opacity-80 hover:!text-white p-2 rounded-lg px-2 flex justify-between mb-5"
                                                                onClick={() => {
                                                                  // deleteTableChangeInTakeOff(
                                                                  //   pmsr?.pageId,
                                                                  //   pmsr?.type,
                                                                  //   pmsr?.dateTime
                                                                  // );
                                                                  settakeOffMsr(
                                                                    (ps) =>
                                                                      ps.filter(
                                                                        (i) =>
                                                                          i?._id !=
                                                                          pmsr?._id
                                                                      )
                                                                  );
                                                                  handleMsrOprations(
                                                                    'delete',
                                                                    {
                                                                      id: pmsr?._id,
                                                                    }
                                                                  );
                                                                }}
                                                              >
                                                                Delete{' '}
                                                                <DeleteOutlined />
                                                              </span>
                                                              <h3 className="text-sm font-bold">
                                                                Edit WBS
                                                              </h3>
                                                              {Array.isArray(
                                                                takeOff?.categories
                                                              ) &&
                                                                takeOff
                                                                  .categories
                                                                  .length > 0 &&
                                                                takeOff.categories.map(
                                                                  (
                                                                    cat: string
                                                                  ) => {
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          cat
                                                                        }
                                                                      >
                                                                        <h3
                                                                          onClick={() => {
                                                                            // updateTableCategory(
                                                                            //   pmsr?.pageId,
                                                                            //   pmsr?.type,
                                                                            //   pmsr?.dateTime,
                                                                            //   cat,
                                                                            //   null
                                                                            // );
                                                                            settakeOffMsr(
                                                                              (
                                                                                ps
                                                                              ) =>
                                                                                ps.map(
                                                                                  (
                                                                                    i
                                                                                  ) => {
                                                                                    if (
                                                                                      i?._id ==
                                                                                      pmsr?._id
                                                                                    ) {
                                                                                      handleMsrOprations(
                                                                                        'update',
                                                                                        {
                                                                                          id: pmsr?._id,
                                                                                          data: {
                                                                                            ...i,
                                                                                            category:
                                                                                              cat,
                                                                                            subcategory:
                                                                                              null,
                                                                                          },
                                                                                        }
                                                                                      );
                                                                                      return {
                                                                                        ...i,
                                                                                        category:
                                                                                          cat,
                                                                                        subcategory:
                                                                                          null,
                                                                                      };
                                                                                    } else {
                                                                                      return i;
                                                                                    }
                                                                                  }
                                                                                )
                                                                            );
                                                                          }}
                                                                          className={`font-bold my-1 cursor-pointer hover:bg-lavenderPurpleReplica hover:bg-opacity-15 p-1 rounded-lg px-2 ${pmsr?.category == cat ? 'bg-lavenderPurpleReplica bg-opacity-20' : ''}`}
                                                                        >
                                                                          {cat}
                                                                        </h3>
                                                                        {Array.isArray(
                                                                          takeOff?.subCategories
                                                                        ) &&
                                                                          takeOff.subCategories
                                                                            .filter(
                                                                              (
                                                                                i: string
                                                                              ) =>
                                                                                i?.includes(
                                                                                  cat
                                                                                )
                                                                            )
                                                                            .map(
                                                                              (
                                                                                subcat: string
                                                                              ) => {
                                                                                return (
                                                                                  <li
                                                                                    key={
                                                                                      subcat
                                                                                    }
                                                                                    onClick={() => {
                                                                                      // updateTableCategory(
                                                                                      //   pmsr?.pageId,
                                                                                      //   pmsr?.type,
                                                                                      //   pmsr?.dateTime,
                                                                                      //   cat,
                                                                                      //   subcat
                                                                                      // );
                                                                                      settakeOffMsr(
                                                                                        (
                                                                                          ps
                                                                                        ) =>
                                                                                          ps.map(
                                                                                            (
                                                                                              i
                                                                                            ) => {
                                                                                              if (
                                                                                                i?._id ==
                                                                                                pmsr?._id
                                                                                              ) {
                                                                                                handleMsrOprations(
                                                                                                  'update',
                                                                                                  {
                                                                                                    id: pmsr?._id,
                                                                                                    data: {
                                                                                                      ...i,
                                                                                                      category:
                                                                                                        cat,
                                                                                                      subcategory:
                                                                                                        subcat,
                                                                                                    },
                                                                                                  }
                                                                                                );
                                                                                                return {
                                                                                                  ...i,
                                                                                                  category:
                                                                                                    cat,
                                                                                                  subcategory:
                                                                                                    subcat,
                                                                                                };
                                                                                              } else {
                                                                                                return i;
                                                                                              }
                                                                                            }
                                                                                          )
                                                                                      );
                                                                                    }}
                                                                                    className={`list-disc my-1 cursor-pointer hover:bg-lavenderPurpleReplica hover:bg-opacity-15 p-1 px-2 rounded-lg ${pmsr?.subcategory == subcat ? 'bg-lavenderPurpleReplica bg-opacity-20' : ''}`}
                                                                                  >
                                                                                    {
                                                                                      subcat?.split(
                                                                                        '-'
                                                                                      )[0]
                                                                                    }
                                                                                  </li>
                                                                                );
                                                                              }
                                                                            )}
                                                                      </div>
                                                                    );
                                                                  }
                                                                )}
                                                            </div>
                                                          }
                                                          title="Actions"
                                                          trigger="click"
                                                        >
                                                          <MoreOutlined
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                            }}
                                                            className="cursor-pointer text-[20px]"
                                                          />
                                                        </Popover>
                                                      )}
                                                    </span>
                                                  </div>
                                                </>
                                              );
                                            })}
                                        </>
                                      );
                                    })}
                                  {measurementsplanArray(takeOffMsr, sideSearch)
                                    .filter(
                                      (gvl: any) =>
                                        gvl?.category == prct &&
                                        !gvl?.subcategory
                                    )
                                    .map((pmsr: any, pmsrInd: number) => {
                                      return (
                                        <>
                                          <div
                                            className="flex min-w-max border-b pl-2 hover:bg-[#475467] hover:bg-opacity-20 cursor-pointer"
                                            onClick={() => {
                                              if (
                                                pmsr?.type == 'count' ||
                                                pmsr?.type == 'texts'
                                              ) {
                                                return;
                                              }
                                              openShap(pmsr);
                                              const pg = takeOff?.pages?.find(
                                                (pgs: any) =>
                                                  pgs?.pageId == pmsr?.pageId
                                              );
                                              if (pg) {
                                                if (
                                                  pmsr?.points &&
                                                  Array.isArray(pmsr?.points) &&
                                                  pmsr?.points?.length > 1
                                                ) {
                                                  // setStageValues(record?.points[0]-100, record?.points[1]-100)
                                                }
                                                setselectedPage(pg);
                                                setselectedTakeOffTab('page');
                                                if (
                                                  !selectedPagesList?.find(
                                                    (i: any) =>
                                                      i?.pageId == pg?.pageId
                                                  )
                                                ) {
                                                  //@ts-ignore
                                                  setselectedPagesList(
                                                    (ps: any) => [...ps, pg]
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            <span className="w-[40%] min-w-[197px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1 gap-x-2">
                                              <ColorPicker
                                                onChangeComplete={(val) => {
                                                  // updateTableChangeInTakeOff(
                                                  //   pmsr?.pageId,
                                                  //   pmsr?.type,
                                                  //   pmsr?.dateTime,
                                                  //   pmsr?.type == 'count' || pmsr?.type == 'texts'
                                                  //     ? 'textColor'
                                                  //     : 'stroke',
                                                  //   val.toHexString()
                                                  // );
                                                  settakeOffMsr((ps) =>
                                                    ps.map((i) => {
                                                      if (i?._id == pmsr?._id) {
                                                        if (
                                                          pmsr?.type ==
                                                            'count' ||
                                                          pmsr?.type == 'texts'
                                                        ) {
                                                          handleMsrOprations(
                                                            'update',
                                                            {
                                                              id: pmsr?._id,
                                                              data: {
                                                                ...i,
                                                                textColor:
                                                                  val.toHexString(),
                                                              },
                                                            }
                                                          );
                                                          return {
                                                            ...i,
                                                            textColor:
                                                              val.toHexString(),
                                                          };
                                                        } else {
                                                          handleMsrOprations(
                                                            'update',
                                                            {
                                                              id: pmsr?._id,
                                                              data: {
                                                                ...i,
                                                                stroke:
                                                                  val.toHexString(),
                                                              },
                                                            }
                                                          );
                                                          return {
                                                            ...i,
                                                            stroke:
                                                              val.toHexString(),
                                                          };
                                                        }
                                                      } else {
                                                        return i;
                                                      }
                                                    })
                                                  );
                                                }}
                                                className="!w-[2px] !h-[2px] border-none"
                                                value={
                                                  pmsr?.stroke ??
                                                  pmsr?.textColor
                                                }
                                                size="small"
                                              />{' '}
                                              {/* {pmsr?.projectName} */}
                                              <EditableText
                                                key={
                                                  pmsr?.projectName + pmsrInd
                                                }
                                                initialText={pmsr?.projectName}
                                                onPressEnter={(vl) => {
                                                  settakeOffMsr((ps) =>
                                                    ps.map((i) => {
                                                      if (i?._id == pmsr?._id) {
                                                        handleMsrOprations(
                                                          'update',
                                                          {
                                                            id: pmsr?._id,
                                                            data: {
                                                              ...i,
                                                              projectName: vl,
                                                            },
                                                          }
                                                        );
                                                        return {
                                                          ...i,
                                                          projectName: vl,
                                                        };
                                                      } else {
                                                        return i;
                                                      }
                                                    })
                                                  );
                                                }}
                                                toolTip={'Double Click to edit'}
                                              />
                                            </span>
                                            <span className="w-[10%] min-w-[42px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                              {takeOff?.pages?.find(
                                                (pp: any) =>
                                                  pp?.pageId == pmsr?.pageId
                                              )?.pageNum ?? ''}
                                            </span>
                                            <span className="w-[9%] min-w-[37px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                              {pmsr?.type == 'count'
                                                ? getTotalCount(pmsr) +
                                                  ' ' +
                                                  pmsr?.countType
                                                : getText(pmsr)}
                                            </span>
                                            <span className="w-[21%] min-w-[90px] text-[10px] font-bold flex items-center justify-start text-[#475467] gap-x-2 mx-1 py-1">
                                              <Avatar
                                                size={'small'}
                                                icon={<UserOutlined />}
                                              />{' '}
                                              {`${pmsr?.user?.name ?? pmsr?.user?.email}`?.slice(
                                                0,
                                                10
                                              )}
                                            </span>
                                            <span className="w-[13%] min-w-[58px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                              {moment(
                                                new Date(pmsr?.dateTime)
                                              ).format('DD.MM.yyyy')}
                                            </span>
                                            {pmsr?.type != 'count' && (
                                              <span className="w-[3%] min-w-[15px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1">
                                                <Popover
                                                  content={
                                                    <div className="flex flex-col">
                                                      <span
                                                        className="font-bold cursor-pointer bg-red-600 bg-opacity-15 hover:bg-opacity-80 hover:!text-white p-2 rounded-lg px-2 flex justify-between mb-5"
                                                        onClick={() => {
                                                          // deleteTableChangeInTakeOff(
                                                          //   pmsr?.pageId,
                                                          //   pmsr?.type,
                                                          //   pmsr?.dateTime
                                                          // );
                                                          settakeOffMsr((ps) =>
                                                            ps.filter(
                                                              (i) =>
                                                                i?._id !=
                                                                pmsr?._id
                                                            )
                                                          );
                                                          handleMsrOprations(
                                                            'delete',
                                                            { id: pmsr?._id }
                                                          );
                                                        }}
                                                      >
                                                        Delete{' '}
                                                        <DeleteOutlined />
                                                      </span>
                                                      <h3 className="text-sm font-bold">
                                                        Edit WBS
                                                      </h3>
                                                      {Array.isArray(
                                                        takeOff?.categories
                                                      ) &&
                                                        takeOff.categories
                                                          .length > 0 &&
                                                        takeOff.categories.map(
                                                          (cat: string) => {
                                                            return (
                                                              <div key={cat}>
                                                                <h3
                                                                  onClick={() => {
                                                                    // updateTableCategory(
                                                                    //   pmsr?.pageId,
                                                                    //   pmsr?.type,
                                                                    //   pmsr?.dateTime,
                                                                    //   cat,
                                                                    //   null
                                                                    // );
                                                                    settakeOffMsr(
                                                                      (ps) =>
                                                                        ps.map(
                                                                          (
                                                                            i
                                                                          ) => {
                                                                            if (
                                                                              i?._id ==
                                                                              pmsr?._id
                                                                            ) {
                                                                              handleMsrOprations(
                                                                                'update',
                                                                                {
                                                                                  id: pmsr?._id,
                                                                                  data: {
                                                                                    ...i,
                                                                                    category:
                                                                                      cat,
                                                                                    subcategory:
                                                                                      null,
                                                                                  },
                                                                                }
                                                                              );
                                                                              return {
                                                                                ...i,
                                                                                category:
                                                                                  cat,
                                                                                subcategory:
                                                                                  null,
                                                                              };
                                                                            } else {
                                                                              return i;
                                                                            }
                                                                          }
                                                                        )
                                                                    );
                                                                  }}
                                                                  className={`font-bold my-1 cursor-pointer hover:bg-lavenderPurpleReplica hover:bg-opacity-15 p-1 rounded-lg px-2 ${pmsr?.category == cat ? 'bg-lavenderPurpleReplica bg-opacity-20' : ''}`}
                                                                >
                                                                  {cat}
                                                                </h3>
                                                                {Array.isArray(
                                                                  takeOff?.subCategories
                                                                ) &&
                                                                  takeOff.subCategories
                                                                    .filter(
                                                                      (
                                                                        i: string
                                                                      ) =>
                                                                        i?.includes(
                                                                          cat
                                                                        )
                                                                    )
                                                                    .map(
                                                                      (
                                                                        subcat: string
                                                                      ) => {
                                                                        return (
                                                                          <li
                                                                            key={
                                                                              subcat
                                                                            }
                                                                            onClick={() => {
                                                                              // updateTableCategory(
                                                                              //   pmsr?.pageId,
                                                                              //   pmsr?.type,
                                                                              //   pmsr?.dateTime,
                                                                              //   cat,
                                                                              //   subcat
                                                                              // );
                                                                              settakeOffMsr(
                                                                                (
                                                                                  ps
                                                                                ) =>
                                                                                  ps.map(
                                                                                    (
                                                                                      i
                                                                                    ) => {
                                                                                      if (
                                                                                        i?._id ==
                                                                                        pmsr?._id
                                                                                      ) {
                                                                                        handleMsrOprations(
                                                                                          'update',
                                                                                          {
                                                                                            id: pmsr?._id,
                                                                                            data: {
                                                                                              ...i,
                                                                                              category:
                                                                                                cat,
                                                                                              subcategory:
                                                                                                subcat,
                                                                                            },
                                                                                          }
                                                                                        );
                                                                                        return {
                                                                                          ...i,
                                                                                          category:
                                                                                            cat,
                                                                                          subcategory:
                                                                                            subcat,
                                                                                        };
                                                                                      } else {
                                                                                        return i;
                                                                                      }
                                                                                    }
                                                                                  )
                                                                              );
                                                                            }}
                                                                            className={`list-disc my-1 cursor-pointer hover:bg-lavenderPurpleReplica hover:bg-opacity-15 p-1 px-2 rounded-lg ${pmsr?.subcategory == subcat ? 'bg-lavenderPurpleReplica bg-opacity-20' : ''}`}
                                                                          >
                                                                            {
                                                                              subcat?.split(
                                                                                '-'
                                                                              )[0]
                                                                            }
                                                                          </li>
                                                                        );
                                                                      }
                                                                    )}
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                    </div>
                                                  }
                                                  title="Actions"
                                                  trigger="click"
                                                >
                                                  <MoreOutlined
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                    }}
                                                    className="cursor-pointer text-[20px]"
                                                  />
                                                </Popover>
                                              </span>
                                            )}
                                          </div>
                                        </>
                                      );
                                    })}
                                </>
                              );
                            })}
                        </div>
                      </div>
                      {/* <div className='flex flex-col min-w-max' >
                      <div className='flex flex-col min-w-max' >
                        <div className='min-w-max p-2 text-[#333E4F] bg-[#475467] bg-opacity-0 font-extrabold border-b text-[10px] w-[100%]'>Category</div>
                        <div className='min-w-max p-2 pl-5 text-[#333E4F] bg-[#475467] bg-opacity-0 font-extrabold border-b text-[10px]'>Sub-Category</div>
                        <div className='flex min-w-max border-b' >
                          <span className='w-[40%] min-w-[197px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1 gap-x-2' >
                            <ColorPicker size='small' /> Length measurements
                          </span>
                          <span className='w-[10%] min-w-[42px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1' >1</span>
                          <span className='w-[9%] min-w-[37px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1' >5sf</span>
                          <span className='w-[21%] min-w-[90px] text-[10px] font-bold flex items-center justify-start text-[#475467] gap-x-2 mx-1 py-1' ><Avatar size={'small'} icon={<UserOutlined />} /> kamransa...</span>
                          <span className='w-[13%] min-w-[58px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1' >24.04.2024</span>
                          <span className='w-[3%] min-w-[15px] text-[10px] font-bold flex items-center justify-start text-[#475467] mx-1 py-1' >
                            <Dropdown overlay={<div>kamran</div>} trigger={['click']}>
                              <MoreOutlined
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="cursor-pointer text-[20px]"
                              />
                            </Dropdown>
                          </span>
                        </div>
                      </div>
                    </div> */}
                    </div>
                  </div>
                )}
                {sideTabs == 'WBS' && (
                  <div className="grow !border-black p-2 overflow-y-auto max-h-[70%]">
                    {/* <Table
                columns={tableColumns}
                expandable={{
                  // expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
                  rowExpandable: (record) => record?.isParent == true,
                  // expandIcon:(record:any) => <DownOutlined />
                }}
                // dataSource={groupDataForFileTable(pages)}
                dataSource={tableData}
                className='grow bg-transparent transparent-table'
                scroll={{ y: 580 }}
                pagination={false}
                showHeader={true}
                // bordered
                style={{ backgroundColor: 'transparent' }}
                rowClassName={'table-row-transparent'}
                rootClassName='table-row-transparent'
              /> */}
                    {/* <div className="flex flex-col w-full">
                    <div className="w-full flex">
                      <span
                        className="border p-3 cursor-pointer"
                        onClick={() => {
                          setcatDDOpen((ps) => !ps);
                        }}
                      >
                        {catDDOpen ? (
                          <DownOutlined
                            style={{ strokeWidth: 30, stroke: 'black' }}
                          />
                        ) : (
                          <RightOutlined
                            style={{ strokeWidth: 30, stroke: 'black' }}
                          />
                        )}
                      </span>
                      <div className="flex justify-start items-center border px-3 grow gap-x-2 !bg-gray-100">
                        <FileOutlined
                          className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 p-1 rounded-full text-sm"
                          style={{ strokeWidth: 30, stroke: '#007ab6' }}
                        />
                        <span className="font-bold">Category</span>
                      </div>
                    </div>
                    <div className="flex flex-col w-full overflow-y-auto max-h-[250px]">
                      {catDDOpen &&
                        Array.isArray(takeOff?.categories) &&
                        takeOff?.categories?.map((i: any, ind: number) => {
                          return (
                            <div
                              className={`w-full border p-4 flex justify-between grow ${selectedCate == i ? 'bg-lavenderPurpleReplica bg-opacity-15' : 'hover:bg-gray-100'}`}
                              key={ind}
                            >
                              <span>{i}</span>
                              {selectedCate == i ? (
                                <Button
                                  size="small"
                                  className="border-2 rounded-full ml-2"
                                  onClick={() => {
                                    setselectedCate(null);
                                    setselectedSubCate(null);
                                  }}
                                >
                                  unselect
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  className="border-2 rounded-full ml-2"
                                  onClick={() => {
                                    setselectedCate(i);
                                  }}
                                >
                                  select
                                </Button>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="w-full flex">
                      <span
                        className="border p-3 cursor-pointer"
                        onClick={() => {
                          setsubcateDDOpen((ps) => !ps);
                        }}
                      >
                        {subcateDDOpen ? (
                          <DownOutlined
                            style={{ strokeWidth: 30, stroke: 'black' }}
                          />
                        ) : (
                          <RightOutlined
                            style={{ strokeWidth: 30, stroke: 'black' }}
                          />
                        )}
                      </span>
                      <div className="flex justify-start items-center border px-3 grow gap-x-2 !bg-gray-100">
                        <FileOutlined
                          className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 p-1 rounded-full text-sm"
                          style={{ strokeWidth: 30, stroke: '#007ab6' }}
                        />
                        <span className="font-bold">Sub Category</span>
                      </div>
                    </div>
                    <div className="flex flex-col w-full overflow-y-auto max-h-[250px]">
                      {subcateDDOpen &&
                        Array.isArray(takeOff?.subCategories) &&
                        takeOff?.subCategories?.map((i: any, ind: number) => {
                          return (
                            <div
                              className={`w-full border p-4 flex justify-between grow ${selectedSubCate == i ? 'bg-lavenderPurpleReplica bg-opacity-15' : 'hover:bg-gray-100'}`}
                              key={ind}
                            >
                              <span>{i}</span>
                              {selectedCate && (
                                <>
                                  {selectedSubCate == i ? (
                                    <Button
                                      size="small"
                                      className="border-2 rounded-full ml-2"
                                      onClick={() => {
                                        setselectedSubCate(null);
                                      }}
                                    >
                                      unselect
                                    </Button>
                                  ) : (
                                    <Button
                                      size="small"
                                      className="border-2 rounded-full ml-2"
                                      onClick={() => {
                                        setselectedSubCate(i);
                                      }}
                                    >
                                      select
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div> */}
                    <div className="flex flex-col w-full">
                      {Array.isArray(takeOff?.categories) &&
                        takeOff?.categories?.map((categ: any, ind: number) => {
                          return (
                            <div key={ind}>
                              <div className="w-full flex">
                                <span
                                  className="border p-3 cursor-pointer"
                                  onClick={() => {
                                    if (catopened.some((val) => val == ind)) {
                                      setcatopened((ps) =>
                                        ps.filter((val) => val != ind)
                                      );
                                    } else {
                                      setcatopened((ps) => [...ps, ind]);
                                    }
                                  }}
                                >
                                  {catopened.some((val) => val == ind) ? (
                                    <DownOutlined
                                      style={{
                                        strokeWidth: 30,
                                        stroke: 'black',
                                      }}
                                    />
                                  ) : (
                                    <RightOutlined
                                      style={{
                                        strokeWidth: 30,
                                        stroke: 'black',
                                      }}
                                    />
                                  )}
                                </span>
                                <div
                                  className={`flex justify-between px-3 grow items-center border ${selectedCate == categ ? 'bg-lavenderPurpleReplica bg-opacity-15' : '!bg-gray-100'}`}
                                >
                                  <div
                                    className={`flex justify-start items-center gap-x-2 `}
                                  >
                                    <FileOutlined
                                      className="text-lavenderPurpleReplica bg-lavenderPurpleReplica bg-opacity-15 p-1 rounded-full text-sm"
                                      style={{
                                        strokeWidth: 30,
                                        stroke: '#007ab6',
                                      }}
                                    />
                                    <span className="font-bold">
                                      <EditableText
                                        key={categ}
                                        initialText={categ}
                                        onPressEnter={(vl) => {
                                          updateCategories(
                                            takeOff.categories.map(
                                              (cit: string, cin: number) => {
                                                if (cin == ind) {
                                                  return vl;
                                                } else {
                                                  return cit;
                                                }
                                              }
                                            ),
                                            [
                                              ...(Array.isArray(
                                                takeOff?.subCategories
                                              )
                                                ? takeOff.subCategories.map(
                                                    (sit: string) => {
                                                      if (sit.includes(categ)) {
                                                        const [ls, lc] =
                                                          sit.split('-');
                                                        console.log(lc);
                                                        return ls + '-' + vl;
                                                      } else {
                                                        return sit;
                                                      }
                                                    }
                                                  )
                                                : []),
                                            ]
                                          );
                                        }}
                                        toolTip={'Double Click to edit'}
                                      />
                                    </span>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    {selectedCate == categ ? (
                                      <Button
                                        size="small"
                                        className="border-2 rounded-full ml-2"
                                        onClick={() => {
                                          setselectedCate(null);
                                          setselectedSubCate(null);
                                        }}
                                      >
                                        unselect
                                      </Button>
                                    ) : (
                                      <Button
                                        size="small"
                                        className="border-2 rounded-full ml-2"
                                        onClick={() => {
                                          setselectedCate(categ);
                                        }}
                                      >
                                        select
                                      </Button>
                                    )}
                                    <DeleteOutlined
                                      className="cursor-pointer"
                                      onClick={() => {
                                        updateCategories(
                                          takeOff.categories.filter(
                                            (cit: string) => cit != categ
                                          ),
                                          [
                                            ...(Array.isArray(
                                              takeOff?.subCategories
                                            )
                                              ? takeOff.subCategories
                                              : []),
                                          ]
                                        );
                                        setselectedCate(null);
                                        setselectedSubCate(null);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col w-full overflow-y-auto max-h-[250px]">
                                {catopened.some((val) => val == ind) &&
                                  Array.isArray(takeOff?.subCategories) &&
                                  takeOff?.subCategories
                                    ?.filter((val: any) => val?.includes(categ))
                                    ?.map((subcateg: any, sind: number) => {
                                      return (
                                        <div
                                          className={`w-full border p-4 flex justify-between grow ${selectedSubCate == subcateg ? 'bg-lavenderPurpleReplica bg-opacity-15' : 'hover:bg-gray-100'}`}
                                          key={sind}
                                        >
                                          <span>
                                            <EditableText
                                              key={subcateg}
                                              initialText={
                                                subcateg?.split('-')[0]
                                              }
                                              onPressEnter={(vl) => {
                                                updateCategories(
                                                  [
                                                    ...(Array.isArray(
                                                      takeOff.categories
                                                    )
                                                      ? takeOff.categories
                                                      : []),
                                                  ],
                                                  [
                                                    ...(Array.isArray(
                                                      takeOff?.subCategories
                                                    )
                                                      ? takeOff.subCategories.map(
                                                          (sit: string) => {
                                                            if (
                                                              sit == subcateg
                                                            ) {
                                                              const [ls, lc] =
                                                                sit.split('-');
                                                              console.log(ls);
                                                              return (
                                                                vl + '-' + lc
                                                              );
                                                            } else {
                                                              return sit;
                                                            }
                                                          }
                                                        )
                                                      : []),
                                                  ]
                                                );
                                              }}
                                              toolTip={'Double Click to edit'}
                                            />
                                          </span>
                                          <div className="flex gap-2">
                                            {selectedSubCate == subcateg ? (
                                              <Button
                                                size="small"
                                                className="border-2 rounded-full ml-2"
                                                onClick={() => {
                                                  setselectedSubCate(null);
                                                }}
                                              >
                                                unselect
                                              </Button>
                                            ) : (
                                              <Button
                                                size="small"
                                                className="border-2 rounded-full ml-2"
                                                onClick={() => {
                                                  setselectedCate(categ);
                                                  setselectedSubCate(subcateg);
                                                }}
                                              >
                                                select
                                              </Button>
                                            )}
                                            <DeleteOutlined
                                              className="cursor-pointer"
                                              onClick={() => {
                                                updateCategories(
                                                  [
                                                    ...(Array.isArray(
                                                      takeOff?.categories
                                                    )
                                                      ? takeOff.categories
                                                      : []),
                                                  ],
                                                  takeOff.subCategories.filter(
                                                    (sit: string) =>
                                                      sit != subcateg
                                                  )
                                                );
                                                setselectedSubCate(null);
                                              }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                <div
                  id="handle"
                  className="w-1 bg-lavenderPurpleReplica bg rounded-r-2xl absolute h-full right-0 top-0 cursor-col-resize bg-opacity-0 hover:bg-opacity-100"
                  draggable
                ></div>
              </>
            )}
          </div>
          {/* )} */}
          {/* Take Off New */}
          <div
            id="right-side"
            className="h-[100%] w-[71%] grow rounded-2xl shadow-secondaryTwist border relative !bg-white"
          >
            {/* sideBarHeader only when full screen and leftopened is false*/}
            {fullScreen && !leftOpened && (
              <div className="!absolute bottom-16 left-5 z-20 !py-2 !px-3 w-[full] border-b bg-gradient-to-r from-[#8449EB]/5 to-[#6A56F6]/5 flex gap-x-10 bg-lavenderPurpleReplica !bg-opacity-10 rounded-xl">
                {/* upper */}
                <div className="flex !p-2 bg-white rounded-xl justify-evenly">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        setsideTabs('Plans');
                        setleftOpened(true);
                      }}
                      className={`!border-none ${sideTabs == 'Plans' ? 'bg-lavenderPurpleReplica text-white font-semibold' : '!bg-gray-100'}`}
                    >
                      Plans
                    </Button>
                    <Button
                      onClick={() => {
                        setsideTabs('TakeOff');
                        setleftOpened(true);
                      }}
                      className={`!border-none ${sideTabs == 'TakeOff' ? 'bg-lavenderPurpleReplica text-white font-semibold' : '!bg-gray-100'}`}
                    >
                      Takeoff
                    </Button>
                    <Button
                      onClick={() => {
                        setsideTabs('WBS');
                        setleftOpened(true);
                      }}
                      className={`!border-none ${sideTabs == 'WBS' ? 'bg-lavenderPurpleReplica text-white font-semibold' : '!bg-gray-100'}`}
                    >
                      WBS / Category
                    </Button>
                  </div>
                </div>

                <div
                  className="flex bg-white rounded items-center justify-center"
                  onClick={() => {
                    setleftOpened(true);
                  }}
                >
                  <div className="flex flex-wrap gap-2 rounded">
                    <Button className={`!border-none !text-lg`}>
                      <UpOutlined />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* {!fullScreen && ( */}
            <div
              className="z-50 absolute top-[25px] left-[-13px] cursor-pointer border-[2px] rounded-full flex justify-center items-center p-1 text-gray-600 bg-white"
              onClick={() => {
                setleftOpened((ps) => !ps);
                const child1 = document.getElementById('left-side');
                const child2 = document.getElementById('right-side');
                if (child1 && child2) {
                  console.log('click event trigger here and logic runs here');
                  // Set the new width for child1 and adjust child2 accordingly
                  //@ts-ignore
                  child1.style.width = '27%';
                  //@ts-ignore
                  child2.style.width = `71%`; // -2% accounts for the handle width
                }
              }}
            >
              {/* {leftOpened ? <LeftOutlined /> : <RightOutlined />} */}
              <LeftOutlined
                className={`transition-all duration-300 ease-in-out ${leftOpened ? '' : '!rotate-180'}`}
              />
            </div>
            {/* )} */}
            {/* Old Take Off Full Page */}
            {/* <OldTakeOffFullPage /> */}
            <>
              <>
                {/* <section className="md:px-16 px-8 pb-4"> */}
                {/* <div className="flex justify-end pt-4">
              <div
                className="flex flex-row gap-x-3 cursor-pointer"
                onClick={() => {
                  //@ts-ignore
                  (urlSearch && urlSearch.get('edit_id') && urlSearch.get('edit_id')?.length > 0) ? router.push(`/takeoff/report?edit_id=${urlSearch.get('edit_id')}`) : router.push('/takeoff/report')
                }}
              >
                <CusotmButton
                  disabled={!uploadFileData.length || !reportData.length}
                  text="Generate Report"
                  icon="/plus.svg"
                  iconwidth={20}
                  iconheight={20}
                />
              </div>
            </div> */}
                {selectedTakeOffTab == 'page' && (
                  <ScaleNavigation
                    tool={tool}
                    setTool={setTool}
                    setShowModal={setShowModal}
                    handleZoomIn={handleZoomIn}
                    handleZoomOut={handleZoomOut}
                    handleRoomColorChange={handleRoomColorChange}
                    fillColor={fillColor}
                    countType={countType}
                    setcountType={setcountType}
                    selectedPage={selectedPage}
                    handleAddComment={handleAddComment}
                  />
                )}

                <div className="h-full relative">
                  <div className="absolute top-1 left-2 flex gap-x-3 p-3 z-40">
                    <Button
                      onClick={() => {
                        setselectedTakeOffTab('overview');
                      }}
                      icon={
                        <AppstoreOutlined className="!font-[800]] !text-xl" />
                      }
                      size="large"
                      className={`!border-none ${selectedTakeOffTab == 'overview' ? 'bg-lavenderPurpleReplica !bg-opacity-10 text-lavenderPurpleReplica' : '!bg-gray-100'}`}
                    >
                      Overview
                    </Button>
                    {selectedPagesList &&
                      selectedPagesList?.length > 0 &&
                      selectedPagesList?.map((pg: any, index: number) => {
                        return (
                          <Button
                            size="large"
                            className={`!border-none ${selectedTakeOffTab == 'page' && selectedPage?.pageId == pg?.pageId ? 'bg-lavenderPurpleReplica !bg-opacity-10 text-lavenderPurpleReplica font-semibold' : '!bg-gray-100'}`}
                            onClick={() => {
                              setselectedPage(pg);
                              setselectedTakeOffTab('page');
                            }}
                            key={index}
                            icon={
                              <BorderLeftOutlined className="!font-[800]] !text-xl" />
                            }
                          >
                            {pg?.name ? pg?.name?.slice(0, 15) : ''}
                            <span
                              className="cursor-pointer ml-5 !font-light"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('filtered crossed here');
                                const filtered = selectedPagesList?.filter(
                                  (i: any) => i?.pageId != pg?.pageId
                                );
                                setselectedPagesList(filtered);
                                if (selectedPage?.pageId == pg?.pageId) {
                                  console.log(
                                    'filtered crossed here inside selected page condition'
                                  );
                                  setselectedPage({});
                                  setselectedTakeOffTab('overview');
                                }
                                if (!filtered?.length) {
                                  console.log(
                                    'filtered crossed here in side empty selected list'
                                  );
                                  setselectedTakeOffTab('overview');
                                  setselectedPage({});
                                }
                              }}
                            >
                              <CloseOutlined />
                            </span>
                          </Button>
                        );
                      })}
                    {/* <div>Overview</div>
            <div>First Page</div> */}
                  </div>
                  {selectedTakeOffTab == 'page' && (
                    <div
                      className={`absolute top-3 right-[50px] flex z-40 rounded-lg bg-slate-50 shadow-md !border ${fullScreen ? 'mr-12' : ''}`}
                    >
                      <span
                        onClick={handleZoomIn}
                        className="border-r py-3 px-5 cursor-pointer"
                      >
                        <PlusOutlined className="font-extrabold" />
                      </span>
                      <span
                        onClick={handleZoomOut}
                        className="py-3 px-5 cursor-pointer border-r"
                      >
                        <MinusOutlined />
                      </span>
                      <span className="py-0 px-2 flex items-center cursor-pointer">
                        <Select
                          value={scalUnits}
                          options={[
                            { value: 'feet', label: <span>Feet</span> },
                            { value: 'meter', label: <span>Meter</span> },
                          ]}
                          onSelect={setscalUnits}
                        />
                      </span>
                      <span
                        onClick={() => {
                          // setfullScreen(ps=>!ps)
                          const container: any = document.getElementById(
                            'fullscreen-container'
                          );

                          // Function to handle fullscreen changes
                          const handleFullscreenChange = () => {
                            if (!document.fullscreenElement) {
                              // Fullscreen mode has been exited
                              setfullScreen(false);
                              // if (!programmaticExit) {
                              //   // This branch runs if the exit wasn’t triggered programmatically (e.g. ESC was pressed)
                              //   myCustomEscFunction();
                              // }
                              // Clean up the event listener once fullscreen is exited
                              document.removeEventListener(
                                'fullscreenchange',
                                handleFullscreenChange
                              );
                              // Reset flag for future fullscreen sessions
                              // programmaticExit = false;
                            }
                          };

                          // Attach the event listener
                          document.addEventListener(
                            'fullscreenchange',
                            handleFullscreenChange
                          );

                          if (!document.fullscreenElement) {
                            // Request fullscreen
                            container
                              .requestFullscreen()
                              .then(() => setfullScreen(true))
                              .catch((err: any) =>
                                console.error(
                                  `Error trying to enable fullscreen: ${err.message}`
                                )
                              );
                          } else {
                            // Exit fullscreen
                            document
                              .exitFullscreen()
                              .then(() => setfullScreen(false))
                              .catch((err) =>
                                console.error(
                                  `Error trying to exit fullscreen: ${err.message}`
                                )
                              );
                          }
                        }}
                        className="py-0 px-2 flex items-center cursor-pointer"
                      >
                        {fullScreen ? (
                          <FullscreenExitOutlined />
                        ) : (
                          <FullscreenOutlined />
                        )}
                      </span>
                      <span
                        onClick={() => {
                          setisDrag((ps) => !ps);
                        }}
                        className={`py-3 px-5 cursor-pointer border-r rounded ${isDrag ? 'bg-blue-500' : ''}`}
                      >
                        <DragOutlined />
                      </span>
                    </div>
                  )}
                  {selectedTakeOffTab == 'page' && selectedPage && (
                    <div
                      className={`absolute top-16 right-[50px] flex z-40 rounded-lg bg-slate-50 !border py-1 px-2 ${fullScreen ? 'mr-12' : ''}`}
                    >
                      Scale : {selectedPage?.scale?.xScale ?? `1'=1'`}
                      <br />
                      Precision : {selectedPage?.scale?.precision}
                      {/* <button className='p-1 rounded bg-lavenderPurpleReplica text-white mx-2 font-semibold text-sm cursor-pointer' onClick={() => {
                        getAiTakeOff(selectedPage)
                      }} >AiTakeOff</button>
                      <button className='p-1 rounded bg-lavenderPurpleReplica text-white mx-2 font-semibold text-sm cursor-pointer' onClick={() => {
                        clearPageTakeOff(selectedPage)
                      }} >Clear</button> */}
                    </div>
                  )}
                  {selectedTakeOffTab == 'page' && (
                    <div
                      className={`absolute bottom-0 z-40 ${showModal ? 'block' : 'hidden'}`}
                    >
                      <ModalsWrapper
                        tool={tool}
                        setTool={setTool}
                        setModalOpen={setShowModal}
                        measurements={measurements}
                      />
                    </div>
                  )}
                  <div className="h-full max-h-[100%] rounded-lg overflow-auto">
                    {selectedTakeOffTab == 'page' && (
                      <Draw
                        key={`draw-${0}`}
                        selectedTool={tool}
                        scale={
                          selectedPage?.scale || {
                            xScale: `1in=1in`,
                            yScale: `1in=1in`,
                            precision: '1',
                          }
                        }
                        depth={depth}
                        color={color}
                        border={border}
                        unit={unit * 1.5}
                        uploadFileData={
                          selectedPage && selectedPage?.pageId
                            ? selectedPage
                            : file
                        }
                        pageNumber={0 + 1}
                        handleScaleModal={(open) => setShowModal(open)}
                        handleChangeMeasurements={(measurements) =>
                          setMeasurements(measurements)
                        }
                        isEdit={
                          urlSearch.get('edit_id') && editData ? true : false
                        }
                        editData={editData}
                        drawScale={drawScale}
                        setdrawScale={setdrawScale}
                        setscaleLine={setscaleLine}
                        setModalOpen={setShowModal}
                        selectedCategory={selectedCate}
                        selectedSubCategory={selectedSubCate}
                        updateMeasurements={updateMeasurements}
                        draw={draw}
                        setDraw={setDraw}
                        stageScale={stageScale}
                        stageX={stageX}
                        stageY={stageY}
                        handleWheel={handleWheel}
                        handleZoomIn={handleZoomIn}
                        handleZoomOut={handleZoomOut}
                        textColor={textColor}
                        fillColor={fillColor}
                        countType={countType}
                        scaleUnits={scalUnits}
                        isDrag={isDrag}
                        selectedShape={selectedShape}
                        setSelectedShape={setSelectedShape}
                        handleDragEnd={handleDragEnd}
                        handleMsrOprations={handleMsrOprations}
                      />
                    )}
                    {selectedTakeOffTab == 'overview' && (
                      <div className="w-full flex justify-center items-center p-5 flex-col mt-14">
                        {Array.isArray(takeOff?.files) &&
                          takeOff.files.map((fl: any, flind: number) => {
                            return (
                              <div
                                className="flex flex-col w-full mb-5"
                                key={flind}
                              >
                                <div
                                  onClick={() => {
                                    if (
                                      closedFilesIndArray?.some(
                                        (i) => i == flind
                                      )
                                    ) {
                                      setclosedFilesIndArray((ps) =>
                                        ps.filter((i) => i != flind)
                                      );
                                    } else {
                                      setclosedFilesIndArray((ps) => [
                                        ...ps,
                                        flind,
                                      ]);
                                    }
                                  }}
                                  className="my-5 flex cursor-pointer bg-lavenderPurpleReplica bg-opacity-10 w-max p-2 rounded-xl text-lavenderPurpleReplica items-center gap-x-2"
                                >
                                  <FolderFilled className="text-3xl" />
                                  <span>{fl?.name?.slice(0, 40)}</span>
                                </div>
                                <div className="grow flex flex-wrap gap-3 gap-y-5">
                                  {!closedFilesIndArray?.some(
                                    (i: any) => i == flind
                                  ) &&
                                    Array.isArray(takeOff?.pages) &&
                                    takeOff?.pages
                                      ?.filter(
                                        (i: any) => i?.fileId == fl?.fileId
                                      )
                                      ?.slice()
                                      ?.sort(
                                        (a: any, b: any) => a?.index - b?.index
                                      )
                                      ?.map((page: any, index: number) => {
                                        return (
                                          <>
                                            <div
                                              key={page?.pageId}
                                              className="relative cursor-pointer border rounded-2xl"
                                              onClick={() => {
                                                setselectedTakeOffTab('page');
                                                if (
                                                  !selectedPagesList?.find(
                                                    (i: any) =>
                                                      i?.pageId == page?.pageId
                                                  )
                                                ) {
                                                  setselectedPagesList(
                                                    //@ts-ignore
                                                    (ps: any) => [...ps, page]
                                                  );
                                                }
                                                setselectedPage(page);
                                              }}
                                            >
                                              <NextImage
                                                className="rounded-t-2xl"
                                                src={page?.src}
                                                width={getWidth(page, 300)}
                                                height={300}
                                                alt=""
                                                onLoad={() =>
                                                  handleImageLoad(index)
                                                }
                                              />
                                              {isImgLoading(index) && (
                                                <div className="rounded-t-2xl absolute top-0 left-0 w-[100%] h-[100%] bg-slate-300 flex justify-center items-center bg-opacity-30">
                                                  <Spin />
                                                </div>
                                              )}
                                              <div className="flex justify-between items-center w-full px-3 py-5 !bg-gray-100 !rounded-b-2xl">
                                                <div className="font-[500] text-gray-600">
                                                  {page?.name?.slice(0, 30) ??
                                                    'Unkonw'}
                                                </div>
                                                <div
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                  }}
                                                >
                                                  <Dropdown
                                                    overlay={menu(page)}
                                                    trigger={['click']}
                                                  >
                                                    <MoreOutlined
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                      }}
                                                      className="cursor-pointer text-[20px]"
                                                    />
                                                  </Dropdown>
                                                </div>
                                              </div>
                                              <div
                                                className="absolute top-[-14px] right-[-5px] rounded-full border text-xl flex items-center justify-center w-9 h-9 bg-white cursor-pointer text-gray-500"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleMenuClick(
                                                    'delete',
                                                    page
                                                  );
                                                }}
                                              >
                                                <CloseOutlined />
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                    {selectedTakeOffTab == 'file' && (
                      <div className="w-full h-full flex justify-center items-center p-5">
                        <div className="grow flex flex-col mt-32 h-full w-full gap-y-2 justify-center items-center">
                          {/* <label className='relative w-[70%] h-[60%]' htmlFor="file-selector">
                            <input type="file" accept="application/pdf" multiple id='file-selector' className='hidden absolute top-0 left-0' style={{ display: 'none' }} onChange={(e: any) => {
                              console.log(e.target.result, " ==> event.target.result")
                              if (e.target.files?.length > 0) {
                                const arr = Object.keys(e.target?.files)?.map((it: any, ind: number) => {
                                  if (Number.isInteger(Number(it))) {
                                    return e?.target?.files[it]
                                  }
                                })
                                // setselectedFiles(arr)
                              }
                            }} />
                            <div className='cursor-pointer w-[100%] h-[100%] border-[2px] border-dashed rounded-lg flex items-center justify-center' >
                              <div className='w-[70%] h-[80%] flex flex-col items-center justify-evenly'>
                                <img className='w-[15%]' src={'/takeoff/uploadIcon.png'} alt="" />
                                <h4 className='text-gray-700' >Drag and Drop your files here</h4>
                                <p className='text-gray-400'>or</p>
                                <Button
                                  className='text-lavenderPurpleReplica font-bold border border-transparent bg-lavenderPurpleReplica bg-opacity-10 hover:!border-lavenderPurpleReplica hover:!text-lavenderPurpleReplica'
                                >Select file</Button>
                              </div>
                            </div>
                          </label> */}
                          {/* <div className='border-[2px] border-dashed w-[70%]' >
                            <div
                              className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white"
                            >
                              <TertiaryHeading
                                className="text-graphiteGray mb-4 "
                                title="Processing Files"
                              />
                              <p>This is one time process and might take few minutes. Kindly don't close or reload tabs to continue.</p>
                              <div className='flex flex-col gap-y-10 w-full p-5'>
                                <div className='flex gap-2 flex-col'>
                                  <div className='flex gap-2'>
                                    <p className='whitespace-nowrap'>{'First.pdf'}</p>
                                    <Progress percent={50} />
                                  </div>
                                  <div className='flex gap-3'>
                                    <Progress size={'small'} type='circle' percent={60} />
                                    <Progress size={'small'} type='circle' percent={60} status='exception' />
                                  </div>
                                </div>
                                <div className='flex gap-2 flex-col'>
                                  <div className='flex gap-2'>
                                    <p className='whitespace-nowrap'>{'First.pdf'}</p>
                                    <Progress percent={50} />
                                  </div>
                                  <div className='flex gap-3'>
                                    <Progress size={'small'} type='circle' percent={60} />
                                    <Progress size={'small'} type='circle' percent={60} status='exception' />
                                  </div>
                                </div>
                                <div className='flex gap-2 flex-col'>
                                  <div className='flex gap-2'>
                                    <p className='whitespace-nowrap'>{'First.pdf'}</p>
                                    <Progress percent={50} />
                                  </div>
                                  <div className='flex gap-3'>
                                    <Progress size={'small'} type='circle' percent={60} />
                                    <Progress size={'small'} type='circle' percent={60} status='exception' />
                                  </div>
                                </div>
                              </div>
                              <div className="self-end flex justify-end items-center gap-5 md:mt-4 my-3">
                                {true && <div>
                                  <CustomButton
                                    className=" !border-celestialGray !shadow-scenarySubdued2 !text-graphiteGray !bg-snowWhite"
                                    text="Cancel"
                                  // onClick={() => { setModalOpen(false) }}//router.back()
                                  // isLoading={isLoading}
                                  />
                                </div>}
                                <div>
                                  <CustomButton
                                    // isLoading={isLoading}//isLoading
                                    // text={shouldContinue ? "Continue" : "Start Process"}
                                    text={"Start Process"}
                                  // onClick={() => {
                                  //   if (shouldContinue == true) {
                                  //     makeApiCall()
                                  //   } else {
                                  //     if (processFiles) {
                                  //       processFiles(); setisCancelAble(false);
                                  //     }
                                  //   }
                                  // }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div> */}
                          <div className="grow flex w-full">
                            {/* {fullData?.files && Array.isArray(fullData?.files) && fullData?.files?.length > 0 && <div className='flex flex-col gap-y-7 w-[40%]'>
                              {fullData?.files && Array.isArray(fullData?.files) && fullData?.files?.length > 0 &&
                                <CustomButton
                                  text={`Add ${selectedFiles?.length} files to workspace`}
                                  className="!w-auto"
                                  // icon="plus.svg"
                                  iconwidth={20}
                                  iconheight={20}
                                  isLoading={isApiCalling}
                                  onClick={() => {
                                    // setprogressModalOpen(true) 
                                    addFileToWorkspace()
                                  }}
                                />
                              }
                              {selectedFiles && Array.isArray(selectedFiles) && selectedFiles?.length > 0 && <h4 className='text-gray-600'>{selectedFiles?.length} uploaded files</h4>}
                              <ul className='list-none flex flex-col gap-y-5'>
                                {
                                  fullData?.files && Array.isArray(fullData?.files) && fullData?.files?.length > 0 && fullData?.files?.map((it: any, ind: number) => {
                                    const totalProgress = fullData?.pages?.filter((i: any) => { return i?.fileId == it?.fileId })
                                    return <li key={ind} className='inline-flex gap-3 items-center justify-center'>
                                      <img src={'/fileCSV.png'} alt='' width={35} height={35} />
                                      <span data-tooltip={`${it?.name}`} className='whitespace-nowrap text-gray-500'>{`${it?.name?.slice(0, 4)}`}</span>
                                      <Progress percent={(totalProgress && Array.isArray(totalProgress) ? Math.ceil((totalProgress?.length / it?.totalPages) * 100) : 0)} strokeColor={'#007AB6'} />
                                    </li>
                                  })
                                }
                              </ul>
                            </div>} */}
                            {selectedFiles &&
                              Array.isArray(selectedFiles) &&
                              selectedFiles?.length > 0 && (
                                <div className="flex flex-col gap-y-7 w-[40%]">
                                  {selectedFiles &&
                                    Array.isArray(selectedFiles) &&
                                    selectedFiles?.length > 0 && (
                                      <CustomButton
                                        text={`Add ${selectedFiles?.length} files to workspace`}
                                        className="!w-auto"
                                        // icon="plus.svg"
                                        iconwidth={20}
                                        iconheight={20}
                                        isLoading={fileLoading}
                                        onClick={() => {
                                          // setprogressModalOpen(true)
                                          // addFileToWorkspace()
                                          if (!fileLoading) {
                                            if (
                                              edit_id &&
                                              edit_id?.length > 0
                                            ) {
                                              getTakeOffDetails(edit_id);
                                              setselectedFiles([]);
                                            }
                                          }
                                        }}
                                      />
                                    )}
                                  {/* {selectedFiles && Array.isArray(selectedFiles) && selectedFiles?.length > 0 && <h4 className='text-gray-600'>{selectedFiles?.length} uploaded files</h4>} */}
                                  <ul className="list-none flex flex-col gap-y-5">
                                    {selectedFiles &&
                                      Array.isArray(selectedFiles) &&
                                      selectedFiles?.length > 0 &&
                                      selectedFiles?.map(
                                        (it: any, ind: number) => {
                                          // const totalProgress = fullData?.pages?.filter((i: any) => { return i?.fileId == it?.fileId })
                                          return (
                                            <li
                                              key={ind}
                                              className="inline-flex gap-3 items-center justify-center"
                                            >
                                              <img
                                                src={'/fileCSV.png'}
                                                alt=""
                                                width={35}
                                                height={35}
                                              />
                                              <span
                                                data-tooltip={`${it?.name}`}
                                                className="whitespace-nowrap text-gray-500"
                                              >{`${it?.name?.slice(0, 4)}`}</span>
                                              {/* <Progress percent={(totalProgress && Array.isArray(totalProgress) ? Math.ceil((totalProgress?.length / it?.totalPages) * 100) : 0)} strokeColor={'#007AB6'} /> */}
                                              {fileState.find(
                                                (i) => i.name == it?.name
                                              )?.status != 'failed' && (
                                                <Progress
                                                  percent={
                                                    fileState.find(
                                                      (i) => i.name == it?.name
                                                    )?.uploadProgress ?? 1
                                                  }
                                                  strokeColor={'#007AB6'}
                                                />
                                              )}
                                              <span className="text-sm text-gray-500">{`(${fileState.find((i) => i.name == it?.name)?.status})`}</span>
                                            </li>
                                          );
                                        }
                                      )}
                                  </ul>
                                </div>
                              )}
                            <div className="grow p-3 !max-h-[500px]">
                              <label
                                className="relative"
                                htmlFor="file-selector"
                              >
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="application/pdf"
                                  id="file-selector"
                                  className="hidden absolute top-0 left-0"
                                  style={{ display: 'none' }}
                                  onChange={(e: any) => {
                                    console.log(
                                      e.target.result,
                                      ' ==> event.target.result'
                                    );
                                    if (e.target.files?.length > 0) {
                                      const arr = Object.keys(
                                        e.target?.files
                                      )?.map((it: any) => {
                                        if (Number.isInteger(Number(it))) {
                                          return e?.target?.files[it];
                                        }
                                      });
                                      console.log(arr, ' array of file to pro');
                                      setselectedFiles((ps: any) => [
                                        ...ps,
                                        ...arr,
                                      ]);
                                      startProcess(arr);
                                    }
                                  }}
                                />
                                <div className="cursor-pointer w-[100%] h-[100%] border-[2px] border-dashed rounded-lg flex items-center justify-center">
                                  <div className="w-[70%] h-[80%] flex flex-col items-center justify-evenly">
                                    <img
                                      className="w-[15%]"
                                      src={'/uploadNew.png'}
                                      alt=""
                                    />
                                    <h4 className="text-gray-700">
                                      Drag and Drop your files here
                                    </h4>
                                    <p className="text-gray-400">or</p>
                                    <Button
                                      onClick={() => {
                                        fileInputRef.current?.click();
                                      }}
                                      className="text-lavenderPurpleReplica font-bold border border-transparent bg-lavenderPurpleReplica bg-opacity-10 hover:!border-lavenderPurpleReplica hover:!text-lavenderPurpleReplica"
                                    >
                                      Select file
                                    </Button>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* } */}
                  </div>
                  {/* <DrawTable /> */}
                  {/* Second Bar to do it At Bottom */}
                  {selectedTakeOffTab == 'page' && (
                    <Draggable disabled={iscolorpickeropen}>
                      <div className="bg-[#F2F2F2] h-[52px] absolute !bottom-0 !w-full flex flex-row items-center justify-center px-4 gap-6 rounded-lg border">
                        {/* <div className="flex flex-row gap-2 items-center">
                          <label>Totals:</label>
                          <Select value="Length ----" />
                        </div> */}
                        <div className="flex flex-row gap-2 items-center">
                          <label>Units:</label>
                          <Select
                            className="w-[64px]"
                            value={unit}
                            onChange={(value) => {
                              setUnit(value);
                              updateColorSizes('textUnit', value);
                            }}
                          >
                            {Units.map((item) => (
                              <Select.Option value={item} key={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                          <label>Border:</label>
                          <InputNumber
                            min={1}
                            max={76}
                            value={border}
                            onChange={(value) => {
                              if (value) setBorder(value);
                              updateColorSizes('strokeWidth', value);
                            }}
                          />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                          <label>Color:</label>
                          <ColorPicker
                            value={color}
                            onChange={(color) => setColor(color.toHexString())}
                            onChangeComplete={(color) => {
                              updateColorSizes('stroke', color.toHexString());
                            }}
                            onOpenChange={setiscolorpickeropen}
                          />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                          <label>Text:</label>
                          <ColorPicker
                            value={textColor}
                            onChangeComplete={(color) => {
                              settextColor(color.toHexString());
                              updateColorSizes(
                                'textColor',
                                color.toHexString()
                              );
                            }}
                            onOpenChange={setiscolorpickeropen}
                          />
                        </div>
                        <div
                          className="flex flex-row gap-2 items-center"
                          // onClick={}
                        >
                          <label>Fill:</label>
                          {/* <NextImage src={'/selectedScale.svg'} alt={'zoomicon'} width={19.97} height={11.31} /> */}
                          <ColorPicker
                            value={fillColor ?? '#ffffff'}
                            onChangeComplete={(value) => {
                              handleRoomColorChange(value?.toRgbString());
                              updateColorSizes(
                                'fillColor',
                                value?.toRgbString()
                              );
                            }}
                            onOpenChange={setiscolorpickeropen}
                          />
                          {/* <span
                            className={twMerge(
                              `text-xs capitalize`
                            )}
                          >
                            {"Room Color"}
                          </span> */}
                        </div>
                        {tool.selected === 'volume' && (
                          <InputNumber
                            type="number"
                            min={1}
                            placeholder="Depth"
                            onChange={(value) => value && setDepth(value)}
                          />
                        )}
                        {/* <input placeholder='Add Custom Category' className='p-1' type='text' value={inputtxt} onChange={(e: any) => { setinputtxt(e.target.value) }} />
            <button className='bg-RoyalPurple cursor-pointer text-white p-1 rounded font-bold' onClick={() => { if (inputtxt?.length > 0) { setallCategories((ps: any) => ([...ps, inputtxt])); setselectedCategory(inputtxt); setinputtxt(""); } }} >Add</button>
            {
              allCategories?.map((it: any, ind: number) => {
                const isSelected = it == selectedCategory
                return <div className={`cursor-pointer p-1 rounded text-white ${isSelected ? '!bg-RoyalPurple' : 'bg-slate-400'}`}
                  onClick={() => {
                    if (isSelected) {
                      setselectedCategory("")
                    } else {
                      setselectedCategory(it)
                    }
                  }} >
                  {it}
                </div>
              })
            } */}
                      </div>
                    </Draggable>
                  )}
                </div>
                {tool.selected === 'scale' && (
                  <ModalComponent open={showModal} setOpen={setShowModal}>
                    <ScaleModal
                      // numOfPages={uploadFileData.length}
                      numOfPages={takeOff?.pages?.length ?? 0}
                      setModalOpen={setShowModal}
                      drawScale={drawScale}
                      setdrawScale={setdrawScale}
                      scaleLine={scaleLine}
                      handleSetScale={handleSetScale}
                    />
                  </ModalComponent>
                )}
                <ModalComponent
                  open={reportModal}
                  setOpen={setreportModal}
                  width="100vw"
                >
                  <ReportModal
                    setModalOpen={setreportModal}
                    takeOff={takeOff}
                    modalOpen={reportModal}
                    takeOffMsr={takeOffMsr}
                  />
                </ModalComponent>
                <ModalComponent open={progressModalOpen} setOpen={() => {}}>
                  <CreateProgressModal
                    setModalOpen={setprogressModalOpen}
                    files={selectedFiles}
                    pages={allPages}
                    processFiles={startProcess} //{processRequest}
                    fullData={fullData}
                    isLoading={isLoading}
                    setisLoading={setisLoading}
                    makeApiCall={makeApiCall}
                    isApiCalling={isApiCalling}
                  />
                </ModalComponent>
                {/* {showModal && ( */}
                {/* <ModalComponent open={showSelectModal} setOpen={()=>{}}>
              <SelectPageModal
                numOfPages={uploadFileData.length}
                setModalOpen={setshowSelectModal}
                uploadFileData={uploadFileData}
                handleSrc={handleSrc}
              />
            </ModalComponent> */}
                {/* )} */}
                {/* </section> */}
              </>
            </>
            {/* End Here New Take Off */}
          </div>
        </div>
      </section>
    </>
  );
};

export default withAuth(TakeOffNewPage);
