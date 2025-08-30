import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Checkbox,
  Drawer,
  Form,
  Input,
  Table,
  DatePicker,
  Tag,
  Select,
  ConfigProvider,
  Dropdown,
} from 'antd';

import { type ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import Image from 'next/image';
import { PlusOutlined } from '@ant-design/icons';

import { scheduleService } from '@/app/services/schedule.service';
import QuinaryHeading from '@/app/component/headings/quinary';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import type {
  IWBSType,
  ActivityItem,
} from '@/app/interfaces/schedule/createSchedule.interface';
import { toast } from 'react-toastify';
import moment from 'moment';

const columns: ColumnType<{}>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: '0',
    width: 50,
    render(d, record: any) {
      return (
        <div className="pl-4">
          {record._id.substring(record._id.length - 3)}
        </div>
      );
    },
  },
  {
    title: 'Activities',
    dataIndex: 'description',
    key: '1',
    width: 200,
  },
  {
    title: 'Original Duration',
    dataIndex: 'orignalDuration',
    key: '2',
    width: 100,
    align: 'center',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: '2',
    width: 170,
  },
  {
    title: 'Start',
    dataIndex: 'start',
    key: '3',
    width: 120,
  },
  {
    title: 'Finish',
    dataIndex: 'finish',
    key: '4',
    width: 120,
  },
  {
    title: 'Actual Start',
    dataIndex: 'actualStart',
    key: '5',
    width: 120,
  },
  {
    title: 'Actual Finish',
    dataIndex: 'actualFinish',
    key: '6',
    width: 120,
  },
  {
    title: 'Remaining Duration',
    dataIndex: 'remainingDuration',
    width: 100,
    key: '7',
    align: 'center',
  },
  {
    title: 'Schedule % Completed',
    dataIndex: 'scheduleCompleted',
    width: 100,
    key: '8',
    align: 'center',
  },
  {
    title: 'Total Float',
    dataIndex: 'totalFloat',
    width: 70,
    key: '9',
    align: 'center',
  },
  {
    title: 'Activity Type',
    dataIndex: 'activityType',
    width: 140,
    key: '10',
    align: 'center',
  },
  {
    title: 'Predecessors',
    dataIndex: 'predecessors',
    width: 100,
    key: '11',
  },
  {
    title: 'Successors',
    dataIndex: 'successors',
    width: 100,
    key: '12',
  },
  {
    title: 'Activity Calendar',
    dataIndex: 'activityCalendar',
    width: 100,
    key: '13',
  },
];

const defaultCheckedList = columns.map((item, i) => i % 2 === 0 && item.key);

