import { createContext } from 'react';
import {
  CountInterface,
  LineInterface,
  PolygonConfigInterface,
} from '../types';

export interface ReportDataInterface {
  projectName: string;
  pageLabel: string;
  comment: string | number;
  author: string;
  date: Date;
  dateTime?: any;
  status: string;
  color: string;
  layer: string;
  space: string;
  type: string;
  config: LineInterface | PolygonConfigInterface | CountInterface;
  category?: any;
  subcategory?: any;
  user?: any;
  text?: any;
}

export interface ReportDataContextProps {
  reportData: ReportDataInterface[];
  handleReportData: (data: ReportDataInterface[]) => void;
  updateProjectNameInReportData: (
    date: Date,
    pageNumber: string,
    newProjectName: any,
    type?: any
  ) => void;
  updateProjectColorInReportData: any;
  updateCategoryInReportData: any;
}

const ReportDataContext = createContext<ReportDataContextProps>({
  reportData: [],
  handleReportData: () => undefined,
  updateProjectNameInReportData: () => undefined,
  updateProjectColorInReportData: () => undefined,
  updateCategoryInReportData: () => undefined,
});

export default ReportDataContext;
