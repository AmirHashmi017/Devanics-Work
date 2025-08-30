'use client';
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import moment from 'moment';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import { Dropdown, type MenuProps, Table, Tag, Select, Input } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import './style.css';
import { toast } from 'react-toastify';

// module imports
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import ModalComponent from '@/app/component/modal';
import { HttpService } from '@/app/services/base.service';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { SetWorkWeek } from './components/SetWorkWeek';
import { IProject } from '@/app/interfaces/schedule/project.schedule.interface';
import { ISchedule } from '@/app/interfaces/schedule/schedule.type';
import FormControl from '@/app/component/formControl';
import { scheduleService } from '@/app/services/schedule.service';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { withAuth } from '@/app/hoc/withAuth';

const initialValues: IProject = {
  projectName: '',
  duration: 1,
  durationType: 'days',
  hoursPerDay: 0,
  regularWorkingDays: [
    {
      day: 'Monday',
      isChecked: false,
      hours: 0,
    },
    {
      day: 'Tuesday',
      isChecked: false,
      hours: 0,
    },
    {
      day: 'Wednesday',
      isChecked: false,
      hours: 0,
    },
    {
      day: 'Thursday',
      isChecked: false,
      hours: 0,
    },
    {
      day: 'Friday',
      isChecked: false,
      hours: 0,
    },
    {
      day: 'Saturday',
      isChecked: false,
      hours: 0,
    },
    {
      day: 'Sunday',
      isChecked: false,
      hours: 0,
    },
  ],
};

const createProjectSchema = Yup.object({
  projectName: Yup.string().required('Project Name is required!'),
  duration: Yup.number()
    .required('Duration is required')
    .min(1, 'Minimum one day is required'),
});

