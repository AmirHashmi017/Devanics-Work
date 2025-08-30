'use client';
import CustomButton from '@/app/component/customButton/button';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import ModalComponent from '@/app/component/modal';
import { withAuth } from '@/app/hoc/withAuth';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { ICrmContract } from '@/app/interfaces/crm/crm-contract.interface';
import { FileInterface } from '@/app/interfaces/file.interface';
import crmContractService from '@/app/services/crm/crm-contract.service';
import emailService from '@/app/services/email.service';
import { downloadFile } from '@/app/utils/downloadFile';
import { Routes } from '@/app/utils/plans.utils';
import { SearchOutlined } from '@ant-design/icons';
import { Dropdown, Tag, type MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Table from 'antd/es/table';
import { AxiosError } from 'axios';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const menuItems: MenuProps['items'] = [
  {
    key: 'edit',
    label: <p>Edit</p>,
  },
  // {
  //   key: 'editTools',
  //   label: <p>Edit Tools</p>,
  // },
  {
    key: 'viewContract',
    label: <p>View Contract</p>,
  },
  {
    key: 'email',
    label: <p>Send Email</p>,
  },
  {
    key: 'downloadOrignal',
    label: <p>Download Orignal Contract</p>,
  },
  {
    key: 'download',
    label: <p>Download Signed Contract</p>,
  },
  {
    key: 'delete',
    label: <p>Delete</p>,
  },
];
function ContractsPage() {
  const [data, setData] = useState<ICrmContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICrmContract | null>(null);
  const router = useRouterHook();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const [selectedContract, setSelectedContract] = useState<ICrmContract | null>(
    null
  );

  useEffect(() => {
    getCompanyContracts();
  }, []);

  async function getCompanyContracts() {
    setIsLoading(true);
    try {
      const response = await crmContractService.httpGetCompanyContracts();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err.response?.data);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteContract(contract: ICrmContract) {
    setIsDeleting(true);
    try {
      const response = await crmContractService.httpDeleteContractById(
        contract._id
      );
      if (response.data) {
        setData(data.filter((item) => item._id !== contract._id));
        toast.success('Contract deleted successfully');
        setShowDeleteModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err.response?.data);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: ColumnsType<ICrmContract> = [
    {
      title: 'Contract Title',
      dataIndex: 'title',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (date) => {
        return moment(date).format('YYYY-MM-DD');
      },
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      render: (date) => {
        return moment(date).format('YYYY-MM-DD');
      },
    },
    {
      title: 'Contract File',
      dataIndex: 'file',
      render: (file: FileInterface, record) => {
        return (
          <div className="flex space-x-5 items-center">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-md bg-schestiLightPrimary">
                <Image
                  alt="file"
                  src={'/file-cyan.svg'}
                  width={20}
                  height={20}
                />
              </div>

              <SenaryHeading
                title={file.name}
                className="text-[14px] text-schestiPrimaryBlack"
              />
            </div>

            <div className="p-1">
              <Image
                alt="download"
                src={'/download-icon.svg'}
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  if (!record.signedFileUrl) {
                    downloadFile(file.url, file.name);
                  } else {
                    downloadFile(record.signedFileUrl, file.name);
                  }
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(value, record) {
        if (record.status === 'draft') {
          return (
            <Tag className="rounded-full" color="#026AA2">
              Draft
            </Tag>
          );
        } else if (record.status === 'pending') {
          return (
            <Tag className="rounded-full" color="#175CD3">
              Pending
            </Tag>
          );
        } else if (record.status === 'archive') {
          return (
            <Tag className="rounded-full" color="#344054">
              Archived
            </Tag>
          );
        } else {
          return (
            <Tag className="rounded-full" color="#027A48">
              Signed
            </Tag>
          );
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render(_value, record) {
        return (
          <Dropdown
            menu={{
              items:
                record.status === 'pending'
                  ? menuItems?.filter((item) => item?.key !== 'download')
                  : menuItems,
              onClick({ key }) {
                if (key === 'viewContract') {
                  router.push(`${Routes.Contracts}/view?id=${record._id}`);
                } else if (key === 'download') {
                  router.push(
                    `${Routes.Contracts}/view?id=${record._id}&download=true`
                  );
                } else if (key === 'delete') {
                  setShowDeleteModal(true);
                  setSelectedItem(record);
                } else if (key === 'edit') {
                  router.push(
                    `${Routes.Contracts}/create/?id=${record._id}&edit=true`
                  );
                } else if (key === 'editTools') {
                  router.push(
                    `${Routes.Contracts}/edit-contract?contractId=${record._id}`
                  );
                } else if (key === 'email') {
                  setSelectedContract(record);
                  setShowEmailModal(true);
                } else if (key === 'downloadOrignal') {
                  downloadFile(record.file.url, record.file.name);
                }
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
      },
    },
  ];

  const filteredData = data
    .filter((item) => {
      if (!search) return true;
      return item.title.toLowerCase().includes(search.toLowerCase());
    })
    .filter((item) => {
      if (!status) return true;
      return item.status === status;
    });

  return (
    <div className="mt-6 p-5 !pb-[39px]  mx-4 bg-white rounded-md">
      <ModalComponent open={showEmailModal} setOpen={setShowEmailModal}>
        <CustomEmailTemplate
          isFileUploadShow={true}
          setEmailModal={setShowEmailModal}
          files={
            selectedContract && selectedContract.status === 'signed'
              ? [
                  {
                    extension: '.pdf',
                    name: selectedContract.file.name,
                    url: selectedContract.signedFileUrl!,
                    type: 'application/pdf',
                  },
                ]
              : undefined
          }
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
          to=""
          isSubmitting={isSubmittingEmail}
          shouldUpdateTo
        />
      </ModalComponent>
      {selectedItem && showDeleteModal ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          width="30%"
        >
          <DeleteContent
            onClick={() => deleteContract(selectedItem)}
            title="Are you sure to delete?"
            description="Are you sure you want to delete this entry?"
            isLoading={isDeleting}
            onClose={() => setShowDeleteModal(false)}
          />
        </ModalComponent>
      ) : null}
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Contracts"
          className="text-xl text-schestiPrimaryBlack font-semibold leading-7"
        />
        <div className="flex items-center space-x-3">
          <div className="w-96">
            <InputComponent
              label=""
              name=""
              type="text"
              placeholder="Search"
              prefix={<SearchOutlined />}
              field={{
                value: search ? search : undefined,
                onChange: (e) => {
                  setSearch(e.target.value);
                },
                allowClear: true,
              }}
            />
          </div>
          <SelectComponent
            label=""
            name="status"
            placeholder="Status"
            field={{
              value: status ? status : undefined,
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Signed', value: 'signed' },
              ],
              className: '!w-auto',
              allowClear: true,
              onChange: (value) => {
                setStatus(value);
              },
              onClear() {
                setStatus('');
              },
            }}
          />

          <CustomButton
            text="Create New Contract"
            className="!w-fit !py-2.5"
            icon="/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={() => router.push(`${Routes.Contracts}/create`)}
          />
        </div>
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default withAuth(ContractsPage);
