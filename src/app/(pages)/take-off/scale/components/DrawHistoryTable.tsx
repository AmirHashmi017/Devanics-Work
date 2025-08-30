import React, { useContext, useEffect } from 'react';
import { ColorPicker, ConfigProvider, Table } from 'antd';
import {
  DrawHistoryContext,
  ReportDataContext,
  ScaleContext,
} from '../../context';
import { DrawHistoryContextProps } from '../../context/DrawHistoryContext';
import { useDraw } from '@/app/hooks';
import moment from 'moment';
import { DrawInterface } from '../../types';
import { ScaleDataContextProps } from '../../context/ScaleContext';
import { EditableText } from '@/app/component/EditableText';
import {
  ReportDataContextProps,
  ReportDataInterface,
} from '../../context/ReportDataContext';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/authSlices/auth.selector';

interface Props {
  searchProjectName: string;
}

const DrawHistoryTable: React.FC<Props> = ({ searchProjectName }) => {
  const { scaleData } = useContext(ScaleContext) as ScaleDataContextProps;
  const { getProjectAndCommentNameForTable, groupDataForTable } = useDraw();
  const { drawHistory } = useContext(
    DrawHistoryContext
  ) as DrawHistoryContextProps;
  const {
    reportData,
    handleReportData,
    updateProjectNameInReportData,
    updateProjectColorInReportData,
    updateCategoryInReportData,
  } = useContext(ReportDataContext) as ReportDataContextProps;

  console.log(drawHistory, reportData, ' newDrawHistory');
  const userData = useSelector(selectUser);
  console.log(userData, ' userData');

  useEffect(() => {
    if (drawHistory) {
      const tableData = Object.entries(drawHistory).flatMap(
        ([pageNumber, pageData]) => {
          const payload: ReportDataInterface[] = [];
          Object.entries(pageData).forEach(([drawName, drawData]) => {
            if (drawData.length) {
              const tablePayload = drawData.map((data: any) => {
                const { projectName } = getProjectAndCommentNameForTable(
                  drawName as keyof DrawInterface,
                  data.points,
                  data.depth || 0,
                  scaleData
                    ? scaleData[pageNumber.toString()]
                    : { xScale: `1in=1in`, yScale: `1in=1in`, precision: '1' }
                );

                return {
                  // projectName,//previouse usage
                  projectName: data?.projectName ?? projectName, //new usage
                  category: data?.category ?? projectName, //new usage
                  pageLabel: pageNumber,
                  comment: drawName,
                  author:
                    userData?.user?.name ?? userData?.user?.name ?? 'User',
                  date: data.dateTime,
                  status: '---',
                  color: data.stroke,
                  layer: '---',
                  space: '---',
                  type: drawName,
                  config: {
                    ...data,
                  },
                };
              });

              payload.push(...tablePayload);
            }
          });
          return payload;
        }
      );

      tableData.sort(
        (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
      );

      handleReportData(tableData);
    }
  }, [drawHistory, searchProjectName, scaleData]);

  // const dataSource = useMemo(() => {
  //   return groupDataForTable(reportData).filter(({ projectName = '' }) =>
  //     projectName.includes(searchProjectName)
  //   );
  // }, [reportData, drawHistory, groupDataForTable, searchProjectName]);
  const dataSource = groupDataForTable(reportData);
  console.log(dataSource, ' ===> ===> Report Data DataSource for table');

  return (
    <ConfigProvider theme={{ components: { Table: { headerBg: '#F9F5FF' } } }}>
      <Table
        pagination={false}
        dataSource={dataSource}
        size="small"
        columns={[
          {
            title: 'Measurement Details',
            dataIndex: 'projectName',
            // key: 'projectName',
            render: (value, record) => {
              return !record?.date ? (
                <div>{record?.category}</div>
              ) : (
                <EditableText
                  initialText={value}
                  onPressEnter={(text) => {
                    const { date, pageLabel, type } = record;
                    updateProjectNameInReportData(date, pageLabel, text, type);
                  }}
                />
              );
            },
          },
          {
            title: 'Page Label',
            dataIndex: 'pageLabel',
            // key: 'pageLabel',
          },
          {
            title: 'Type',
            dataIndex: 'comment',
          },
          {
            title: 'Category',
            dataIndex: 'category',
            render: (value, record) => {
              return !record?.date ? (
                <div>{}</div>
              ) : (
                <EditableText
                  initialText={value}
                  onPressEnter={(text) => {
                    const { date, pageLabel, type } = record;
                    updateCategoryInReportData(date, pageLabel, text, type);
                  }}
                />
              );
            },
          },
          {
            title: 'Author',
            dataIndex: 'author',
          },
          {
            title: 'Date',
            dataIndex: 'date',
            render: (value) => {
              return (
                <>
                  {value ? moment(value).format('MMMM Do YYYY, h:mm:ss a') : ''}
                </>
              );
            },
          },
          // {
          //   title: 'Status',
          //   dataIndex: 'status',
          // },
          {
            title: 'Color',
            dataIndex: 'color',
            // render: (value) => (
            //   <div style={{ height: 20, width: 20, background: value }} />
            //   // <ColorPicker
            //   //   value={value}
            //   //   onChange={(color) => setColor(color.toHexString())}
            //   // />
            // ),
            render: (value, record) => {
              return !record?.date ? (
                <div>{value}</div>
              ) : (
                <ColorPicker
                  value={value}
                  onChange={(color) => {
                    const { date, pageLabel, type } = record;
                    updateProjectColorInReportData(
                      date,
                      pageLabel,
                      color.toHexString(),
                      type
                    );
                  }}
                />
                // <EditableText
                //   initialText={value}
                //   onPressEnter={(text) => {
                //     const { date, pageLabel } = record;
                //     updateProjectNameInReportData(date, pageLabel, text);
                //   }}
                // />
              );
            },
          },
          // {
          //   title: 'Layer',
          //   dataIndex: 'layer',
          // },
          // {
          //   title: 'Space',
          //   dataIndex: 'space',
          // },
        ]}
      />
    </ConfigProvider>
  );
};

export default DrawHistoryTable;
