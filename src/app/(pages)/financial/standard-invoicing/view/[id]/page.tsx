// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import TertiaryHeading from '@/app/component/headings/tertiary';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import QuinaryHeading from '@/app/component/headings/quinary';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import Table, { type ColumnType } from 'antd/es/table';
import { Button, ConfigProvider, Divider, QRCode, Skeleton } from 'antd';
import CustomButton from '@/app/component/customButton/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import moment from 'moment';
import { useQuery } from 'react-query';
import { invoiceService } from '@/app/services/invoices.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import NewClientPdf from './newClientPdf';
import WhiteButton from '@/app/component/customButton/white';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import emailService from '@/app/services/email.service';
import ModalComponent from '@/app/component/modal';
import { useUser } from '@/app/hooks/useUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { CurrencyFormat } from '@/app/utils/format';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';

function ViewSubcontractorInvoicePage() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params.id;
  const authUser = useUser();
  const router = useRouterHook();

  const invoiceQuery = useQuery<
    IResponseInterface<{ invoice: IInvoice }> | null,
    AxiosError<{ message: string; statusCode: number }>
  >(
    ['get-contractor-invoice', id],
    () => {
      if (!id) {
        return null;
      }
      return invoiceService.httpGetSubcontractorInvoiceById(id);
    },
    {
      onError(err) {
        toast.error(err.response?.data.message || 'Unable to get the invoice');
      },
      staleTime: 60 * 5000,
    }
  );

  // calculate sub total
  function calculateSubTotal(items: IInvoice['invoiceItems']) {
    return items.reduce((total, invoice) => {
      return total + invoice.quantity * invoice.unitCost;
    }, 0);
  }

  if (invoiceQuery.isLoading) {
    return <Skeleton />;
  }

  if (!invoiceQuery.data?.data?.invoice) {
    return null;
  }

  const invoiceData = invoiceQuery.data.data.invoice;
  const user = invoiceData.associatedCompany as IUserInterface;
  const columns: ColumnType<IInvoice['invoiceItems'][0]>[] = [
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
    },
    {
      title: 'Total Price',
      dataIndex: 'total',
      render(_value, record) {
        return `${CurrencyFormat(record.total, invoiceData.currency?.locale || user.currency.locale, invoiceData.currency?.code || user.currency.code)}`;
      },
    },
  ];

  const qrCodeValue = `${process.env.NEXT_PUBLIC_APP_URL}/${Routes.Financial['Standard-Invoicing']}/view/${invoiceData._id}`;

  return (
    <section className="mx-4 my-2 space-y-3">
      <ModalComponent
        open={showEmailModal}
        setOpen={setShowEmailModal}
        width="50%"
      >
        <CustomEmailTemplate
          to={invoiceData.subContractorEmail}
          setEmailModal={setShowEmailModal}
          isFileUploadShow={true}
          submitHandler={async (formData) => {
            try {
              const response = await emailService.httpSendEmail(formData);
              if (response.statusCode === 200) {
                toast.success(response.message);
                setShowEmailModal(false);
              }
            } catch (error) {
              const err = error as AxiosError<{ message: string }>;
              toast.error(err.response?.data.message || 'An error occurred');
            }
          }}
          shouldUpdateTo
        />
      </ModalComponent>

      {/* From param is used to indicate that the user is coming from the System and no need to show go to dashboard */}
      {/* If user is coming from email then it will show go to dashboard */}
      {authUser && !searchParams.get('from') ? (
        <Button onClick={() => router.push('/dashboard')} type="text">
          Go to Dashboard
        </Button>
      ) : null}
      <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-5">
            <TertiaryHeading title="Invoice Details" />
            <div className="flex items-center space-x-2">
              <QuinaryHeading
                title="Invoice Number#"
                className="text-gray-400"
              />
              <QuaternaryHeading title={invoiceData.invoiceNumber} />
            </div>
            {invoiceData.status === 'paid' ? (
              <div className="inline-flex items-center rounded-lg whitespace-nowrap border px-7 py-3 w-fit font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary-foreground hover:bg-secondary/80 text-[#6aa689] text-md bg-green-50">
                Paid
              </div>
            ) : (
              <div className="inline-flex items-center rounded-lg whitespace-nowrap border px-7 py-3 w-fit font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary-foreground hover:bg-secondary/80 text-[#EFA037] text-md bg-yellow-50">
                Unpaid
              </div>
            )}
          </div>
          {authUser?._id == user._id ? (
            <div className="flex items-center space-x-2">
              <QRCode value={invoiceData._id} size={60} />

              <WhiteButton text="Send SMS" className="!w-fit" />

              <WhiteButton
                text="Send Email"
                className="!w-fit !bg-schestiLightPrimary !border-schestiLightPrimary"
                onClick={() => setShowEmailModal(true)}
              />
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-5 gap-5 mt-5">
          <div>
            <QuinaryHeading title="Invoice Subject" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.invoiceSubject} />
          </div>
          <div>
            <QuinaryHeading title="Project Name" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.projectName} />
          </div>
          <div>
            <QuinaryHeading title="Application#" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.applicationNumber} />
          </div>
          <div>
            <QuinaryHeading title="Issue Date" className="text-gray-400" />

            <QuaternaryHeading
              title={moment(invoiceData.issueDate).format('MM/DD/YYYY')}
            />
          </div>
          <div>
            <QuinaryHeading title="Due Date" className="text-gray-400" />

            <QuaternaryHeading
              title={moment(invoiceData.dueDate).format('MM/DD/YYYY')}
            />
          </div>
          <div>
            <QuinaryHeading title="Recipient Name" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.companyRep} />
          </div>
          <div>
            <QuinaryHeading title="Phone Number" className="text-gray-400" />

            <QuaternaryHeading
              title={`${invoiceData.subContractorPhoneNumber}`}
            />
          </div>
          <div>
            <QuinaryHeading title="Email" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.subContractorEmail} />
          </div>
          <div>
            <QuinaryHeading title="Company Name" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.subContractorCompanyName} />
          </div>
          <div>
            <QuinaryHeading title="Company Address" className="text-gray-400" />

            <QuaternaryHeading title={invoiceData.subContractorAddress} />
          </div>
        </div>
      </div>

      <div className="p-5 mt-3 rounded-lg space-y-2 border border-silverGray shadow-secondaryShadow2 bg-white">
        <TertiaryHeading title="Invoice Items" />
        <ConfigProvider
          theme={{
            components: {
              Table: {
                // headerBg: "#F9F5FF",
                borderColor: 'red',
              },
            },
          }}
        >
          <Table
            loading={false}
            columns={columns}
            dataSource={invoiceData.invoiceItems}
            rowKey={(record) => record._id}
            pagination={{ position: ['bottomCenter'] }}
          />
        </ConfigProvider>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="flex items-center space-x-2">
          <QuaternaryHeading title="Sub total:" />
          <QuinaryHeading
            title={CurrencyFormat(
              calculateSubTotal(invoiceData.invoiceItems),
              invoiceData.currency?.locale || user.currency.locale,
              invoiceData.currency?.code || user.currency.code
            )}
            className="font-bold"
          />
        </div>

        <div className="flex items-center space-x-2">
          <QuaternaryHeading title="Discount:" />
          <QuinaryHeading
            title={`${invoiceData.discount}%`}
            className="font-bold"
          />
        </div>

        <div className="flex items-center space-x-2">
          <QuaternaryHeading title="Taxes:" />
          <QuinaryHeading
            title={`${CurrencyFormat(invoiceData.taxes, invoiceData.currency?.locale || user.currency.locale, invoiceData.currency?.code || user.currency.code)}`}
            className="font-bold"
          />
        </div>

        <div className="flex items-center space-x-2">
          <QuaternaryHeading title="Profit And Overhead:" />
          <QuinaryHeading
            title={`${invoiceData.profitAndOverhead}%`}
            className="font-bold"
          />
        </div>

        <div className="flex items-center space-x-2">
          <QuaternaryHeading title="Total:" />
          <QuinaryHeading
            title={`${CurrencyFormat(invoiceData.totalPayable, invoiceData.currency?.locale || user.currency.locale, invoiceData.currency?.code || user.currency.code)}`}
            className="font-bold"
          />
        </div>
      </div>
      <Divider />
      <div className="mt-4 flex justify-end">
        <PDFDownloadLink
          document={
            <NewClientPdf
              invoice={invoiceData}
              user={invoiceData.associatedCompany}
              qrCodeValue={qrCodeValue}
            />
          }
          fileName="invoice.pdf"
        >
          {({ loading }) => (
            <CustomButton
              isLoading={loading}
              loadingText="Downloading"
              text={loading ? 'Downloading...' : 'Download'}
              className="!w-48"
            />
          )}
        </PDFDownloadLink>
      </div>
    </section>
  );
}

export default ViewSubcontractorInvoicePage;
