'use client';
import { useEffect, useState, useRef } from 'react';
import { Dropdown, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// module imports
import { AppDispatch, RootState } from '@/redux/store';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { bg_style } from '@/globals/tailwindvariables';
import Button from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import Image from 'next/image';
import { SearchOutlined } from '@ant-design/icons';
import { InputComponent } from '@/app/component/customInput/Input';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import ModalComponent from '@/app/component/modal';
import { toast } from 'react-toastify';
import { withAuth } from '@/app/hoc/withAuth';
import { Routes } from '@/app/utils/plans.utils';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { PreviewCSVImportFileModal } from '../components/PreviewCSVImportFileModal';

import {
  CrmPartnerParsedType,
  CrmType,
  ICrmItem,
  ICrmPartnerModule,
} from '@/app/interfaces/crm/crm.interface';
import {
  getCrmItemsThunk,
  updateCrmItemStatusThunk,
} from '@/redux/crm/crm.thunk';
import {
  deleteCrmItemById,
  downloadCrmItemsAsCSV,
  saveManyCrmItems,
  uploadAndParseCSVData,
} from '../utils';
import {
  insertManyCrmItemAction,
  removeCrmItemAction,
} from '@/redux/crm/crm.slice';
import _ from 'lodash';

import { CrmStatusFilter } from '../components/CrmStatusFilter';
import { SelectInvoiceType } from '../components/SelectInvoiceType';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import emailService from '@/app/services/email.service';
import { AxiosError } from 'axios';

const activeMenuItems: MenuProps['items'] = [
  {
    key: 'createEstimateRequest',
    label: <p>Create Estimate Request</p>,
  },
  {
    key: 'createNewInvoice',
    label: <p>Create Invoice</p>,
  },
  {
    key: 'createSchedule',
    label: <p>Create Schedule</p>,
  },
  {
    key: 'edit',
    label: <p>Edit Details</p>,
  },
  {
    key: 'createContract',
    label: <p>Create Contract</p>,
  },
  // {
  //   key: 'createNewTakeoff',
  //   label: <p>Create New Takeoff</p>,
  // },
  {
    key: 'email',
    label: <p>Send Email</p>,
  },
  {
    key: 'delete',
    label: <p>Delete</p>,
  },
  {
    key: 'inactive',
    label: <p>In Active</p>,
  },
];

const inactiveMenuItems: MenuProps['items'] = [
  {
    key: 'active',
    label: <p>Active</p>,
  },
];

const PartnerTable = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const state = useSelector((state: RootState) => state.crm);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICrmItem | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [parseData, setParseData] = useState<CrmPartnerParsedType[]>([]);
  const [duplicates, setDuplicates] = useState<CrmPartnerParsedType[]>([]);
  const [isSavingMany, setIsSavingMany] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  useEffect(() => {
    dispatch(getCrmItemsThunk({ module: 'partners' }));
  }, []);

  const handleDropdownItemClick = async (key: string, partner: any) => {
    if (key === 'createEstimateRequest') {
      router.push(`/estimates/requests/create`);
    } else if (key === 'email') {
      setShowEmailModal(true);
      setSelectedItem(partner);
    } else if (key === 'createNewInvoice') {
      setShowInvoicePopup(true);
      setSelectedItem(partner);
    } else if (key === 'createSchedule') {
      // router.push(`/schedule`);
      const token = localStorage.getItem('schestiToken');
      if (token)
        window.location.replace(
          `${process.env.NEXT_PUBLIC_SCHEDULAR_APP_URL}?token=${encodeURIComponent(token)}`
        );
    } else if (key === 'createContract') {
      router.push(`${Routes.Contracts}/create?receiver=${partner._id}`);
    } else if (key == 'delete') {
      setSelectedItem(partner);
      setShowDeleteModal(true);
    } else if (key == 'edit') {
      router.push(`${Routes.CRM.Partners}/edit/${partner._id}`);
    } else if (key == 'inactive') {
      dispatch(
        updateCrmItemStatusThunk({
          id: partner._id,
          status: false,
        })
      );
    } else if (key == 'active') {
      dispatch(
        updateCrmItemStatusThunk({
          id: partner._id,
          status: true,
        })
      );
    }
  };

  const columns: ColumnsType<ICrmPartnerModule> = [
    {
      title: 'Company',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Company Rep',
      dataIndex: 'companyRep',
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => {
        if (!value) {
          return (
            <Tag className="rounded-full" color="red">
              In Active
            </Tag>
          );
        }
        return (
          <Tag className="rounded-full" color="green">
            Active
          </Tag>
        );
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
            items: record.status ? activeMenuItems : inactiveMenuItems,
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
  const filteredData = state.data
    .filter((item) => {
      if (!search) {
        return true;
      }
      if (item.module === 'partners') {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.companyRep?.includes(search) ||
          item.email?.includes(search) ||
          item.phone?.includes(search) ||
          item.address?.includes(search)
        );
      }
      return true;
    })
    .filter((item) => {
      if (!status) {
        return true;
      }
      return status === 'active' ? item.status === true : item.status === false;
    });

  return (
    <section className="mt-6 mb-[39px] mx-4 rounded-xl ">
      <SelectInvoiceType
        show={showInvoicePopup && selectedItem !== null}
        setShow={(val) => {
          setShowInvoicePopup(val);
          setSelectedItem(null);
        }}
        onChange={(val) => {
          if (val === 'aia') {
            router.push(`/financial/aia-invoicing`);
          } else if (val === 'standard') {
            router.push(
              `${Routes.Financial['Standard-Invoicing']}/create?id=${selectedItem?._id}`
            );
          }
        }}
      />

      {selectedItem && showEmailModal ? (
        <ModalComponent open={showEmailModal} setOpen={setShowEmailModal}>
          <CustomEmailTemplate
            isFileUploadShow={true}
            setEmailModal={setShowEmailModal}
            submitHandler={async (formData) => {
              setIsSubmittingEmail(true);
              try {
                const response = await emailService.httpSendEmail(formData);
                if (response.statusCode === 200) {
                  toast.success('Email sent successfully');
                  setShowEmailModal(false);
                }
              } catch (error) {
                const err = error as AxiosError<{ message: string }>;
                toast.error(err.response?.data.message);
              } finally {
                setIsSubmittingEmail(false);
              }
            }}
            to={selectedItem.email}
            isSubmitting={isSubmittingEmail}
          />
        </ModalComponent>
      ) : null}

      {selectedItem && showDeleteModal ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          width="30%"
        >
          <DeleteContent
            onClick={() =>
              deleteCrmItemById(selectedItem._id, setIsDeleting, (item) => {
                toast.success('Partner deleted successfully');
                dispatch(removeCrmItemAction(item._id));
                setShowDeleteModal(false);
                setSelectedItem(null);
              })
            }
            isLoading={isDeleting}
            onClose={() => setShowDeleteModal(false)}
          />
        </ModalComponent>
      ) : null}

      <PreviewCSVImportFileModal
        columns={columns as any}
        data={parseData}
        onClose={() => setParseData([])}
        onConfirm={() => {
          saveManyCrmItems(
            parseData,
            setIsSavingMany,
            'partners',
            setDuplicates,
            (items) => {
              dispatch(insertManyCrmItemAction(items));
              const remainingParsedData = _.differenceBy(
                parseData,
                items,
                'email'
              );
              setParseData(remainingParsedData);
              if (inputFileRef.current) {
                inputFileRef.current.value = '';
              }
            }
          );
        }}
        duplicates={duplicates}
        setData={setParseData}
        isLoading={isSavingMany}
        title="Import Partners"
      />

      <div className={`${bg_style} p-5 border border-solid border-silverGray`}>
        <div className="flex justify-between items-center mb-4">
          <TertiaryHeading title="Partner List" className="text-graphiteGray" />
          <div className=" flex items-center space-x-3">
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
            <CrmStatusFilter status={status} setStatus={setStatus} />
            <div>
              <WhiteButton
                text="Export"
                className="!w-fit !py-2.5"
                icon="/download-icon.svg"
                iconwidth={20}
                iconheight={20}
                onClick={() => {
                  downloadCrmItemsAsCSV(
                    state.data,
                    columns as ColumnsType<CrmType>,
                    'partners'
                  );
                }}
              />
            </div>
            <div>
              <WhiteButton
                text="Import"
                className="!w-fit !py-2.5"
                icon="/uploadcloud.svg"
                iconwidth={20}
                iconheight={20}
                onClick={() => {
                  if (inputFileRef.current) {
                    inputFileRef.current.click();
                  }
                }}
                isLoading={isUploadingFile}
                loadingText="Uploading..."
              />
              <input
                ref={inputFileRef}
                accept=".csv, .xlsx"
                type="file"
                name=""
                id="importFile"
                className="hidden"
                onChange={uploadAndParseCSVData(
                  setIsUploadingFile,
                  'partners',
                  setParseData
                )}
              />
            </div>
            <Button
              text="Add New Partner"
              className="!w-fit !py-2.5"
              icon="/plus.svg"
              iconwidth={20}
              iconheight={20}
              onClick={() => router.push(`${Routes.CRM.Partners}/create`)}
            />
          </div>
        </div>
        <Table
          loading={state.loading}
          columns={columns as ColumnsType<CrmType>}
          dataSource={filteredData}
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>
    </section>
  );
};

export default withAuth(PartnerTable);