type Props = {
  updateWbsScopeItems(_id: string, _scopeItems: ActivityItem[]): void;
  wbs: IWBSType;
};
export function ScheduleTable({ updateWbsScopeItems, wbs }: Props) {
  const { projectId } = useParams();

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [filters, setFilters] = useState(defaultCheckedList);
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);

  const showDrawer = () => {
    setFilters(checkedList);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setFilters(checkedList);
  };

  // add item in data
  async function addItem() {
    const item: ActivityItem = {
      activityCalendar: '',
      activityType: '',
      actualFinish: new Date().toDateString(),
      actualStart: new Date().toDateString(),
      description: '',
      finish: new Date().toDateString(),
      orignalDuration: '',
      predecessors: '',
      remainingDuration: '',
      start: new Date().toDateString(),
      scheduleCompleted: '',
      status: 'New',
      successors: '',
      totalFloat: '',
    };

    scheduleService
      .httpAddProjectDivActivity({
        projectId: projectId,
        divId: wbs._id,
        data: item,
      })
      .then((response) => {
        const newData = [
          ...wbs.scheduleProjectActivities,
          response.data?.newProjectAcitivity,
        ];
        updateWbsScopeItems(wbs._id, newData);
      })
      .catch(() => {
        toast.error('Something went wrong');
      });
  }

  async function updateRow(record: ActivityItem) {
    record['orignalDuration'] = record.orignalDuration
      ? String(record.orignalDuration)
      : '';

    scheduleService
      .httpUpdateProjectDivActivity({ activityId: record._id, data: record })
      .then((response) => {
        const newData = [...wbs.scheduleProjectActivities];

        const index = newData.findIndex((item) => item._id === record._id);
        newData[index] = response.data?.updateProjectAcitivity;
        updateWbsScopeItems(wbs._id, newData);
      })

      .catch(() => {
        toast.error('Something went wrong');
      });
  }

  async function deleteRow(record: ActivityItem) {
    const newData = wbs.scheduleProjectActivities.filter(
      (item: any) => item._id !== record._id
    );
    updateWbsScopeItems(wbs._id, newData);

    await scheduleService.httpDeleteProjectDivActivity({
      activityId: record._id,
    });
  }

  let newColumns = columns
    .map((item) => ({
      ...item,
      title: (
        <QuaternaryHeading
          title={item.title as string}
          className="text-sm font-medium tracking-wide"
        />
      ),
      editable: item.dataIndex === 'id' ? false : true,
      dataIndex: item.dataIndex,
      hidden: !checkedList.includes(item.key as string),
    }))
    .map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: ActivityItem) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex as string,
          title: col.title,
          handleSave(record: ActivityItem) {
            updateRow(record);
          },
        }),
      };
    });

  const extras: (ColumnType<any> & {
    editable: boolean;
    hidden: boolean;
  })[] = [
    {
      title: <QuinaryHeading title="Actions" />,
      dataIndex: 'actions',
      key: 'actions',
      editable: false,
      //@ts-ignore
      hidden: false,
      render(_: any, record: ActivityItem) {
        return (
          <Dropdown
            className="!bg-grey"
            menu={{
              items: [
                {
                  key: 'view',
                  label: <p>View Details</p>,
                  onClick: () => {
                    setOpenDetails(true);
                    setSelectedItem(record);
                  },
                },
                {
                  key: 'predecessors',
                  label: <p>Predecessors</p>,
                },
                {
                  key: 'successors',
                  label: <p>Successors</p>,
                },
                {
                  key: 'delete',
                  label: <p>Delete</p>,
                  onClick: () => {
                    deleteRow(record);
                  },
                },
              ],
            }}
            placement="bottomRight"
          >
            <Image
              src={'/menuIcon.svg'}
              alt="logo white icon"
              width={20}
              height={20}
              className="active:scale-105 cursor-pointer"
            />
          </Dropdown>
        );
      },
      fixed: 'right',
      align: 'center',
      width: 100,
    },
    {
      title: <PlusOutlined className="text-lg" onClick={showDrawer} />,
      //@ts-ignore
      hidden: false,
      render: () => null,
      editable: false,
      dataIndex: 'plus',
      fixed: 'right',
      width: 50,
    },
  ];

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  console.log(selectedItem, 'selectedItemselectedItem');

  return (
    <div>
      <Drawer
        title="Customise Table"
        onClose={onClose}
        open={open}
        keyboard={false}
        closable={false}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className="flex justify-between py-2 space-x-2">
            <WhiteButton text="Cancel" onClick={onClose} />
            <CustomButton
              text="Apply Filters"
              onClick={() => {
                onClose();
                setCheckedList(filters);
              }}
            />
          </div>
        }
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#6941C6',
              fontSize: 20,
            },
          }}
        >
          <Checkbox.Group
            style={{ width: '100%' }}
            value={filters as string[]}
            onChange={(value) => {
              setFilters(value as string[]);
            }}
          >
            <div className="grid grid-cols-12 gap-4">
              {options.map(({ label, value }, index) => (
                <div key={index} className="col-span-12">
                  <Checkbox
                    value={value}
                    className="text-gray-500 text-base font-light"
                  >
                    {label as string}
                  </Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>
        </ConfigProvider>
      </Drawer>

      <Drawer
        title={
          <Tag
            color="#F9F5FF"
            className="rounded-full py-1"
            style={{ color: '#6941C6' }}
          >
            Inprogress
          </Tag>
        }
        open={openDetails}
        onClose={() => setOpenDetails(false)}
      >
        {selectedItem ? (
          <>
            <div>
              <QuaternaryHeading title={selectedItem.description} />
              <div className="flex items-center justify-between">
                <QuinaryHeading title="Activity" />
                <QuinaryHeading title={'A102'} />
              </div>

              <div className="flex items-center justify-between">
                <QuinaryHeading title="Original Duration" />
                <QuinaryHeading title={selectedItem.orignalDuration} />
              </div>

              <div className="flex items-center justify-between">
                <QuinaryHeading title="Start" />
                <QuinaryHeading
                  title={dayjs(selectedItem.start).format('DD/MM/YYYY')}
                />
              </div>

              <div className="flex items-center justify-between">
                <QuinaryHeading title="Finish" />
                <QuinaryHeading
                  title={dayjs(selectedItem.finish).format('DD/MM/YYYY')}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <QuinaryHeading title="Assign" />
                  <PlusOutlined className="border cursor-pointer text-base rounded-full bg-[#b1b3b6] text-[#667085] p-2" />
                </div>
                <div>
                  <QuinaryHeading title="Status" />
                  <Tag
                    color="#F9F5FF"
                    className="rounded-full py-1"
                    style={{ color: '#6941C6' }}
                  >
                    Inprogress
                  </Tag>
                </div>
              </div>

              <div className="flex items-center space-x-4 justify-between">
                <DateInputComponent
                  label="Actual Start"
                  name="actualStart"
                  inputStyle="border-gray-200"
                  defaultValue={dayjs(selectedItem.actualStart)}
                />
                <DateInputComponent
                  label="Actual Finish"
                  name="actualFinish"
                  inputStyle="border-gray-200"
                  defaultValue={dayjs(selectedItem.actualFinish)}
                />
              </div>

              <div className="flex items-center space-x-4 justify-between">
                <SelectComponent
                  label="Activity Type"
                  name="activityType"
                  placeholder="Activity Type"
                  field={{
                    options: [
                      { label: 'Finish Milestone', value: 'Finish Milestone' },
                      { label: 'Start milestone', value: 'Start milestone' },
                      { label: 'Task Dependent', value: 'Task Dependent' },
                    ],
                    className: 'mt-1',
                  }}
                />

                <InputComponent
                  label="Activity Calender"
                  name="activityCode"
                  type="text"
                  placeholder="Activity Calender"
                />
              </div>
            </div>

            <div className="mt-4">
              <QuinaryHeading title="Predecessors" />

              <div className="flex items-center space-x-4 justify-between">
                <SelectComponent
                  label="Relation"
                  name="relation"
                  placeholder="Relation"
                  field={{
                    options: [
                      { label: 'SS', value: 'SS' },
                      { label: 'FF', value: 'FF' },
                      { label: 'SF', value: 'SF' },
                      { label: 'FS', value: 'FS' },
                    ],
                    className: 'mt-1',
                  }}
                />
                <InputComponent
                  label="Lags"
                  name="lags"
                  type="text"
                  placeholder="Lags"
                />
              </div>
            </div>

            <div className="mt-4">
              <QuinaryHeading title="Constraints" />

              <div className="flex items-center space-x-4 justify-between">
                <InputComponent
                  label="Primary"
                  name="primary"
                  placeholder="Primary"
                  type="text"
                />
                <DateInputComponent
                  label="Date"
                  name="date"
                  placeholder="Date"
                  inputStyle="border-gray-200"
                />
              </div>
            </div>
          </>
        ) : null}
      </Drawer>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#F4EBFF',
            },
          },
        }}
      >
        <Table
          columns={[...newColumns, ...extras] as ColumnType<ActivityItem>[]}
          dataSource={wbs.scheduleProjectActivities}
          key={'id'}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          size="small"
          scroll={{ x: 1500, y: 300 }}
          footer={() => {
            return (
              <div
                onClick={() => addItem()}
                className="max-w-max border border-dashed rounded cursor-pointer py-3 px-2 border-[#EAECF0] bg-white"
              >
                <h4 className="space-x-2 tracking-wide">
                  <PlusOutlined />
                  <span>Create New Activity</span>
                </h4>
              </div>
            );
          }}
        />
      </ConfigProvider>
    </div>
  );
}