const Schedule = () => {
  const router = useRouterHook();

  const token = useSelector(selectToken);
  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [worksheetModal, setWorksheetModal] = useState(false);
  const [projectDetail, setProjectDetail] = useState<IProject>();
  const [isFormSubmitLoading, setIsFormSubmitLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [scheduleProjects, setScheduleProjects] = useState<any>([]);

  const fetchScheduleProjects = useCallback(async () => {
    await scheduleService
      .httpGetAllScheduleProjects()
      .then((resp) => {
        setIsTableLoading(false);
        setScheduleProjects(resp.data?.scheduleProjects);
      })
      .catch((error) => {
        console.log(error);
        setIsTableLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchScheduleProjects();
  }, []);

  const items: MenuProps['items'] = [
    {
      key: 'schedule',
      label: <p>Schedule Project</p>,
    },
    {
      key: 'delete',
      label: <p>Delete</p>,
    },
  ];
  const columns: ColumnsType<any> = [
    {
      title: 'Project #',
      dataIndex: '_id',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
    },
    {
      title: 'Managing Company (OSB)',
      dataIndex: 'managingCompany',
    },
    {
      title: 'Owner Representative (OSB)',
      dataIndex: 'ownerRepresentative',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render() {
        return <p>{moment(new Date()).format('DD/MM/YYYY')}</p>;
      },
    },
    {
      title: 'Task',
      dataIndex: 'taskCompleted',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(_value) {
        if (_value === 'active') {
          return (
            <Tag color="green" className="rounded-full capitalize">
              {_value}
            </Tag>
          );
        } else if (_value === 'pending') {
          return (
            <Tag color="red" className="rounded-full capitalize">
              {_value}
            </Tag>
          );
        } else {
          return (
            <Tag color="blue" className="rounded-full capitalize">
              {_value}
            </Tag>
          );
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_value, record) => (
        <Dropdown
          menu={{
            items,
            onClick: (e) => {
              handleMenuItemClick(e.key, record);
            },
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
      ),
    },
  ];

  function handleMenuItemClick(key: string, record: ISchedule) {
    if (key === 'schedule') {
      router.push(`/schedule/${record._id}`);
    }
  }

  async function handleConfirm(item: IProject) {
    setIsFormSubmitLoading(true);

    let finalObject: any = {
      projectName: projectDetail?.projectName,
      duration: Number(projectDetail?.duration),
      durationType: projectDetail?.durationType,
      hoursPerDay: item.hoursPerDay,
      regularWorkingDays: item?.regularWorkingDays?.filter(
        (day) => day.isChecked
      ),
    };

    scheduleService
      .httpGenerateSchedule(finalObject)
      .then((resp) => {
        setIsFormSubmitLoading(false);
        setWorksheetModal(false);
        if (resp.statusCode === 201) {
          router.push(`/schedule/${resp?.data?.createProject?._id}`);
        } else {
          fetchScheduleProjects();
        }
      })
      .catch(() => {
        toast.error('Some thig went wrong');
        setWorksheetModal(false);
      });
  }

  const submitHandler = (values: any) => {
    setProjectDetail(values);
    setCreateProjectModal(false);
    setWorksheetModal(true);
  };

  const { Option } = Select;

  return (
    <section className="mt-6 shadow p-4 mb-[39px] md:ms-[69px] md:me-[59px] mx-4 rounded-xl ">
      <ModalComponent
        open={worksheetModal}
        setOpen={setWorksheetModal}
        title="Set Workweek"
        width="100%"
      >
        <SetWorkWeek
          initialValues={initialValues}
          onClose={() => setWorksheetModal(false)}
          // onCancel={() => setWorksheetModal(false)}
          onConfirm={handleConfirm}
          isFormSubmitLoading={isFormSubmitLoading}
        />
      </ModalComponent>
      <ModalComponent
        open={createProjectModal}
        setOpen={setCreateProjectModal}
        title="Create project"
        width="50%"
      >
        <div className="bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
          <div className="flex px-6 py-2.5 justify-between bg-mistyWhite">
            <TertiaryHeading
              title="Create Project"
              className="text-graphiteGray"
            />
            <CloseOutlined
              className="cursor-pointer"
              style={{ width: '24px', height: '24px' }}
              onClick={() => setCreateProjectModal(false)}
            />
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={createProjectSchema}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, setFieldValue }) => {
              return (
                <Form name="basic" autoComplete="off" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3 p-4">
                    <FormControl
                      control="input"
                      label="Project Name"
                      type="text"
                      name="projectName"
                      placeholder="Project Name"
                    />
                    <div>
                      <label className="text-graphiteGray text-sm font-medium leading-6 capitalize">
                        Duration
                      </label>
                      <Input
                        className="create_project_input_selection"
                        type="number"
                        min={1}
                        addonAfter={
                          <Select
                            onChange={(selectedDurationType) =>
                              setFieldValue(
                                'durationType',
                                selectedDurationType
                              )
                            }
                            defaultValue="Days"
                          >
                            <Option value="days">Days</Option>
                            <Option value="month">Month</Option>
                          </Select>
                        }
                        onChange={(e) =>
                          setFieldValue('duration', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-end py-2 space-x-2">
                        <WhiteButton
                          text="Cancel"
                          className="!w-28"
                          onClick={() => {
                            setCreateProjectModal(false);
                            setFieldValue('projectName', '');
                            setFieldValue('duration', 1);
                          }}
                        />
                        <CustomButton
                          text="Schedule"
                          className="!w-28"
                          type="submit"
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </ModalComponent>

      <div className="flex justify-between flex-wrap items-center md:flex-nowrap mb-2">
        <TertiaryHeading title="Schedule" className="text-graphiteGray" />
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="w-96 ">
            <InputComponent
              label=""
              type="text"
              placeholder="Search"
              name="search"
              prefix={<SearchOutlined />}
              field={{
                type: 'text',
              }}
            />
          </div>
          <CustomButton
            text="Start new Schedule"
            icon="/plus.svg"
            className="!w-auto"
            iconwidth={20}
            iconheight={20}
            onClick={() => setCreateProjectModal(true)}
          />
        </div>
      </div>

      <div className="mt-3">
        <Table
          loading={isTableLoading}
          columns={columns}
          dataSource={scheduleProjects}
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>
    </section>
  );
};

export default withAuth(Schedule);
