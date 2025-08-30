'use client';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { withAuth } from '@/app/hoc/withAuth';
import { SearchOutlined } from '@ant-design/icons';
import { Pagination, Dropdown, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Routes } from '@/app/utils/plans.utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  postProjectActions,
  resetPostProjectAction,
  setFormStepAction,
  setPostProjectAction,
} from '@/redux/post-project/post-project.slice';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { useQuery } from 'react-query';
import { bidManagementService } from '@/app/services/bid-management.service';
import { Country } from 'country-state-city';
import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';
import { DeletePopup } from '../post/components/DeletePopup';
import { Excel } from 'antd-table-saveas-excel';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IUserInterface } from '@/app/interfaces/user.interface';
import Link from 'next/link';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const RES_PER_PAGE = 10;

function Page() {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProject, setSelectedProject] = useState<IBidManagement | null>(
    null
  );
  const currency = useCurrencyFormatter();
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: IUserInterface }
  );

  const [showProjectDeleteModal, setShowProjectDeleteModal] =
    useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const [postedProject, setpostedProject] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1,
    limit: RES_PER_PAGE,
  });

  const fetchProjectDetails = async () => {
    return bidManagementService.httpGetMyProjects(postedProject);
  };
  const projectsQuery = useQuery(
    ['projects', postedProject.page, postedProject.limit],
    fetchProjectDetails
  );

  const columns: ColumnsType<IBidManagement> = [
    {
      key: 'projectName',
      dataIndex: 'projectName',
      title: 'Project',
      width: 300,
      render(value, record) {
        const isNewProject = moment(record.createdAt).isSame(moment(), 'day');
        return (
          <div className="flex items-center justify-between">
            <Link
              href={`${Routes['Bid Management'].Posted_Projects}/view/${record._id}`}
              className="text-[#181D25] hover:text-schestiPrimary hover:underline hover:underline-offset-2 text-base font-semibold leading-6"
            >
              {record.projectName}
            </Link>
            <div className=" flex space-x-3 items-center">
              {isNewProject ? (
                <div className="w-fit h-[22px] py-0.5 px-2 rounded-full bg-[#36B37E] text-center font-medium text-sm leading-4 text-white">
                  New
                </div>
              ) : null}

              {record.platformType && record.platformType === 'Private' ? (
                <Image
                  src={'/lock-icon.svg'}
                  alt="lock icon"
                  width={15}
                  height={15}
                  loading="lazy"
                />
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      key: 'estimatedStartDate',
      dataIndex: 'estimatedStartDate',
      title: 'Estimated Start Date',
      render(value) {
        // write the format pattern
        return value ? moment(value).format('MM-DD-YYYY') : null;
      },
    },
    {
      key: 'country',
      dataIndex: 'country',
      title: 'Location',
      render(_value, record) {
        return `${record.city}, ${Country.getCountryByCode(record.country)?.name}`;
      },
    },
    {
      key: 'stage',
      dataIndex: 'stage',
      title: 'Stage',
      render(value) {
        if (!value) {
          return null;
        }
        return (
          <div className="w-fit py-[7px] px-3 rounded-md bg-schestiLightPrimary text-schestiPrimary font-normal text-base leading-4">
            {value}
          </div>
        );
      },
    },
    {
      key: 'projectValue',
      dataIndex: 'projectValue',
      title: 'Budget',
      render(value, record) {
        if (record.projectValue) {
          return currency.format(
            record.projectValue,
            record.currency?.locale,
            record.currency?.code
          );
        }
        return null;
      },
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render(value) {
        if (value === 'active') {
          return (
            <Tag className="rounded-full" color="green">
              Active
            </Tag>
          );
        }
        if (value === 'draft') {
          return (
            <Tag
              className="rounded-full"
              color="#F0F9FF"
              style={{ color: '#007AB6' }}
            >
              Draft
            </Tag>
          );
        }
        return (
          <Tag
            className="rounded-full"
            color="#F2F4F7"
            style={{ color: '#344054' }}
          >
            Archived
          </Tag>
        );
      },
      filters: [
        {
          text: 'Active',
          value: 'active',
        },
        {
          text: 'Draft',
          value: 'draft',
        },
        {
          text: 'Expired',
          value: 'expired',
        },
        {
          text: 'Archived',
          value: 'archived',
        },
      ],
      // @ts-ignore
      onFilter: (value: string, record) => record.status.startsWith(value),
      filterSearch: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_value, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: <p>Edit</p>,
                disabled:
                  typeof record.user === 'string'
                    ? authUser?.user?._id !== record.user
                    : authUser.user?._id !== record.user._id,
              },
              {
                key: 'view',
                label: <p>View</p>,
              },
            ],
            onClick: ({ key }) => {
              if (key === 'edit') {
                dispatch(setPostProjectAction(record));
                dispatch(setFormStepAction(0));
                dispatch(postProjectActions.setTeamMemers(record.teamMembers));
                console.log('Edit Team Members', record.teamMembers);
                router.push(`${Routes['Bid Management'].Post_A_Project}`);
              }
              if (key === 'delete') {
                setSelectedProject(record);
                setShowProjectDeleteModal(true);
              }
              if (key === 'view') {
                router.push(
                  `${Routes['Bid Management'].Posted_Projects}/view/${record._id}`
                );
              }
            },
          }}
          placement="bottomRight"
          trigger={['click']}
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

  const projects =
    projectsQuery.data && projectsQuery.data.data
      ? projectsQuery.data.data?.records
      : [];

  const paginationInfo =
    projectsQuery.data && projectsQuery.data.data
      ? projectsQuery.data.data.paginationInfo
      : { currentPage: 0, pages: 0, totalRecords: 0, perPage: 0 };

  const filteredData =
    projects?.filter((project: { projectName: string; city: string }) => {
      if (search === '') {
        return project;
      }
      return (
        project.projectName.toLowerCase().includes(search.toLowerCase()) ||
        project.city.toLowerCase().includes(search.toLowerCase())
      );
    }) ?? [];

  const handleDownloadProjectsCSV = (data: IBidManagement[]) => {
    const excel = new Excel();
    console.log(data);
    excel
      .addSheet(`Projects`)
      .addColumns([
        {
          dataIndex: 'projectName',
          title: 'Project Name',
        },
        {
          dataIndex: 'estimatedStartDate',
          title: 'Estimated Start Date',
          render(value) {
            return value ? moment(value).format('YYYY-MM-DD') : null;
          },
        },
        {
          title: 'Location',
          dataIndex: 'country',
          render(_value, record) {
            return `${record.city}, ${Country.getCountryByCode(record.country)?.name}`;
          },
        },
        {
          dataIndex: 'stage',
          title: 'Stage',
        },
        {
          dataIndex: 'projectValue',
          title: 'Budget',
          render(value, record) {
            if (record.projectValue) {
              return currency.format(record.projectValue);
            }
            return null;
          },
        },
        {
          dataIndex: 'status',
          title: 'Status',
          render(value: string) {
            return value.toUpperCase();
          },
        },
      ])
      .addDataSource(data)
      .saveAs(`projects-${Date.now()}.xlsx`);
  };

  return (
    <section className="mt-6 mb-[39px]  mx-4 rounded-xl bg-white shadow-xl px-8 py-9">
      <div className="flex justify-between items-center">
        <TertiaryHeading
          title="My Posted Project"
          className="text-xl leading-7"
        />
        {selectedProject ? (
          <DeletePopup
            closeModal={() => setShowProjectDeleteModal(false)}
            message="Are you sure you want to delete this project?"
            onConfirm={() => {}}
            open={showProjectDeleteModal}
            title="Delete Project"
            isLoading={false}
          />
        ) : null}
        <div className="flex-1 flex items-center space-x-4 justify-end ">
          <div className="!w-96">
            <InputComponent
              label=""
              type="text"
              placeholder="Search"
              name="search"
              prefix={<SearchOutlined className="text-lg" />}
              field={{
                type: 'text',
                className: '!py-3',
                value: search,
                onChange: (e) => setSearch(e.target.value),
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <WhiteButton
              text={'Export'}
              icon="/uploadcloud.svg"
              iconheight={20}
              className="!w-32"
              iconwidth={20}
              onClick={() => handleDownloadProjectsCSV(projects)}
            />
            <CustomButton
              icon="/plus.svg"
              className="!w-48"
              iconheight={20}
              iconwidth={20}
              text="Post New Project"
              onClick={() => {
                dispatch(resetPostProjectAction());
                router.push(`${Routes['Bid Management'].Post_A_Project}`);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={projectsQuery.isLoading}
          pagination={false}
          bordered
        />
      </div>
      <div className="mt-1 flex justify-center">
        <Pagination
          current={postedProject.page}
          pageSize={postedProject.limit}
          total={
            typeof paginationInfo === 'object'
              ? paginationInfo.totalRecords || 0
              : 0
          }
          onChange={(page) => {
            setpostedProject((prevFilters) => ({ ...prevFilters, page: page }));
          }}
        />
      </div>
    </section>
  );
}

export default withAuth(Page);
