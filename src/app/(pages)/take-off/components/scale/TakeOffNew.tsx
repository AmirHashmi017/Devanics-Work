import CustomButton from '@/app/component/customButton/button';
import { bg_style } from '@/globals/tailwindvariables';
import {
  CloudUploadOutlined,
  FileOutlined,
  FolderOutlined,
  LeftOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { Button, Input, Table } from 'antd';
// import { ColumnsType } from 'antd/es/table'

const columns: any = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: any, record: any) => (
      <div className="flex items-center h-full">
        {record.isParent == true ? (
          <FolderOutlined className="mr-2" />
        ) : (
          <FileOutlined className="mr-2" />
        )}
        {text}
      </div>
    ),
  },
];

// const data: any[] = [
//     {
//         key: 1,
//         name: 'John Brown',
//         age: 32,
//         address: 'New York No. 1 Lake Park',
//         description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
//     },
//     {
//         key: 2,
//         name: 'Jim Green',
//         age: 42,
//         address: 'London No. 1 Lake Park',
//         description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
//     },
//     {
//         key: 3,
//         name: 'Not Expandable',
//         age: 29,
//         address: 'Jiangsu No. 1 Lake Park',
//         description: 'This not expandable',
//     },
//     {
//         key: 4,
//         name: 'Joe Black',
//         age: 32,
//         address: 'Sydney No. 1 Lake Park',
//         description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
//     },
// ];
const pages = [
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'secondfile.pdf' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
  {
    id: 787,
    name: 'firstpage',
    bucketUrl: '',
    file: { id: 45, name: 'Filename' },
    page: 1,
    status: 'Complete',
  },
];

const groupDataForFileTable = (input: any[]) => {
  const groupedData = input.reduce((result: any, currentItem: any) => {
    const { id, name, bucketUrl, file, page, status } = currentItem;

    // Check if there's already an entry with the same projectName and pageLabel
    const existingEntry = result.find(
      (entry: any) =>
        // entry.projectName === projectName && entry.pageLabel === pageLabel
        entry.file?.name === file?.name
    );

    if (existingEntry) {
      existingEntry.children.push({
        id,
        name,
        bucketUrl,
        file,
        page,
        status,
      });
    } else {
      result.push({
        key: result.length + 1, // Assuming keys start from 1
        id,
        name: file?.name,
        isParent: true,
        bucketUrl,
        file,
        page,
        status,
        children: [
          {
            id,
            name,
            bucketUrl,
            file,
            page,
            status,
          },
        ],
      });
    }

    return result;
  }, []);

  return groupedData;
};

// const { DirectoryTree, TreeNode } = Tree;
const TakeOffNew = () => {
  const [leftOpened, setleftOpened] = useState<boolean>(false);
  return (
    <>
      {/* <section className="md:px-16 px-8 pb-4"> */}
      <div className="flex justify-between">
        <h2>Project Name showing here</h2>
        <CustomButton
          text="Generate Report"
          className="!w-auto"
          // icon="plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => {}}
        />
      </div>

      {/* grid place-items-center shadow-sceneryShadow  */}
      <div
        className={`flex gap-x-5 justify-between rounded-lg my-4 shadow-none ${bg_style} h-[800px] flex flex-wrap justify-between !bg-transparent`}
      >
        {/* Left Bar */}
        {leftOpened && (
          <div className="w-[25%] h-[100%] rounded-2xl shadow-secondaryTwist border flex flex-col">
            {/* sideBarHeader */}
            <div className="w-[full] h-[25%] border-b bg-gradient-to-r from-[#8449EB]/5 to-[#6A56F6]/5 flex flex-col p-3 bg-transparent rounded-t-2xl">
              {/* upper */}
              <div className="h-[75%] flex flex-col justify-evenly">
                <div className="flex gap-x-2">
                  <Button className="bg-[#7138DF] text-white font-semibold">
                    Plans
                  </Button>
                  <Button>Takeoff</Button>
                  <Button>WBS / Category</Button>
                </div>
                <div className="flex gap-x-2 w-[95%]">
                  <Input
                    className="grow"
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                  />
                  <Button
                    className="bg-[#7138DF] text-white font-semibold"
                    icon={<CloudUploadOutlined className="text-[16px]" />}
                  >
                    Upload
                  </Button>
                </div>
              </div>
              {/* lower */}
              <div className="h-[25%] flex justify-between gap-x-3 items-center">
                <div className="grow flex gap-x-4 items-center">
                  <MenuUnfoldOutlined className="text-[#7138DF] text-[20px]" />
                  <span className="font-inter font-[200] text-gray-800">
                    Plan & Documents
                  </span>
                </div>
                <MoreOutlined
                  className="cursor-pointer text-[20px]"
                  // size={90}
                />
              </div>
            </div>
            {/* sideBar Main */}
            <div className="grow flex !border-black">
              <Table
                columns={columns}
                expandable={{
                  // expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
                  rowExpandable: (record) => record?.isParent == true,
                  // expandIcon:(record:any) => <DownOutlined />
                }}
                dataSource={groupDataForFileTable(pages)}
                className="grow bg-transparent transparent-table"
                scroll={{ y: 580, scrollToFirstRowOnChange: true }}
                pagination={false}
                showHeader={false}
                bordered
                style={{ backgroundColor: 'transparent' }}
                rowClassName={'table-row-transparent'}
                rootClassName="table-row-transparent"
              />
            </div>
          </div>
        )}
        {/* Take Off New */}
        <div className="h-[100%] grow rounded-2xl shadow-secondaryTwist border relative">
          <div
            className="absolute top-[25px] left-[-13px] cursor-pointer border-[2px] rounded-full flex justify-center items-center p-1 text-gray-600 bg-white"
            onClick={() => {
              setleftOpened((ps) => !ps);
            }}
          >
            {leftOpened ? <LeftOutlined /> : <RightOutlined />}
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeOffNew;
