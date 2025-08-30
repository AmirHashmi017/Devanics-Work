import { InputComponent } from '@/app/component/customInput/Input';
import PrimaryHeading from '@/app/component/headings/primary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { CurrencyFormat } from '@/app/utils/format';
import { Table } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import moment from 'moment';

type Props = {
  parentInvoice: IAIAInvoice;
};
export function AIAHistory({ parentInvoice }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IAIAInvoice[]>([]);
  const [search, setSearch] = useState('');
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    getParentInvoices(parentInvoice._id);
  }, [parentInvoice._id]);

  async function getParentInvoices(id: string) {
    setIsLoading(true);
    try {
      const response = await clientInvoiceService.httpGetInvoicePhases(id);
      if (response.data) {
        setData(response.data.invoices);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const columns: ColumnsType<IAIAInvoice> = [
    {
      title: 'Pay Application',
      dataIndex: 'applicationNo',
    },

    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      render(value, record) {
        return CurrencyFormat(
          value,
          record.currency?.locale,
          record.currency?.code
        );
      },
    },
    {
      title: 'To Owner',
      dataIndex: 'toOwner',
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      ellipsis: true,
      width: 300,
      render(value) {
        return moment(value).format('ll');
      },
    },
    {
      title: 'Period To',
      dataIndex: 'periodTo',
      ellipsis: true,
      width: 300,
      render(value) {
        return moment(value).format('ll');
      },
    },
  ];

  const filteredData = data.filter((item) => {
    if (!search) {
      return true;
    }
    return (
      item.invoiceName?.toLowerCase().includes(search.toLowerCase()) ||
      item.applicationNo?.toLowerCase().includes(search.toLowerCase()) ||
      item.toOwner?.toLowerCase().includes(search.toLowerCase()) ||
      item.project?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-5 space-y-5 shadow-md rounded-lg border border-silverGray  bg-white">
      <div className="flex justify-between items-center">
        <PrimaryHeading title="Invoice History" className="text-[18px]" />

        <InputComponent
          label=""
          name=""
          type="text"
          placeholder="Search Invoice History"
          prefix={
            <Image
              alt="search icon"
              src={'/search.svg'}
              width={20}
              height={20}
            />
          }
          field={{
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
            },
          }}
        />
      </div>

      <div>
        <div className="grid grid-cols-8 px-4 gap-3">
          <TertiaryHeading
            title="Invoice #"
            className="text-schestiLightBlack font-normal text-sm"
          />
          <TertiaryHeading
            className="text-schestiLightBlack font-normal text-sm"
            title="Invoice Name"
          />

          <TertiaryHeading
            className="text-schestiLightBlack font-normal text-sm"
            title="Owner Name"
          />
          <TertiaryHeading
            className="text-schestiLightBlack font-normal text-sm"
            title="Project Name"
          />
          <TertiaryHeading
            className="text-schestiLightBlack font-normal text-sm"
            title="Address"
          />
          <TertiaryHeading
            className="text-schestiLightBlack font-normal text-sm"
            title="Distributed To"
          />
          <TertiaryHeading
            className="text-schestiLightBlack font-normal text-sm"
            title="Invoices"
          />
        </div>

        <div className="grid grid-cols-8 gap-3 mt-4 p-4 rounded-md bg-schestiLightPrimary">
          <TertiaryHeading
            title={parentInvoice.applicationNo}
            className="text-schestiPrimaryBlack text-sm"
          />
          <TertiaryHeading
            title={parentInvoice.invoiceName}
            className="text-schestiPrimaryBlack text-sm"
          />

          <TertiaryHeading
            title={parentInvoice.toOwner}
            className="text-schestiPrimaryBlack text-sm"
          />
          <TertiaryHeading
            title={parentInvoice.project}
            className="text-schestiPrimaryBlack text-sm"
          />
          <TertiaryHeading
            title={parentInvoice.address}
            className="text-schestiPrimaryBlack text-sm"
          />

          <TertiaryHeading
            title={
              Array.isArray(parentInvoice.distributionTo)
                ? parentInvoice.distributionTo.join(', ')
                : parentInvoice.distributionTo
            }
            className="text-schestiPrimaryBlack text-sm uppercase"
          />

          <div className="flex items-center space-x-1">
            <TertiaryHeading
              title={data.length.toString()}
              className="text-schestiPrimaryBlack text-sm"
            />

            {!collapse ? (
              // <LuArrowDownCircle
              // onClick={() => setCollapse(true)}
              // className="text-schestiPrimary"
              // />
              <Image
                src={'/chevron-up.svg'}
                width={20}
                height={20}
                onClick={() => setCollapse(true)}
                alt="Up"
                className="cursor-pointer"
              />
            ) : (
              <Image
                className="cursor-pointer"
                alt="Down"
                src={'/chevron-down.svg'}
                width={20}
                height={20}
                onClick={() => setCollapse(false)}
              />
            )}
          </div>
        </div>

        {collapse ? (
          <div className="p-4 bg-schestiPrimaryBG">
            <Table
              columns={columns}
              dataSource={[parentInvoice, ...filteredData]}
              loading={isLoading}
              pagination={{
                position: ['bottomCenter'],
              }}
              bordered
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
