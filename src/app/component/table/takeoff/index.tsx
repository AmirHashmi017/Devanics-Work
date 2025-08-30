import React, { useEffect, useMemo } from 'react';
import { Button, Dropdown, Menu, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { AppDispatch } from '@/redux/store';
import { selectTakeoffSummaries } from '@/redux/takeoffSummaries/takeoffSummaries.Selector';
import {
  deleteSummaries,
  fetchTakeoffSummaries,
} from '@/redux/takeoffSummaries/takeoffSummaries.thunk';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
// import { NextRouter } from 'next/router';
// import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { MoreOutlined } from '@ant-design/icons';
// import { useRouter } from 'next/navigation';
// Import your API service

interface DataType {
  key: React.Key;
  name: string; // Changed to match column dataIndex
  scope: string;
  createdAt: string; // Assuming date is returned as a string
  action: string; // Define how you plan to render actions
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Project Name',
    dataIndex: 'name',
  },
  {
    title: 'Total scope of work',
    dataIndex: 'scope',
  },
  {
    title: 'Measurements Date',
    dataIndex: 'createdAt',
  },
  {
    title: 'Deadline',
    dataIndex: 'deadline',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  },
];
export interface ITableProps {
  handleEditClick: (item: any) => void;
  handleEditDetailsClick: (item: any) => void;
  handleDownloadClick: (id: string) => void;
  search: any;
}
const Index: React.FC<ITableProps> = ({
  // handleEditClick,
  handleEditDetailsClick,
  handleDownloadClick,
  search,
}: ITableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const summaries = useSelector(selectTakeoffSummaries);
  const handleMenuClick = (e: any, record?: any) => {
    if (e.key === 'edit') {
      // Handle edit action
      console.log('Edit action', record);
      // handleEditClick(record);
      handleEditDetailsClick(record);
    } else if (e.key === 'delete') {
      // Handle delete action
      console.log('Delete action', record);
      dispatch(deleteSummaries(record?._id));
    } else if (e.key === 'edit_details') {
      // Handle delete action
      console.log('View Details action', record);
      handleEditDetailsClick(record);
    } else if (e.key === 'download' || e.key === 'view_estimate') {
      // Handle delete action
      console.log('Download action', record);
      handleDownloadClick(record?._id ?? null);
    }
  };

  const menu = (it: any) => (
    <Menu
      className="w-[180px]"
      onClick={(e: any) => {
        handleMenuClick(e, it);
      }}
    >
      <Menu.Item key="edit">Edit</Menu.Item>
      {/* <Menu.Item key="edit_details">Edit Details</Menu.Item>s */}
      <Menu.Item key="view_estimate">View TakeOff</Menu.Item>
      <Menu.Item key="download">Download</Menu.Item>
      <Menu.Item key="email">Email</Menu.Item>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    dispatch(fetchTakeoffSummaries({ page: 1, limit: 10 }));
  }, []); // Empty dependency array means this effect runs once on mount

  const formattedData = useMemo(() => {
    let sum =
      search && search?.length > 0
        ? summaries?.filter((i: any) =>
            i.name?.toLowerCase()?.includes(search?.toLowerCase())
          )
        : summaries;
    return sum?.map(
      (item: {
        _id: any;
        name: any;
        url: string;
        scope: { toString: () => any };
        createdAt: string;
        deadline: any;
        pages?: any;
        categories?: string[];
      }) => ({
        key: item?._id, // Assume each item? has a unique id
        name: item?.name,
        scope:
          Array.isArray(item.categories) && item.categories?.length > 0
            ? item.categories?.slice(0, 3).join(', ')
            : '', //item?.pages?.length?.toString(), // Ensure scope is a string
        createdAt: moment(item?.createdAt).format('DD MMM YYYY, HH:mm'),
        deadline: moment(item?.deadline).format('DD MMM YYYY'),
        action: (
          // <span className="flex flex-col space-y-2">
          //   <button
          //     id="editBtn"
          //     onClick={() =>{handleEditClick(item)}}
          //     className="cursor-pointer"
          //   >
          //     Edit
          //   </button>
          //   <button
          //     id="downloadPdfBtn"
          //     onClick={() => downloadPdfFromS3(item?.url)}
          //     className="cursor-pointer"
          //   >
          //     Download PDF
          //   </button>
          //   <button
          //     id="deletePdfBtn"
          //     onClick={() => dispatch(deleteSummaries(item?._id))}
          //     className="cursor-pointer"
          //   >
          //     Delete
          //   </button>
          // </span>
          <Dropdown
            className="flex items-center justify-center"
            overlay={menu(item)}
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<MoreOutlined className="!text-2xl !font-[800]" />}
            />
          </Dropdown>
        ),
      })
    );
  }, [summaries, search]);

  const onChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className="mt-4">
      <Table
        pagination={{ pageSize: 8 }}
        columns={columns}
        dataSource={formattedData}
        onChange={onChange}
      />
    </div>
  );
};

export default Index;

// function downloadPdfFromS3(pdfBlobUrl: string, fileName = 'downloaded.pdf') {
//   console.warn('pdfBlobUrl', pdfBlobUrl);

//   // Fetch the PDF blob using the Fetch API
//   fetch(pdfBlobUrl)
//     .then((response) => {
//       if (response.ok) return response.blob();
//       throw new Error('Network response was not ok.');
//     })
//     .then((blob) => {
//       // Create a local URL for the blob
//       const blobUrl = window.URL.createObjectURL(blob);

//       // Create a temporary link element and trigger the download
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();

//       // Clean up by removing the temporary link element and revoking the blob URL
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     })
//     .catch((error) => console.error('Error downloading the PDF:', error));
// }
