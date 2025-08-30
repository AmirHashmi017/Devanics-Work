import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import { AddCrmClientForm } from '@/app/(pages)/crm/clients/components/AddCrmClientForm';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import ModalComponent from '@/app/component/modal';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { Routes } from '@/app/utils/plans.utils';
import {
  deleteClientInvoiceRequest,
  fetchClientInvoices,
} from '@/redux/client-invoices/client-invoice.thunk';
import { AppDispatch, RootState } from '@/redux/store';
import {
  CloseOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, type MenuProps, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { AIAInvoicePhasesTable } from '../../aia-invoicing/form/components/PhasesTable';
import { ICrmItem } from '@/app/interfaces/crm/crm.interface';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { getCrmItemsThunk } from '@/redux/crm/crm.thunk';
import { AddCrmArchitectForm } from '@/app/(pages)/crm/architects/components/AddCrmArchitectForm';
import { CurrencyFormat } from '@/app/utils/format';
import _ from 'lodash';

const ValidationSchema = Yup.object({
  invoiceName: Yup.string().required('Invoice name is required'),
  client: Yup.string().required('Client is required'),
  architect: Yup.string().required('Architect is required'),
});

export function Clients() {
  const router = useRouterHook();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showArchitectModal, setShowArchitectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<readonly React.Key[]>([]);
  const clientInvoices = useSelector(
    (state: RootState) => state.clientInvoices.data
  );
  const crmState = useSelector((state: RootState) => state.crm);
  const clientInvoicesLoading = useSelector(
    (state: RootState) => state.clientInvoices.loading
  );
  const [search, setSearch] = useState('');
  const formik = useFormik<{
    invoiceName: string;
    client: string | ICrmItem;
    architect: string | ICrmItem;
  }>({
    initialValues: {
      invoiceName: '',
      client: '',
      architect: '',
    },
    validationSchema: ValidationSchema,
    async onSubmit(values) {
      setIsLoading(true);
      try {
        const response = await clientInvoiceService.httpCreateInitialInvoice({
          ...values,
          invoiceName: values.invoiceName,
          architect: values.architect as string,
          client: values.client as string,
        });
        if (response.data && response.data.invoice) {
          router.push(
            `${Routes.Financial['AIA-Invoicing']}/form?id=${response.data.invoice._id}&mode=edit`
          );
        }
        setIsLoading(false);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message);
        setIsLoading(false);
      }
    },
  });

  const fetchSubcontactorsInvoices = useCallback(async () => {
    await dispatch(fetchClientInvoices({}));
  }, [dispatch]);

  useEffect(() => {
    fetchSubcontactorsInvoices();
  }, [fetchSubcontactorsInvoices]);

  useEffect(() => {
    dispatch(getCrmItemsThunk({ module: 'clients' }));
    dispatch(getCrmItemsThunk({ module: 'architects' }));
  }, [formik.values.client, formik.values.architect, dispatch]);

  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: <p>Edit</p>,
    },
    {
      key: 'createPhase',
      label: <p>Next Payable</p>,
    },
    {
      key: 'view',
      label: <p>View Invoice</p>,
    },
    {
      key: 'delete',
      label: <p>Delete</p>,
    },
  ];
  const columns: ColumnsType<IAIAInvoice> = [
    {
      title: 'Invoice #',
      dataIndex: 'applicationNo',
    },
    {
      title: 'Invoice Name',
      dataIndex: 'invoiceName',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Owner',
      dataIndex: 'toOwner',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      render(value, record) {
        return CurrencyFormat(
          value,
          record.currency?.locale,
          record.currency?.code
        );
      },
    },
    {
      title: 'Project Name',
      dataIndex: 'project',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Distributed To',
      dataIndex: 'distributionTo',
      render: (value: string | string[]) => {
        if (Array.isArray(value)) {
          return value.map((item) => _.capitalize(item)).join(', ');
        }
        return _.capitalize(value);
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              if (key === 'edit') {
                router.push(
                  `${Routes.Financial['AIA-Invoicing']}/form?id=${record._id}&mode=edit`
                );
              } else if (key === 'createPhase') {
                router.push(
                  // `${Routes.Financial['AIA-Invoicing']}/invoice/${record._id}`
                  `${Routes.Financial['AIA-Invoicing']}/form?id=${record._id}&mode=phase`
                );
              } else if (key === 'delete') {
                Modal.confirm({
                  title: 'Are you sure delete this invoice?',
                  icon: <ExclamationCircleFilled />,
                  okText: 'Yes',
                  okType: 'danger',
                  style: { backgroundColor: 'white' },
                  cancelText: 'No',
                  onOk() {
                    dispatch(deleteClientInvoiceRequest(record._id));
                  },
                  onCancel() {},
                });
              } else if (key === 'view') {
                router.push(
                  // `${Routes.Financial['AIA-Invoicing']}/view/${record._id}`
                  `${Routes.Financial['AIA-Invoicing']}/form?id=${record._id}&mode=view`
                );
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
      ),
    },
  ];

  const filteredClientInvoices =
    clientInvoices.length > 0
      ? clientInvoices.filter((invoice: any) => {
          if (!search) {
            return invoice;
          }
          return (
            invoice.invoiceName === search ||
            invoice!.toOwner.toLowerCase().includes(search.toLowerCase())
          );
        })
      : [];

  return (
    <div className="w-full mb-4">
      <div className="flex  justify-between flex-wrap items-center md:flex-nowrap mb-2">
        <TertiaryHeading title="AIA Invoicing" className="text-graphiteGray" />
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
                value: search,
                onChange: (e) => setSearch(e.target.value),
              }}
            />
          </div>
          <CustomButton
            text="Create Invoice"
            icon="/plus.svg"
            className="!w-auto"
            iconwidth={20}
            iconheight={20}
            onClick={() => setShowModal(true)}
          />

          <ModalComponent
            open={showClientModal}
            setOpen={() => setShowClientModal(false)}
            width="60%"
          >
            <Popups
              title="Add Client"
              onClose={() => setShowClientModal(false)}
            >
              <AddCrmClientForm
                onClose={() => setShowClientModal(false)}
                onSuccess={(client) => {
                  if (client.module === 'clients') {
                    formik.setFieldValue('client', client._id);
                  }
                }}
              />
            </Popups>
          </ModalComponent>

          <ModalComponent
            open={showArchitectModal}
            setOpen={() => setShowArchitectModal(false)}
            width="60%"
          >
            <Popups
              title="Add Architect"
              onClose={() => setShowArchitectModal(false)}
            >
              <AddCrmArchitectForm
                onClose={() => setShowArchitectModal(false)}
                onSuccess={(item) => {
                  if (item.module === 'architects') {
                    formik.setFieldValue('architect', item._id);
                  }
                }}
              />
            </Popups>
          </ModalComponent>

          <ModalComponent
            open={showModal}
            setOpen={() => {
              formik.resetForm();
              setShowModal(false);
            }}
            title="Client Invoice"
            width="40%"
          >
            <div className="bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
              <div className="flex px-6  py-2.5 justify-between bg-schestiLightPrimary">
                <TertiaryHeading
                  title="AIA Invoice"
                  className="text-graphiteGray"
                />
                <CloseOutlined
                  className="cursor-pointer"
                  style={{ fontSize: '24px', height: '24px' }}
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="px-6 py-2.5">
                <InputComponent
                  label="Invoice Name"
                  type="text"
                  placeholder="Enter invoice name"
                  name="invoiceName"
                  hasError={
                    formik.touched.invoiceName && !!formik.errors.invoiceName
                  }
                  errorMessage={
                    formik.touched.invoiceName && formik.errors.invoiceName
                      ? formik.errors.invoiceName
                      : ''
                  }
                  field={{
                    type: 'text',
                    onChange: formik.handleChange,
                    onBlur: formik.handleBlur,
                    value: formik.values.invoiceName,
                  }}
                />

                <div className="mt-2">
                  <SelectComponent
                    label="Client"
                    name="client"
                    label2={
                      <div
                        onClick={() => {
                          setShowClientModal(true);
                        }}
                        className="text-schestiPrimary space-x-1 hover:cursor-pointer hover:underline flex items-center"
                      >
                        <PlusOutlined />
                        <span>Add New</span>
                      </div>
                    }
                    placeholder="Select Client"
                    field={{
                      value: formik.values.client
                        ? formik.values.client
                        : undefined,
                      onChange: (val) => formik.setFieldValue('client', val),
                      onBlur: formik.handleBlur,

                      loading: crmState.loading,
                      options: crmState.clients.map((item) => {
                        const client = item as unknown as ICrmItem;
                        return {
                          label: `${client.firstName} ${client.lastName}`,
                          value: client._id,
                        };
                      }),
                    }}
                    hasError={formik.touched.client && !!formik.errors.client}
                    errorMessage={
                      formik.touched.client && formik.errors.client
                        ? formik.errors.client
                        : ''
                    }
                  />
                </div>

                <div className="mt-2">
                  <SelectComponent
                    label="Architect"
                    name="architect"
                    placeholder="Select architect"
                    label2={
                      <div
                        onClick={() => setShowArchitectModal(true)}
                        className="text-schestiPrimary space-x-1 hover:cursor-pointer hover:underline flex items-center"
                      >
                        <PlusOutlined />
                        <span>Add New</span>
                      </div>
                    }
                    field={{
                      value: formik.values.architect
                        ? formik.values.architect
                        : undefined,
                      onChange: (val) => formik.setFieldValue('architect', val),
                      onBlur: formik.handleBlur,
                      loading: crmState.loading,
                      options: crmState.architects.map((item) => {
                        const architect = item as unknown as ICrmItem;
                        return {
                          label: `${architect.firstName} ${architect.lastName}`,
                          value: architect._id,
                        };
                      }),
                    }}
                    hasError={
                      formik.touched.architect && !!formik.errors.architect
                    }
                    errorMessage={
                      formik.touched.architect && formik.errors.architect
                        ? formik.errors.architect
                        : ''
                    }
                  />
                </div>
                <div className="flex justify-end py-2 space-x-2">
                  <WhiteButton
                    text="Cancel"
                    className="!w-[100px]"
                    onClick={() => setShowModal(false)}
                  />
                  <CustomButton
                    text="Next"
                    className="!w-[100px]"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </ModalComponent>
        </div>
      </div>

      <Table
        loading={clientInvoicesLoading}
        columns={columns}
        dataSource={filteredClientInvoices}
        pagination={{ position: ['bottomCenter'] }}
        bordered
        expandable={{
          expandedRowRender: (record) => (
            <AIAInvoicePhasesTable parentInvoice={record} key={record._id} />
          ),
          expandedRowKeys: expandedRows,
          onExpandedRowsChange(expandedKeys) {
            setExpandedRows(expandedKeys);
          },
        }}
        rowKey={(row) => row._id}
        rowClassName={(row) =>
          expandedRows.includes(row._id) ? 'bg-schestiLightPrimary' : ''
        }
      />
    </div>
  );
}
