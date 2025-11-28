import { SearchOutlined } from '@ant-design/icons';
import { Dropdown, Pagination, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Country } from 'country-state-city';
import moment from 'moment';
import { useLayoutEffect, useState } from 'react';
import { DeletePopup } from './components/DeletePopup';

import { useNavigate } from 'react-router-dom';
import { AppDispatch } from 'src/redux/store';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from 'src/services/bid-management.service';
import { UsCurrencyFormat } from 'src/utils/common';
import {
  postProjectActions,
  resetPostProjectAction,
  setFormStepAction,
  setPostProjectAction,
} from 'src/redux/post-project/post-project.slice';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { InputComponent } from 'src/components/CustomInput/Input';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { Excel } from 'antd-table-saveas-excel';
import { Link } from 'react-router-dom';

const RES_PER_PAGE = 10;

export default function MyBidManagementProjects() {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const [postedProject, setpostedProject] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1,
    limit: RES_PER_PAGE,
  });
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProject, setSelectedProject] = useState<IBidManagement | null>(
    null
  );

  const [showProjectDeleteModal, setShowProjectDeleteModal] =
    useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

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
              to={`/projects/view/${record._id}`}
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
                <img
                  src={'/assets/icons/lock-icon.svg'}
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
        return value ? moment(value).format('YYYY-MM-DD') : null;
      },
    },
    {
      key: 'country',
      dataIndex: 'country',
      title: 'Location',
      render(_value, record) {
        return `${record.city}, ${Country.getCountryByCode(record.country)
          ?.name}`;
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
          return UsCurrencyFormat.format(record.projectValue);
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
                navigate(`/projects/post`);
              }
              if (key === 'delete') {
                setSelectedProject(record);
                setShowProjectDeleteModal(true);
              }
              if (key === 'view') {
                navigate(`/projects/view/${record._id}`);
              }
            },
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <img
            src={'/assets/icons/menuIcon.svg'}
            alt="logo white icon"
            className="active:scale-105 cursor-pointer text-lg text-center mx-auto"
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
            return `${record.city}, ${Country.getCountryByCode(record.country)
              ?.name}`;
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
              return UsCurrencyFormat.format(record.projectValue);
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
    <section className="mt-6 mb-[39px] mx-4 rounded-xl bg-white shadow-xl px-8 py-9">
      <div className="flex justify-between items-center">
        <TertiaryHeading
          title="My posted project"
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
              icon="/assets/icons/uploadcloud.svg"
              iconheight={20}
              className="!w-32"
              iconwidth={20}
              onClick={() => handleDownloadProjectsCSV(projects)}
            />
            <CustomButton
              icon="/assets/icons/plus.svg"
              className="!w-48"
              iconheight={20}
              iconwidth={20}
              text="Post New Project"
              onClick={() => {
                dispatch(resetPostProjectAction());
                navigate(`/projects/post`);
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
          bordered
          pagination={false}
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
