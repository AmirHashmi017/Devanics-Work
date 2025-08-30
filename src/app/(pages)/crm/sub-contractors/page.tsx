'use client';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Dropdown, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';

// module imports
import TertiaryHeading from '@/app/component/headings/tertiary';
import { bg_style } from '@/globals/tailwindvariables';
import Button from '@/app/component/customButton/button';
import { InputComponent } from '@/app/component/customInput/Input';

import ModalComponent from '@/app/component/modal';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import { Routes } from '@/app/utils/plans.utils';
import { withAuth } from '@/app/hoc/withAuth';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import WhiteButton from '@/app/component/customButton/white';
import { PreviewCSVImportFileModal } from '../components/PreviewCSVImportFileModal';
import {
  CrmSubcontractorParsedType,
  CrmType,
  ICrmSubcontractorModule,
} from '@/app/interfaces/crm/crm.interface';
import {
  getCrmItemsThunk,
  updateCrmItemStatusThunk,
} from '@/redux/crm/crm.thunk';
import {
  insertManyCrmItemAction,
  removeCrmItemAction,
} from '@/redux/crm/crm.slice';
import {
  deleteCrmItemById,
  downloadCrmItemsAsCSV,
  saveManyCrmItems,
  uploadAndParseCSVData,
} from '../utils';
import _ from 'lodash';
import { CrmStatusFilter } from '../components/CrmStatusFilter';
import { SelectInvoiceType } from '../components/SelectInvoiceType';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import emailService from '@/app/services/email.service';
import { AxiosError } from 'axios';

export interface DataType {
  company: string;
  companyRep: string;
  email: string;
  phone: string;
  address: string;
  // status: string;
  action: string;
}

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
    /* The above code appears to be a comment block in a TypeScript React file. It includes
  commented-out code that defines an object with a key 'email' and a label that contains an HTML
  paragraph element. The code is currently commented out and not active in the program. */

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

const SubcontractTable = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const state = useSelector((state: RootState) => state.crm);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ICrmSubcontractorModule | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [parseData, setParseData] = useState<CrmSubcontractorParsedType[]>([]);
  const [duplicates, setDuplicates] = useState<CrmSubcontractorParsedType[]>(
    []
  );
  const [isSavingMany, setIsSavingMany] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  useEffect(() => {
    dispatch(getCrmItemsThunk({ module: 'subcontractors' }));
  }, []);

  const handleDropdownItemClick = async (key: string, subcontractor: any) => {
    if (key === 'createEstimateRequest') {
      router.push(`/estimates/requests/create`);
    } else if (key === 'createNewInvoice') {
      setShowInvoicePopup(true);
      setSelectedItem(subcontractor);
    } else if (key === 'createSchedule') {
      // router.push(`/schedule`);
      const token = localStorage.getItem('schestiToken');
      if (token)
        window.location.replace(
          `${process.env.NEXT_PUBLIC_SCHEDULAR_APP_URL}?token=${encodeURIComponent(token)}`
        );
    } else if (key == 'edit') {
      router.push(`${Routes.CRM['Sub-Contractors']}/edit/${subcontractor._id}`);
    } else if (key === 'createContract') {
      router.push(`${Routes.Contracts}/create?receiver=${subcontractor._id}`);
    } else if (key === 'email') {
      setShowEmailModal(true);
      setSelectedItem(subcontractor);
    } else if (key == 'delete') {
      setSelectedItem(subcontractor);
      setShowDeleteModal(true);
    } else if (key === 'active') {
      dispatch(
        updateCrmItemStatusThunk({
          id: subcontractor._id,
          status: true,
        })
      );
    } else if (key === 'inactive') {
      dispatch(
        updateCrmItemStatusThunk({
          id: subcontractor._id,
          status: false,
        })
      );
    }
  };

  const columns: ColumnsType<ICrmSubcontractorModule> = [
    {
      title: 'Company',
      dataIndex: 'name',
    },

    {
      title: 'Company Rep',
      dataIndex: 'companyRep',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: boolean) => {
        if (value) {
          return (
            <Tag className="rounded-full" color="green">
              Active
            </Tag>
          );
        }
        return (
          <Tag className="rounded-full" color="red">
            In Active
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

  function handleCloseModal() {
    setShowDeleteModal(false);
    setSelectedItem(null);
  }

  const filteredSubcontractor = state.data
    .filter((item) => {
      if (!search) {
        return true;
      }
      if (item.module === 'subcontractors') {
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
      <Head>
        <title>Schesti - Subcontractor</title>
      </Head>
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
          setOpen={handleCloseModal}
          width="30%"
        >
          <DeleteContent
            onClick={() =>
              deleteCrmItemById(selectedItem._id, setIsDeleting, (item) => {
                toast.success('Subcontractor deleted successfully');
                dispatch(removeCrmItemAction(item._id));
                setShowDeleteModal(false);
                setSelectedItem(null);
              })
            }
            isLoading={isDeleting}
            onClose={handleCloseModal}
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
            'subcontractors',
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
        title="Import Subcontractors"
      />

      <div className={`${bg_style} p-5 border border-solid border-silverGray`}>
        <div className="flex justify-between items-center mb-4">
          <TertiaryHeading
            title="Subcontractors List"
            className="text-graphiteGray"
          />
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
                    'subcontractors'
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
                id="importClients"
                className="hidden"
                onChange={uploadAndParseCSVData(
                  setIsUploadingFile,
                  'subcontractors',
                  setParseData as React.Dispatch<
                    React.SetStateAction<CrmSubcontractorParsedType[]>
                  >
                )}
              />
            </div>
            <Button
              text="Add New Subcontractor"
              className="!w-fit !py-2"
              icon="/plus.svg"
              iconwidth={20}
              iconheight={20}
              onClick={() =>
                router.push(`${Routes.CRM['Sub-Contractors']}/create`)
              }
            />
          </div>
        </div>
        <Table
          loading={state.loading}
          columns={columns as any}
          dataSource={filteredSubcontractor}
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>
    </section>
  );
};

export default withAuth(SubcontractTable);
