'use client';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { withAuth } from '@/app/hoc/withAuth';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IEstimateProposal } from '@/app/interfaces/estimate-proposal.interface';
import estimateProposalService from '@/app/services/estimate-proposal.service';
import { Routes } from '@/app/utils/plans.utils';
import { Dropdown, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  getEstimateProposalSumOfSubtotal,
  getEstimateProposalTotal,
} from './utils';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { SelectInvoiceType } from '../crm/components/SelectInvoiceType';
import ModalComponent from '@/app/component/modal';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import emailService from '@/app/services/email.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import { ChangeProposalStatus } from './components/ChangeProposalStatus';
import { Excel } from 'antd-table-saveas-excel';

function ProposalPage() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [proposals, setProposals] = useState<IEstimateProposal[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | IEstimateProposal>(
    null
  );
  const router = useRouterHook();
  const currencyFormatter = useCurrencyFormatter();

  useEffect(() => {
    getAllProposals();
  }, []);

  async function getAllProposals() {
    setLoading(true);
    const response = await estimateProposalService.httpGetAllProposals();
    if (response.data) {
      setProposals(response.data);
    }
    setLoading(false);
  }

  const columns: ColumnsType<IEstimateProposal> = [
    {
      title: 'Proposal ID',
      dataIndex: 'proposalId',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
    },
    {
      title: 'Amount',
      render(_value, record) {
        return currencyFormatter.format(
          getEstimateProposalTotal(
            getEstimateProposalSumOfSubtotal(record.items),
            record.materialTax,
            record.profit
          ),
          record.currency?.locale,
          record.currency?.code
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(_value, record) {
        if (record.status != 'lost') {
          return (
            <Tag bordered={false} color="success" className="capitalize">
              {record.status}
            </Tag>
          );
        }
        return (
          <Tag bordered={false} color="error" className="capitalize">
            {record.reason}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      render(_value, record) {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: 'View Proposal',
                  key: 'view',
                  onClick: () =>
                    router.push(`${Routes.Proposal}/${record._id}`),
                },
                {
                  label: 'Edit Proposal',
                  key: 'edit',
                  onClick: () =>
                    router.push(`${Routes.Proposal}/edit?id=${record._id}`),
                },
                {
                  label: 'Create Schedule',
                  key: 'createSchedule',
                  onClick: () => {
                    const token = localStorage.getItem('schestiToken');
                    if (token)
                      window.location.replace(
                        `${process.env.NEXT_PUBLIC_SCHEDULAR_APP_URL}?token=${encodeURIComponent(token)}`
                      );
                  },
                },
                {
                  label: 'Create Invoice',
                  key: 'createInvoice',
                  onClick: () => {
                    setShowInvoicePopup(true);
                    setSelectedItem(record);
                  },
                },
                {
                  label: 'Change Status',
                  key: 'changeStatus',
                  onClick: () => {
                    setShowChangeStatus(true);
                    setSelectedItem(record);
                  },
                },
                {
                  label: 'Email Proposal',
                  key: 'email',
                  onClick: () => {
                    setShowEmailModal(true);
                    setSelectedItem(record);
                  },
                },
                { label: 'Send SMS', key: 'sms' },
                {
                  label: 'Delete',
                  key: 'delete',
                  onClick: () => {
                    setSelectedItem(record);
                    setShowDeleteModal(true);
                  },
                },
              ],
            }}
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
        );
      },
    },
  ];

  function handleExport(data: IEstimateProposal[]) {
    if (!data.length) {
      toast.error('No data found');
      return;
    }
    const excel = new Excel();
    excel
      .addSheet('proposals')
      .addColumns(columns.slice(0, columns.length - 2) as any)
      .addDataSource(data)
      .saveAs(`proposals-${Date.now()}.xlsx`);
  }

  return (
    <div className="p-4 m-4 space-y-3 border bg-white shadow-secondaryShadow rounded-md">
      {/* Change Status */}
      {selectedItem && showChangeStatus ? (
        <ChangeProposalStatus
          open={showChangeStatus && selectedItem !== null}
          onClose={() => {
            setShowChangeStatus(false);
            setSelectedItem(null);
          }}
          data={selectedItem}
          onUpdate={(data) => {
            setProposals(
              proposals.map((item) => (item._id === data._id ? data : item))
            );
          }}
        />
      ) : null}
      {/* Delete Modal */}
      {selectedItem && showDeleteModal ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          width="70%"
        >
          <DeleteContent
            description={`Are you sure you want to delete ${selectedItem.proposalId}?`}
            onClick={async () => {
              setIsDeleting(true);
              try {
                const response =
                  await estimateProposalService.httpDeleteProposal(
                    selectedItem._id
                  );
                if (response.data) {
                  setProposals(
                    proposals.filter((item) => item._id !== selectedItem._id)
                  );
                  toast.success('Proposal deleted successfully');
                }
              } catch (error) {
                const err = error as AxiosError<{ message: string }>;
                toast.error(
                  err.response?.data.message || 'Unable to delete proposal'
                );
              } finally {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setSelectedItem(null);
              }
            }}
            isLoading={isDeleting}
            onClose={() => setShowDeleteModal(false)}
          />
        </ModalComponent>
      ) : null}
      {/* Send Email Modal */}
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
            to={selectedItem.clientEmail}
            isSubmitting={isSubmittingEmail}
            files={
              selectedItem.companySignature.pdf
                ? [selectedItem.companySignature.pdf]
                : []
            }
          />
        </ModalComponent>
      ) : null}

      {/* Choose invoice type */}
      <SelectInvoiceType
        show={showInvoicePopup && selectedItem !== null}
        setShow={(val) => {
          setShowInvoicePopup(val);
          setSelectedItem(null);
        }}
        onChange={(val) => {
          if (val === 'aia') {
            router.push(
              `/financial/aia-invoicing?clientId=${selectedItem?._id}`
            );
          } else if (val === 'standard') {
            router.push(
              `${Routes.Financial['Standard-Invoicing']}/create?id=${selectedItem?._id}`
            );
          }
        }}
      />
      {/* Ui */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <SenaryHeading title="Proposal's List" className="text-xl font-bold" />
        <div className="flex items-center gap-2 flex-wrap lg:flex-1 lg:justify-end">
          <div className="w-48 lg:w-96">
            <InputComponent
              label=""
              name=""
              type="text"
              placeholder="Search"
              prefix={
                <Image
                  src={'/search.svg'}
                  alt="search icon "
                  width={16}
                  height={16}
                />
              }
              field={{
                className: '!py-2',
                onChange: (e) => setSearch(e.target.value),
                value: search ? search : undefined,
              }}
            />
          </div>

          <SelectComponent
            label=""
            name=""
            placeholder="Status"
            field={{
              value: statusFilter ? statusFilter : undefined,
              onChange: (val) => {
                setStatusFilter(val);
              },
              options: [
                { value: 'active', label: 'Active' },
                { value: 'lost', label: 'Lost' },
                { value: 'proposed', label: 'Proposed' },
                { value: 'won', label: 'Won' },
              ],
              allowClear: true,
              onClear() {
                setStatusFilter('');
              },
            }}
          />
          <WhiteButton
            text="Export"
            iconwidth={20}
            iconheight={20}
            icon="/uploadcloud.svg"
            className="!w-fit !py-2"
            onClick={() => handleExport(proposals)}
          />
          <CustomButton
            text="Create Proposal"
            className="!w-fit !py-2"
            type="submit"
            icon="/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={() => {
              router.push(`${Routes.Proposal}/create`);
            }}
          />
        </div>
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={proposals
            .filter((item) => {
              if (search) {
                return (
                  item.clientName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  item.proposalId
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  item.projectName.toLowerCase().includes(search.toLowerCase())
                );
              }
              return item;
            })
            .filter((item) => {
              if (statusFilter) {
                return item.status === statusFilter;
              }
              return item;
            })}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default withAuth(ProposalPage);
