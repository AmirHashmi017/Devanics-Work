import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import type { MenuProps } from 'antd';

import { Dropdown, Table, Drawer, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

import NoDataComponent from '@/app/component/noData';

import ChangeStatus from '../components/changeStatus';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import WhiteButton from '@/app/component/customButton/white';

import TertiaryHeading from '@/app/component/headings/tertiary';
import { downloadCrmItemsAsCSV } from '@/app/(pages)/crm/utils';
import { InputComponent } from '@/app/component/customInput/Input';
import { estimateRequestService } from '@/app/services/estimates.service';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import _ from 'lodash';
import { SelectInvoiceType } from '@/app/(pages)/crm/components/SelectInvoiceType';
import { Routes } from '@/app/utils/plans.utils';
import { CurrencyType } from '@/app/utils/types';

interface DataType {
  key: React.Key;
  projectName: string;
  clientName: string;
  salePerson: string;
  estimator: string;
  totalCost: number;
  status: string;
  currency: CurrencyType;
  action: string;
}

const items: MenuProps['items'] = [
  {
    key: 'viewDetail',
    label: 'View Estimate',
  },
  {
    key: 'edit',
    label: 'Edit Estimate',
  },
  {
    key: 'createSchedule',
    label: 'Create Schedule',
  },
  {
    key: 'createInvoice',
    label: 'Create Invoice',
  },
  // {
  //   key: 'email',
  //   label: 'Email',
  // },
  {
    key: 'changeStatus',
    label: 'Change Status',
  },
  {
    key: 'deleteEstimate',
    label: <p>Delete</p>,
  },
];

const EstimateRequestTable: React.FC = () => {
  const router = useRouterHook();
  const currency = useCurrencyFormatter();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [estimateDetail, setEstimateDetail] = useState<any>({});
  const [generatedEstimates, setGeneratedEstimates] = useState<[]>([]);
  const [changeStatusDrawer, setChangeStatusDrawer] = useState(false);

  const [showInvoicePopup, setShowInvoicePopup] = useState(false);

  const fetchGeneratedEstiamtesHandler = useCallback(async () => {
    setLoading(true);
    let result = await estimateRequestService.httpGetAllGeneratedEstimates(
      1,
      9
    );
    let updatedGeneratedEstimate = result?.data?.generatedEstimates.map(
      (estimate: any) => {
        return {
          ...estimate,
          projectName: estimate?.estimateRequestIdDetail?.projectName,
          clientName: estimate?.estimateRequestIdDetail?.clientName,
          clientEmail: estimate?.estimateRequestIdDetail?.email,
          salePerson: estimate?.estimateRequestIdDetail?.salePerson
            ? `${
                estimate?.estimateRequestIdDetail?.salePerson?.firstName ?? ''
              } ${estimate?.estimateRequestIdDetail?.salePerson?.lastName ?? ''}`
            : 'N/A',
          estimator: estimate?.estimateRequestIdDetail?.estimator
            ? `${
                estimate?.estimateRequestIdDetail?.estimator?.firstName ?? ''
              } ${estimate?.estimateRequestIdDetail?.estimator?.lastName ?? ''}`
            : 'N/A',
          estimateRequestIdDetail: estimate.estimateRequestIdDetail?._id,
        };
      }
    );
    setGeneratedEstimates(updatedGeneratedEstimate);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGeneratedEstiamtesHandler();
  }, []);

  const handleDropdownItemClick = async (key: string, estimate: any) => {
    setEstimateDetail(estimate);

    if (key == 'viewDetail') {
      router.push(`/estimates/generate/${estimate._id}`);
    } else if (key == 'deleteEstimate') {
      let deleteEstimateResult =
        await estimateRequestService.httpDeleteGeneratedEstimate(estimate._id);
      if (deleteEstimateResult.statusCode === 200) {
        fetchGeneratedEstiamtesHandler();
      }
    } else if (key == 'createSchedule') {
      // router.push(`/schedule/estimate/${estimate._id}`);
    } else if (key == 'createInvoice') {
      setShowInvoicePopup(true);
    } else if (key == 'changeStatus') {
      setEstimateDetail(estimate);
      setChangeStatusDrawer(true);
    } else if (key == 'edit') {
      router.push(
        `/estimates/generate/edit/?generatedEstimateId=${estimate._id}`
      );
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
      title: 'Sale Person',
      dataIndex: 'salePerson',
      render(value) {
        return value;
      },
    },

    {
      title: 'Estimator',
      dataIndex: 'estimator',
      render(value) {
        return value;
      },
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      render: (text, record) => (
        <span>
          {currency.format(
            record.totalCost,
            record.currency?.locale,
            record.currency?.code
          )}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.status === 'won' || record.status === 'active') {
          return (
            <span className="capitalize text-emeraldGreen bg-schestiLightSuccess px-2 py-1 rounded-full">
              {record.status}
            </span>
          );
        } else if (record.status === 'proposed') {
          return (
            <span className="capitalize text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {record.status}
            </span>
          );
        } else {
          return (
            <span className="capitalize text-red-600 bg-red-100 px-2 py-1 rounded-full">
              {_.startCase(_.camelCase(record.status))}
            </span>
          );
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (text, record) => (
        <Dropdown
          menu={{
            items,
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
      ),
    },
  ];

  const filterEstimateRequest = generatedEstimates.filter((item: any) => {
    if (!search) {
      return true;
    }
    return (
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      item.estimator.toLowerCase().includes(search.toLowerCase()) ||
      item.projectName.toLowerCase().includes(search.toLowerCase()) ||
      item.salePerson?.includes(search)
    );
  });

  return (
    <section className="mt-6 mx-4 p-5 rounded-xl grid items-center border border-solid bg-white border-silverGray shadow-secondaryTwist">
      <SelectInvoiceType
        show={showInvoicePopup}
        setShow={(val) => {
          setShowInvoicePopup(val);
        }}
        onChange={(val) => {
          if (val === 'aia') {
            router.push(`/financial/aia-invoicing`);
          } else if (val === 'standard') {
            router.push(`${Routes.Financial['Standard-Invoicing']}`);
          }
        }}
      />

      {loading ? (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : generatedEstimates && generatedEstimates.length === 0 ? (
        <NoDataComponent
          title="No Data Found"
          description="Please create estimate request first to create an estimate"
          btnText="Create Estimate Request"
          isButton={true}
          link="/estimates/requests/create"
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <TertiaryHeading
              title="Submitted Estimate"
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
              <div>
                <WhiteButton
                  text="Export"
                  className="!w-fit !py-2.5"
                  icon="/download-icon.svg"
                  iconwidth={20}
                  iconheight={20}
                  onClick={() => {
                    downloadCrmItemsAsCSV(
                      generatedEstimates,
                      columns as any,
                      'clients'
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Table
              loading={loading}
              columns={columns}
              dataSource={filterEstimateRequest || []}
              pagination={{ position: ['bottomCenter'] }}
            />
          </div>
        </>
      )}

      <Drawer
        open={changeStatusDrawer}
        onClose={() => setChangeStatusDrawer(false)}
        closable={false}
        title="Edit"
        extra={
          <Image
            src="/closeicon.svg"
            alt="close"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => setChangeStatusDrawer(false)}
          />
        }
        width={400}
      >
        <ChangeStatus
          fetchEstimates={fetchGeneratedEstiamtesHandler}
          setChangeStatusDrawer={setChangeStatusDrawer}
          estimateDetail={estimateDetail}
        />
      </Drawer>
    </section>
  );
};

export default EstimateRequestTable;
