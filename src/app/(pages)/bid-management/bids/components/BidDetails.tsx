import CustomButton from '@/app/component/customButton/button';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import Image from 'next/image';
import { Divider, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { size } from 'lodash';
import { useState } from 'react';
import { ISubmittedProjectBid } from '@/app/interfaces/bid-management/bid-management.interface';
import { Excel } from 'antd-table-saveas-excel';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { Bid_How_Long_Price_Increase } from '../../utils';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  bid: any;
  selectedBidProjectDetails: ISubmittedProjectBid[];
};

export function BidDetails({ bid, selectedBidProjectDetails }: Props) {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: IUserInterface }
  );
  const selectedBidProjectDetail = selectedBidProjectDetails.find((detail) => {
    return typeof authUser?.user === 'string'
      ? detail.user === authUser?.user
      : detail.user === authUser?.user?._id;
  });

  const currency = useCurrencyFormatter({
    currency:
      typeof selectedBidProjectDetail?.projectId !== 'string'
        ? selectedBidProjectDetail?.projectId.currency
        : undefined,
  });

  const proposalCurrency = useCurrencyFormatter({
    currency: selectedBidProjectDetail?.currency,
  });

  const columns: ColumnsType<{ _id: string; quantity: number; price: number }> =
    [
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
      },
      {
        key: 'unitPrice',
        title: 'Unit Price',
        dataIndex: 'price',
        render(value) {
          return value ? proposalCurrency.format(value) : null;
        },
      },
      {
        key: 'total',
        title: 'Total',
        dataIndex: 'total',
        render(value, record) {
          return currency.format(record.quantity * record.price);
        },
      },
    ];

  const download = (url: string, name: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  const downloadFile = (detail: ISubmittedProjectBid) => {
    setIsDownloadingAll(true);
    download(detail.file.url, detail.file.name);
    setIsDownloadingAll(false);
  };

  const handleDownloadScope = (selectedBid: ISubmittedProjectBid) => {
    const excel = new Excel();
    excel
      .addSheet(bid.projectId?.projectName)
      .addColumns(columns as any)
      .addDataSource(selectedBid.projectScopes, {
        str2Percent: true,
      })
      .saveAs(`${bid.projectId?.projectName}-${Date.now()}.xlsx`);
  };

  return (
    <div className="col-span-4 mt-3">
      <div>
        <SenaryHeading
          title={'Project Name'}
          className="font-normal text-[#475467] text-xs leading-4"
        />
        <div className="flex mt-1 items-center space-x-3">
          {bid.user?.companyLogo ? (
            <Image
              src={bid.user?.companyLogo}
              width={18}
              height={18}
              alt="trade icon"
            />
          ) : null}
          <SenaryHeading
            title={bid.projectId?.projectName}
            className="font-medium text-[#001556] text-base leading-6"
          />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-centers space-x-2">
          <SenaryHeading
            title={'Project Price:'}
            className="font-normal text-[#475467] text-xs leading-4"
          />

          <SenaryHeading
            title={currency.format(bid.projectId?.projectValue)}
            className="font-semibold text-[#475467] text-xs leading-4"
          />
        </div>
        <div className="flex items-centers space-x-2">
          <SenaryHeading
            title={'Deadline:'}
            className="font-normal text-[#475467] text-xs leading-4"
          />

          <SenaryHeading
            title={
              selectedBidProjectDetail
                ? `${selectedBidProjectDetail.projectDuration} ${selectedBidProjectDetail.projectDurationType.toUpperCase()}`
                : ''
            }
            className="font-semibold text-[#475467] text-xs leading-4"
          />
        </div>
        <div className="flex items-centers space-x-2">
          <SenaryHeading
            title={'Bid Time:'}
            className="font-normal text-[#475467] text-xs leading-4"
          />

          {selectedBidProjectDetail ? (
            <SenaryHeading
              title={`${moment(selectedBidProjectDetail.createdAt).format(
                'DD MMM YYYY, hh:mm'
              )}`}
              className="font-semibold text-[#475467] text-xs leading-4"
            />
          ) : null}
        </div>

        <Link
          href={`/bid-management/details/${bid.projectId?._id}`}
          className="text-schestiPrimary hover:text-schestiPrimary underline underline-offset-2 mt-4 text-[14px] leading-6 font-normal cursor-pointer"
        >
          View full details
        </Link>
      </div>

      <Divider />
      <div className="mt-3">
        <SenaryHeading
          title={
            selectedBidProjectDetail
              ? selectedBidProjectDetail.additionalDetails
              : ' '
          }
          className="font-normal text-[#475467] text-sm leading-6"
        />
      </div>

      <Divider />
      <div className="mt-2 flex flex-col space-y-2 justify-between">
        <div className="flex items-center space-x-2">
          <SenaryHeading
            title="How long this price will stay?"
            className="font-normal text-[#667085] text-xs leading-4"
          />
          <SenaryHeading
            title={
              selectedBidProjectDetail
                ? Bid_How_Long_Price_Increase.find((bidprice) => {
                    return (
                      selectedBidProjectDetail.priceExpiryDuration ===
                      bidprice.value
                    );
                  })!.label
                : ''
            }
            className="font-semibold text-[#101828] text-xs leading-4"
          />
        </div>
        <div className="flex items-center space-x-2">
          <SenaryHeading
            title="How much you want to increase?"
            className="font-normal text-[#667085] text-xs leading-4"
          />
          <SenaryHeading
            title={`${selectedBidProjectDetail?.increaseInPercentage} %`}
            className="font-semibold text-[#101828] text-xs leading-4"
          />
        </div>
      </div>
      <Divider />
      {size(selectedBidProjectDetail?.projectScopes) > 0 && (
        <div className="mt-2 space-y-3">
          <SenaryHeading
            title="Project Scope"
            className="font-semibold text-[#101828] text-xs leading-4"
          />

          {selectedBidProjectDetail ? (
            <Table
              // @ts-ignore
              columns={columns}
              dataSource={selectedBidProjectDetail.projectScopes.map((el) => ({
                description: el.description,
                quantity: el.quantity,
                price: el.price,
              }))}
              pagination={false}
              bordered
            />
          ) : null}
        </div>
      )}
      {selectedBidProjectDetail ? (
        <div className="px-4 mt-3 space-y-3">
          {selectedBidProjectDetail.file.url ? (
            <CustomButton
              onClick={() => downloadFile(selectedBidProjectDetail)}
              isLoading={isDownloadingAll}
              text="Download All Files"
            />
          ) : null}

          {selectedBidProjectDetail.projectScopes.length ? (
            <CustomButton
              onClick={() => handleDownloadScope(selectedBidProjectDetail)}
              text="Download Scopes"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