const EditableContext = createContext<any>(null);

interface EditableRowProps {
  index: number;
}

function EditableRow({ index, ...props }: EditableRowProps) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} key={index}>
      <EditableContext.Provider value={form}>
        <tr {...props} className="bg-white  hover:bg-gray-100" />
      </EditableContext.Provider>
    </Form>
  );
}
interface EditableCellProps {
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof ActivityItem;
  record: ActivityItem;
  handleSave: (_record: ActivityItem) => void;
}

function EditableCell({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;
  const dateDataIndexes = ['start', 'finish', 'actualStart', 'actualFinish'];

  useEffect(() => {
    if (editing) {
      // @ts-ignore
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  function disabledDate(current: any) {
    // Disable all dates before today
    if (current && current < moment().startOf('day')) {
      return true;
    }
    return false;
  }
  let childNode = children;
  const selectOptions = [
    { label: 'New', value: 'New' },
    { label: 'Planned', value: 'Planned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Review', value: 'Review' },
  ];
  if (editable) {
    childNode = editing ? (
      <ConfigProvider
        theme={{
          components: {
            Input: {
              colorPrimary: 'transparent',
              controlOutline: 'transparent',
              colorBorder: 'transparent',
              borderRadius: 0,
            },
            Select: {
              colorPrimary: 'grey',
              colorPrimaryHover: 'transparent',
              colorPrimaryActive: 'transparent',
              colorBorder: 'transparent',
              borderRadius: 0,
            },
            DatePicker: {
              controlHeight: 55,
              borderRadius: 0,
              colorPrimary: 'white',
              colorBorder: 'transparent',
              controlOutline: 'transparent',
            },
            Tag: {
              defaultColor: 'transparent',
              defaultBg: 'transparent',
              borderRadius: 0,
            },
          },
        }}
      >
        <Form.Item
          style={{ margin: 0, height: '100%' }}
          name={dataIndex}
          rules={[
            {
              required: false,
              message: `${dataIndex} is required.`,
            },
          ]}
          getValueProps={(i) => {
            return {
              value: dateDataIndexes.includes(dataIndex) ? dayjs(i) : i,
            };
          }}
        >
          {dataIndex === 'status' ? (
            <Select
              ref={inputRef}
              onBlur={save}
              onChange={save}
              value={record[dataIndex]}
              defaultOpen
              autoFocus
              style={{ height: '40px', margin: '1px 0px' }}
            >
              {selectOptions.map((option, i) => {
                return (
                  <Select.Option value={option.value} key={i}>
                    <Tag
                      bordered={undefined}
                      className={`w-full border-none space-x-2 py-[2px]`}
                    >
                      <span
                        style={{
                          borderColor: returnStatusColor(
                            option.value as IWBSType['scheduleProjectActivities'][0]['status']
                          ),
                        }}
                        className={`border-2 rounded mr-1`}
                      >
                        {' '}
                      </span>
                      <span className="font-medium text-black text-sm">
                        {option.label}
                      </span>
                    </Tag>
                  </Select.Option>
                );
              })}
            </Select>
          ) : dateDataIndexes.includes(dataIndex) ? (
            <DatePicker
              ref={inputRef}
              onChange={save}
              value={dayjs(record[dataIndex])}
              onBlur={save}
              //@ts-ignore
              //@ts-nocheck
              disabledDate={disabledDate}
              autoFocus
              defaultOpen
              style={{ height: '40px' }}
            />
          ) : dataIndex === 'orignalDuration' ? (
            <Input
              style={{ height: '40px' }}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              type="number"
            />
          ) : dataIndex === 'activityType' ? (
            <Select
              ref={inputRef}
              onBlur={save}
              onChange={save}
              value="Finish Milestone"
              defaultValue="Finish Milestone"
              defaultOpen
              autoFocus
              style={{ height: '40px', margin: '1px 0px' }}
            >
              <Select.Option value={'Finish Milestone'}>
                Finish Milestone
              </Select.Option>
              <Select.Option value={'Start Mileston'}>
                Start Milestone
              </Select.Option>
              <Select.Option value={'Task Dependent'}>
                Task Dependent
              </Select.Option>
            </Select>
          ) : (
            <Input
              style={{ height: '40px' }}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          )}
        </Form.Item>
      </ConfigProvider>
    ) : (
      <div
        className={`editable-cell-value-wrap px-4 py-1.5 w-full h-full`}
        style={{ minHeight: 20 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleEdit();
        }}
      >
        {dataIndex === 'status' ? (
          <Tag
            className={`w-full h-full space-x-2 py-1`}
            color={`${returnStatusColor(record[dataIndex])}8C`}
            style={{ filter: 'alpha(opacity=50)' }}
          >
            <span
              style={{ borderColor: returnStatusColor(record[dataIndex]) }}
              className={`border-2 rounded mr-1`}
            >
              {' '}
            </span>
            <span className="font-medium text-black text-sm">
              {record[dataIndex]}
            </span>
          </Tag>
        ) : dateDataIndexes.includes(dataIndex) ? (
          dayjs(record[dataIndex]).format('DD/MM/YYYY')
        ) : (
          children
        )}
      </div>
    );
  }

  return (
    <td
      {...restProps}
      className="!p-0 border bg-white hover:bg-gray-100 box-border"
    >
      {childNode}
    </td>
  );
}

function returnStatusColor(
  status: IWBSType['scheduleProjectActivities'][0]['status']
) {
  if (status === 'Planned') {
    return '#108ee9';
  } else if (status === 'In Progress') {
    return '#3BC8D0';
  } else if (status === 'Completed') {
    return '#87d068';
  } else if (status === 'Review') {
    return 'yellow';
  }
  return '#2db7f5';
}
