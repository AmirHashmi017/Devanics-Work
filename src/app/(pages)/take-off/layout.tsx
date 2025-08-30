'use client';
import { useState } from 'react';
import {
  DrawHistoryContext,
  ReportDataContext,
  ScaleContext,
  UploadFileContext,
  EditContext,
} from './context';
import { UploadFileData } from './context/UploadFileContext';
import { DrawHistoryContextInterface } from './context/DrawHistoryContext';
import { DrawInterface } from './types';
import { ScaleDataContextInterface } from './context/ScaleContext';
import { ReportDataInterface } from './context/ReportDataContext';

const TakeOffLayout: React.FC<any> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reportData, setReportData] = useState<ReportDataInterface[]>([]);
  const [uploadFileData, setUploadFileData] = useState<UploadFileData[]>([]);
  const [editData, seteditData] = useState<any>([]);
  const [drawHistory, setDrawHistory] =
    useState<DrawHistoryContextInterface | null>(null);
  const [scaleData, setScaleData] = useState<ScaleDataContextInterface | null>(
    null
  );

  const handleSrc = (value: UploadFileData[], isAppend?: boolean) => {
    if (isAppend == true) {
      setUploadFileData((ps: any) => [...ps, value]);
    } else {
      setUploadFileData(value);
    }
  };
  const handleEdit = (value: any[]) => seteditData(value);

  const handleScaleData = (value: ScaleDataContextInterface) => {
    console.log(
      value,
      ' ===> Area Calculation values to log handleScaleData function'
    );
    setScaleData(value);
  };

  const deleteDrawHistory = (pageNumber: string, value: DrawInterface) => {
    setDrawHistory((prev) => ({ ...prev, [pageNumber]: value }));
  };

  const setInitialEditDrawHistory = (value: any) => setDrawHistory(value);

  const updateDrawHistory = (pageNumber: string, shape: string, value: any) => {
    setDrawHistory((prev) => {
      if (prev && !!(prev as any)?.[pageNumber]?.[shape]) {
        return {
          ...prev,
          [pageNumber]: {
            ...prev[pageNumber],
            [shape]: [...(prev as any)[pageNumber][shape], value],
          },
        };
      } else {
        return {
          ...prev,
          [pageNumber]: {
            ...prev?.[pageNumber],
            [shape]: [value],
          },
        } as any;
      }
    });
  };

  const handleReportData = (data: ReportDataInterface[]) => setReportData(data);

  const updateProjectNameInReportData = (
    date: Date,
    pageNumber: string,
    newProjectName: string,
    type?: string
  ) => {
    setReportData((prev) => {
      return prev.map((item) => {
        if (
          new Date(item.date).valueOf() === new Date(date).valueOf() &&
          item.pageLabel === pageNumber
        ) {
          return {
            ...item,
            projectName: newProjectName,
          };
        } else return item;
      });
    });
    setDrawHistory((prev) => {
      return {
        ...prev,
        [pageNumber]: {
          //@ts-ignore
          ...prev[pageNumber],
          //@ts-ignore
          [type]: prev[pageNumber][type]?.map((item: any) => {
            if (
              new Date(item.dateTime).valueOf() === new Date(date).valueOf()
            ) {
              return { ...item, projectName: newProjectName };
            } else return item;
          }),
        },
      };
    });
  };
  const updateCategoryInReportData = (
    date: Date,
    pageNumber: string,
    newProjectName: string,
    type?: string
  ) => {
    setReportData((prev) => {
      return prev.map((item) => {
        if (
          new Date(item.date).valueOf() === new Date(date).valueOf() &&
          item.pageLabel === pageNumber
        ) {
          return {
            ...item,
            category: newProjectName,
          };
        } else return item;
      });
    });
    setDrawHistory((prev) => {
      return {
        ...prev,
        [pageNumber]: {
          //@ts-ignore
          ...prev[pageNumber],
          //@ts-ignore
          [type]: prev[pageNumber][type]?.map((item: any) => {
            if (
              new Date(item.dateTime).valueOf() === new Date(date).valueOf()
            ) {
              return { ...item, category: newProjectName };
            } else return item;
          }),
        },
      };
    });
  };

  const updateProjectColorInReportData = (
    date: Date,
    pageNumber: string,
    newProjectName: string,
    type?: any
  ) => {
    setReportData((prev) => {
      return prev.map((item) => {
        if (
          new Date(item.date).valueOf() === new Date(date).valueOf() &&
          item.pageLabel === pageNumber
        ) {
          return {
            ...item,
            color: newProjectName,
          };
        } else return item;
      });
    });
    setDrawHistory((prev) => {
      return {
        ...prev,
        [pageNumber]: {
          //@ts-ignore
          ...prev[pageNumber],
          //@ts-ignore
          [type]: prev[pageNumber][type]?.map((item: any) => {
            if (
              new Date(item.dateTime).valueOf() === new Date(date).valueOf()
            ) {
              return { ...item, stroke: newProjectName };
            } else return item;
          }),
        },
      };
    });
  };
  console.log(
    reportData,
    ' ===> Report Data',
    drawHistory,
    ' ===> Draw History'
  );

  return (
    <ReportDataContext.Provider
      value={{
        reportData,
        handleReportData,
        updateProjectNameInReportData,
        updateProjectColorInReportData,
        updateCategoryInReportData,
      }}
    >
      <DrawHistoryContext.Provider
        value={{
          drawHistory,
          deleteDrawHistory,
          updateDrawHistory,
          setInitialEditDrawHistory,
        }}
      >
        <EditContext.Provider value={{ editData, handleEdit }}>
          <UploadFileContext.Provider value={{ uploadFileData, handleSrc }}>
            <ScaleContext.Provider value={{ scaleData, handleScaleData }}>
              {children}
            </ScaleContext.Provider>
          </UploadFileContext.Provider>
        </EditContext.Provider>
      </DrawHistoryContext.Provider>
    </ReportDataContext.Provider>
  );
};

export default TakeOffLayout;
