'use client';
import type { ColumnsType } from 'antd/es/table';
import { Dropdown, Table, type MenuProps, Tag, Drawer, Modal } from 'antd';
import { ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';

import CustomButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { InputComponent } from '@/app/component/customInput/Input';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteContractorInvoiceRequest,
  fetchSubcontractorInvoices,
} from '@/redux/invoice/invoice.thunk';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import type { IInvoice } from '@/app/interfaces/invoices.interface';
import Image from 'next/image';
import moment from 'moment';
import { CollectPayment } from './CollectPayment';
import { usePDF } from '@react-pdf/renderer';
import { Routes } from '@/app/utils/plans.utils';
import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';
import NewClientPdf from '../../standard-invoicing/view/[id]/newClientPdf';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { CurrencyFormat } from '@/app/utils/format';

export function Contractors() {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();
  const subcontractersInvoices = useSelector(
    (state: RootState) => state.invoices.data
  );
  const subcontractersInvoicesLoading = useSelector(
    (state: RootState) => state.invoices.loading
  );
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user?.user as IUpdateCompanyDetail | undefined;
  const [pdfInstance, updatePdfInstance] = usePDF({ document: undefined });
  const [search, setSearch] = useState('');

  const fetchSubcontactorsInvoices = useCallback(async () => {
    await dispatch(fetchSubcontractorInvoices({}));
  }, [dispatch]);

  useEffect(() => {
    fetchSubcontactorsInvoices();
  }, [fetchSubcontactorsInvoices]);

  const items: MenuProps['items'] = [
    {
      key: 'download',
      label: (
        <a
          href={pdfInstance.url ? pdfInstance.url : undefined}
          download={`invoice_${new Date().getTime()}.pdf`}
        >
          {pdfInstance.url ? 'Download Pdf' : 'Generating Pdf...'}
        </a>
      ),
    },
    {
      key: 'view',
      label: <p>View Invoice</p>,
    },
    {
      key: 'editInvoice',
      label: <p>Edit Invoice</p>,
    },
    {
      key: 'collectPayments',
      label: <p>Collect Payments</p>,
    },
    {
      key: 'delete',
      label: <p>Delete</p>,
    },
  ];

  async function handleDropdownItemClick(key: string, record: IInvoice) {
    if (key === 'editInvoice') {
      router.push(
        `${Routes.Financial['Standard-Invoicing']}/edit/${record._id}`
      );
    } else if (key === 'delete') {
      Modal.confirm({
        title: 'Are you sure delete this invoice?',
        icon: <ExclamationCircleFilled />,
        okText: 'Yes',
        okType: 'danger',
        style: { backgroundColor: 'white' },
        cancelText: 'No',
        async onOk() {
          await dispatch(deleteContractorInvoiceRequest(record._id));
        },
        onCancel() {},
      });
    } else if (key === 'view') {
      router.push(
        `${Routes.Financial['Standard-Invoicing']}/details/${record._id}?from=system`
      );
    } else if (key === 'collectPayments') {
      setSelectedInvoice(record);
    }
  }
  const columns: ColumnsType<IInvoice> = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      filterSearch: true,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
    },
    {
      title: 'Subcontractor Rep',
      dataIndex: 'companyRep',
      ellipsis: true,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'issueDate',
      render(value) {
        return <p>{moment(value).format('DD/MM/YYYY')}</p>;
      },
    },
    {
      title: 'Payment Due',
      dataIndex: 'dueDate',
      render(value) {
        return <p>{moment(value).format('DD/MM/YYYY')}</p>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(value) {
        if (value === 'paid') {
          return (
            <Tag className="rounded-full" color="green">
              Paid
            </Tag>
          );
        }
        return (
          <Tag className="rounded-full" color="red">
            Unpaid
          </Tag>
        );
      },
    },
    {
      title: 'Total Payable',
      dataIndex: 'totalPayable',
      render(value, record) {
        if (!value) {
          return null;
        }
        return CurrencyFormat(
          Number(value),
          record.currency?.locale,
          record.currency?.code
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
          onOpenChange={(open) => {
            if (open) {
              const qrCodeValue = `${process.env.NEXT_PUBLIC_APP_URL}/${Routes.Financial['Standard-Invoicing']}/view/${record._id}`;
              updatePdfInstance(
                <NewClientPdf
                  invoice={record}
                  user={user!}
                  qrCodeValue={qrCodeValue}
                />
              );
            } else {
              // @ts-ignore
              updatePdfInstance();
            }
            console.log('Visbibility Changing', open);
          }}
          menu={{
            items,
            onClick: (event) => {
              const { key } = event;
              handleDropdownItemClick(key, record);
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

  const filteredData = subcontractersInvoices
    ? subcontractersInvoices.filter((invoice) => {
        if (search === '') {
          return invoice;
        }
        return invoice.projectName.toLowerCase().includes(search.toLowerCase());
      })
    : [];
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between flex-wrap items-center md:flex-nowrap mb-2">
        <TertiaryHeading
          title="Standard Invoicing"
          className="text-graphiteGray"
        />
        <Drawer
          open={selectedInvoice !== null}
          onClose={() => setSelectedInvoice(null)}
          closable={false}
          title="Payment Installment"
          extra={
            <Image
              src="/closeicon.svg"
              alt="close"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => setSelectedInvoice(null)}
            />
          }
          width={500}
        >
          {selectedInvoice ? (
            <CollectPayment
              invoice={selectedInvoice}
              onSuccess={() => setSelectedInvoice(null)}
            />
          ) : null}
        </Drawer>
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
                onChange: (e) => {
                  setSearch(e.target.value);
                },
              }}
            />
          </div>
          <CustomButton
            text="Create Invoice"
            icon="/plus.svg"
            className="!w-auto"
            iconwidth={20}
            iconheight={20}
            onClick={() =>
              router.push(`${Routes.Financial['Standard-Invoicing']}/create`)
            }
          />
        </div>
      </div>

      <Table
        loading={subcontractersInvoicesLoading}
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{ position: ['bottomCenter'] }}
      />
    </div>
  );
}
