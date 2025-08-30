import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import type { MenuProps } from 'antd';
import { Dropdown, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

// module imports
import { AppDispatch } from '@/redux/store';
import {
  selectEstimateRequests,
  selectEstimateRequestsLoading,
} from '@/redux/estimate/estimateRequestSelector';
import {
  deleteEstimateRequest,
  fetchEstimateRequests,
  changeEstimateStatus,
} from '@/redux/company/company.thunk';
import ModalComponent from '@/app/component/modal';
import NoDataComponent from '@/app/component/noData';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import WhiteButton from '@/app/component/customButton/white';
import CustomButton from '@/app/component/customButton/button';
import { downloadCrmItemsAsCSV } from '@/app/(pages)/crm/utils';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { InputComponent } from '@/app/component/customInput/Input';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import { IEstimateRequest } from '@/app/interfaces/estimateRequests/estimateRequests.interface';

interface DataType {
  key: React.Key;
  projectName: string;
  clientName: string;
  phone: string;
  salePerson: string;
  estimator: string;
  status: string;
  action: string;
}

const EstimateRequestTable: React.FC = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const estimateRequestsData = useSelector(selectEstimateRequests);
  const estimateRequestsLoading = useSelector(selectEstimateRequestsLoading);

  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEstimate, setSelecteEstimate] = useState<
    (IEstimateRequest & { _id: string }) | null
  >(null);

  const fetachEstimateRequest = useCallback(async () => {
    await dispatch(fetchEstimateRequests({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    fetachEstimateRequest();
  }, []);

  const activeEstimateMenu: MenuProps['items'] = [
    {
      key: 'createEstimateRequest',
      label: <a href="#">Create Estimate</a>,
    },
    {
      key: 'editEstimateRequest',
      label: <a href="#">Edit Request</a>,
    },
    {
      key: 'inactiveState',
      label: <a href="#">In Active</a>,
    },
    {
      key: 'deleteEstimateRequest',
      label: <p>Delete</p>,
    },
  ];

  const inActiveEstimateMenu: MenuProps['items'] = [
    {
      key: 'editEstimateRequest',
      label: <a href="#">Edit Request</a>,
    },
    {
      key: 'activeState',
      label: <a href="#">Active</a>,
    },
    {
      key: 'deleteEstimateRequest',
      label: <p>Delete</p>,
    },
  ];

  const handleDropdownItemClick = async (key: string, estimateRequest: any) => {
    if (key == 'deleteEstimateRequest') {
      setShowDeleteModal(true);
      setSelecteEstimate(estimateRequest);
    } else if (key == 'editEstimateRequest') {
      router.push(`/estimates/requests/edit/${estimateRequest._id}`);
    } else if (key === 'createEstimateRequest') {
      router.push(
        `/estimates/generate/create?estimateId=${estimateRequest._id}`
      );
    } else if (key === 'inactiveState') {
      let statusBody = {
        status: false,
        estimateId: estimateRequest._id,
      };
      dispatch(changeEstimateStatus(statusBody));
      fetachEstimateRequest();
    } else if (key === 'activeState') {
      let statusBody = {
        status: true,
        estimateId: estimateRequest._id,
      };
      dispatch(changeEstimateStatus(statusBody));
      fetachEstimateRequest();
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      ellipsis: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },

    {
      title: 'Sale Person ',
      dataIndex: 'salePerson',
      render: (text, record: any) => {
        if (!record.salePerson) {
          return 'N/A';
        }
        return `${record?.salePerson?.firstName} ${record?.salePerson?.lastName}`;
      },
    },
    {
      title: 'Estimator',
      dataIndex: 'estimator',
      render: (text, record: any) => {
        if (!record.estimator) {
          return 'N/A';
        }
        return `${record?.estimator?.firstName} ${record?.estimator?.lastName}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record: any) => (
        <a className="text-[#027A48] bg-[#ECFDF3] px-2 py-1 rounded-full capitalize">
          {record.status ? 'Active' : 'In Active'}
        </a>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (text, record: any) => {
        if (record?.status) {
          return (
            <Dropdown
              menu={{
                items: activeEstimateMenu,
                onClick: (event) => {
                  const { key } = event;
                  handleDropdownItemClick(key, record);
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
          );
        } else {
          return (
            <Dropdown
              menu={{
                items: inActiveEstimateMenu,
                onClick: (event) => {
                  const { key } = event;
                  handleDropdownItemClick(key, record);
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
          );
        }
      },
    },
  ];

  const filterEstimateRequest = estimateRequestsData.filter((item: any) => {
    if (!search) {
      return true;
    }
    return (
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search) ||
      item.projectName?.includes(search)
    );
  });

  return (
    <section className="mt-6 mx-4 p-5 !bg-white rounded-xl grid items-center border border-solid border-silverGray shadow-secondaryTwist">
      {selectedEstimate ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={() => {
            setSelecteEstimate(null);
            setShowDeleteModal(false);
          }}
          destroyOnClose
        >
          <DeleteContent
            onClick={() => {
              dispatch(deleteEstimateRequest(selectedEstimate._id));
              setSelecteEstimate(null);
              setShowDeleteModal(false);
            }}
            onClose={() => setSelecteEstimate(null)}
          />
        </ModalComponent>
      ) : null}
      <div className="flex justify-between items-center">
        <TertiaryHeading
          title="My Estimate Request"
          className="text-graphiteGray"
        />
        <div className=" flex items-end space-x-3">
          <div className="w-96">
            <InputComponent
              label=""
              type="text"
              placeholder="Search"
              name="search"
              prefix={<SearchOutlined />}
              field={{
                type: 'text',
                value: search,
                onChange: (e: any) => {
                  setSearch(e.target.value);
                },
                className: '!py-2',
              }}
            />
          </div>
          {/* <CrmStatusFilter status={status} setStatus={setStatus} /> */}
          <div>
            <WhiteButton
              text="Export"
              className="!w-fit !py-2.5"
              icon="/download-icon.svg"
              iconwidth={20}
              iconheight={20}
              onClick={() => {
                downloadCrmItemsAsCSV(
                  estimateRequestsData,
                  columns as any,
                  'clients'
                );
              }}
            />
          </div>

          <CustomButton
            text="Start New Estimate "
            className="!w-fit !py-2.5"
            icon="/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={() => router.push('/estimates/requests/create')}
          />
        </div>
      </div>
      <div className="">
        {estimateRequestsData.length === 0 ? (
          <NoDataComponent
            title="No Data Found"
            description="Please create estimate request first to create an estimate"
            btnText="Create Estimate Request"
            isButton={true}
            link="/estimates/requests/create"
          />
        ) : (
          <div className="mt-4">
            <Table
              loading={estimateRequestsLoading}
              columns={columns}
              dataSource={filterEstimateRequest}
              pagination={{ position: ['bottomCenter'] }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EstimateRequestTable;
