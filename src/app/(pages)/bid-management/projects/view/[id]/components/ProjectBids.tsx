import { Bid_How_Long_Price_Increase } from '@/app/(pages)/bid-management/utils';
import CustomButton from '@/app/component/customButton/white';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import type {
  IBidProjectScope,
  IProjectBidding,
} from '@/app/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from '@/app/services/bid-management.service';
import { Divider, Skeleton, Table, Tooltip } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import type { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  projectId: string;
};
export function ProjectBids({ projectId }: Props) {
  const [biddings, setBiddings] = useState<IProjectBidding[]>([]);
  const [tradeCounts, setTradeCounts] = useState<
    {
      trade: string;
      proposalCount: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBid, setSelectedBid] = useState<null | IProjectBidding>(null);
  const currency = useCurrencyFormatter();
  useEffect(() => {
    getProjectBiddings();
  }, [projectId]);

  const columns: ColumnsType<IBidProjectScope> = [
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
        return currency.format(
          value,
          selectedBid?.currency?.locale,
          selectedBid?.currency?.code
        );
      },
    },
    {
      key: 'total',
      title: 'Total',
      render(value, record) {
        return currency.format(
          Number(record.quantity) * Number(record.price),
          selectedBid?.currency?.locale,
          selectedBid?.currency?.code
        );
      },
    },
  ];

  async function getProjectBiddings() {
    setIsLoading(true);
    try {
      if (projectId) {
        const response =
          await bidManagementService.httpGetProjectBiddings(projectId);
        if (response.data) {
          setBiddings(response.data.projectBiddings);
          if (response.data.tradeCounts) {
            setTradeCounts(response.data.tradeCounts);
          }
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data) {
        toast.error(err.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Skeleton />;
  }

  function getHowLongPriceLabel(duration: number) {
    const result = Bid_How_Long_Price_Increase.find(
      (res) => res.value === duration
    );
    return result ? result.label : '';
  }

  const handleClick = (selectedBid: IProjectBidding) => {
    const excel = new Excel();
    excel
      .addSheet(selectedBid.projectId.projectName)
      .addColumns(columns as any)
      .addDataSource(selectedBid.projectScopes, {
        str2Percent: true,
      })
      .saveAs(`${selectedBid.projectId.projectName}.xlsx`);
  };

  return (
    <div className=" mt-6 mb-4 md:ms-[69px] md:me-[59px] mx-4 ">
      <div className=" p-5  bg-white rounded-lg border shadow-lg">
        <SenaryHeading
          title="Bid Coverage Overview"
          className="text-xl font-semibold text-[#344054] leading-9"
        />

        <div className="grid gap-3 grid-cols-8 mt-3">
          {tradeCounts.map((tradeCount, index) => {
            // get same trades

            return (
              <Tooltip key={index} title={tradeCount.trade}>
                <div
                  key={index}
                  className="flex space-x-2 items-center rounded-lg border-[#EAECF0] border bg-[#F9FAFB] py-3 px-4"
                >
                  <div className="flex  items-center space-x-1">
                    <SenaryHeading
                      title={`${tradeCount.trade.slice(0, 10)}...`}
                      className="text-[#667085] text-[14px] font-normal leading-6"
                    />
                    <SenaryHeading
                      title=""
                      className="text-[#667085] text-2xl font-semibold leading-8"
                    />
                  </div>
                  <SenaryHeading
                    title={`${tradeCount.proposalCount} Bids`}
                    className="text-[#667085] text-base font-normal leading-6"
                  />
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className=" ">
        <div className="grid grid-cols-12 gap-3">
          <div className={`${selectedBid ? 'col-span-8 ' : 'col-span-12'}`}>
            {biddings.length > 0 &&
              biddings.map((bid) => {
                const bidUser = bid.user;

                return (
                  <div
                    key={bid._id}
                    className={`mt-3 h-fit rounded-lg ${selectedBid?._id === bid._id ? '!bg-[#F2F4F7]' : '!bg-white'} bg-white shadow-lg hover:bg-[#e5def0] border border-[#E8E3EF] p-4 cursor-pointer`}
                    onClick={() => {
                      if (selectedBid && selectedBid._id === bid._id) {
                        setSelectedBid(null);
                      } else {
                        setSelectedBid(bid);
                      }
                    }}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={'/trade.svg'}
                          width={18}
                          height={18}
                          alt="trade icon"
                        />
                        <SenaryHeading
                          title={
                            typeof bidUser !== 'string' ? bidUser.name : ''
                          }
                          className="font-medium text-[#001556] text-base leading-6"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <SenaryHeading
                          title="Trade:"
                          className="font-normal text-[#667085] text-xs leading-6"
                        />
                        <p className="bg-schestiLightPrimary py-[5px] px-[11px] text-xs leading-4 text-schestiPrimary rounded-full">
                          {typeof bidUser !== 'string' ? bidUser.industry : ''}
                        </p>
                      </div>
                    </div>
                    <div className="mt-[17px] flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="space-y-2">
                          <SenaryHeading
                            title="Company Name:"
                            className="text-[#475467] font-normal text-xs leading-4"
                          />

                          <SenaryHeading
                            title={
                              typeof bidUser !== 'string'
                                ? bidUser.companyName
                                : ''
                            }
                            className="text-[#475467] font-semibold text-xs leading-4"
                          />
                        </div>
                        <div className="space-y-2">
                          <SenaryHeading
                            title="Project value: "
                            className="text-[#475467] font-normal text-xs leading-4"
                          />

                          <SenaryHeading
                            title={currency.format(
                              bid.price,
                              bid.currency?.locale,
                              bid.currency?.code
                            )}
                            className="text-[#475467] font-semibold text-xs leading-4"
                          />
                        </div>
                        <div className="space-y-2">
                          <SenaryHeading
                            title="Deadline: "
                            className="text-[#475467] font-normal text-xs leading-4"
                          />

                          <SenaryHeading
                            title={`${bid.projectDuration} ${bid.projectDurationType.toUpperCase()}`}
                            className="text-[#475467] font-semibold text-xs leading-4"
                          />
                        </div>
                        <div className="space-y-2">
                          <SenaryHeading
                            title="Bid date and time:"
                            className="text-[#475467] font-normal text-xs leading-4"
                          />

                          <SenaryHeading
                            title={moment(bid.createdAt).format(
                              'DD MMM YYYY, h:mm:A'
                            )}
                            className="text-[#475467] font-semibold text-xs leading-4"
                          />
                        </div>
                      </div>
                      <Image
                        src={'/forward-arrow.svg'}
                        width={46}
                        height={36}
                        alt="forward arrow icon"
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {selectedBid ? (
            <div className="col-span-4  mt-3 rounded-lg p-4 border border-[#E8E3EF] shadow-lg bg-white">
              <div>
                <SenaryHeading
                  title={'Company Name'}
                  className="font-normal text-[#475467] text-xs leading-4"
                />
                <div className="flex mt-1 items-center space-x-3">
                  <Image
                    src={'/trade.svg'}
                    width={18}
                    height={18}
                    alt="trade icon"
                  />
                  <SenaryHeading
                    title={
                      typeof selectedBid.user !== 'string'
                        ? selectedBid.user.name
                        : ''
                    }
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
                    title={currency.format(
                      selectedBid.price,
                      selectedBid.currency?.locale,
                      selectedBid.currency?.code
                    )}
                    className="font-semibold text-[#475467] text-xs leading-4"
                  />
                </div>
                <div className="flex items-centers space-x-2">
                  <SenaryHeading
                    title={'Deadline:'}
                    className="font-normal text-[#475467] text-xs leading-4"
                  />

                  <SenaryHeading
                    title={`${selectedBid.projectDuration} ${selectedBid.projectDurationType.toUpperCase()}`}
                    className="font-semibold text-[#475467] text-xs leading-4"
                  />
                </div>
                <div className="flex items-centers space-x-2">
                  <SenaryHeading
                    title={'Bid Time:'}
                    className="font-normal text-[#475467] text-xs leading-4"
                  />

                  <SenaryHeading
                    title={moment(selectedBid.createdAt).format(
                      'DD MMM YYYY, h:mm:A'
                    )}
                    className="font-semibold text-[#475467] text-xs leading-4"
                  />
                </div>
              </div>

              <Divider />
              <div className="mt-3">
                <SenaryHeading
                  title={selectedBid.additionalDetails}
                  className="font-normal text-[#475467] text-sm leading-6"
                />
              </div>

              <Divider />

              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-1">
                  <SenaryHeading
                    title="How long this price will stay?"
                    className="font-normal text-[#667085] text-xs leading-4"
                  />
                  <SenaryHeading
                    title={getHowLongPriceLabel(
                      selectedBid.priceExpiryDuration
                    )}
                    className="font-semibold text-[#101828] text-xs leading-4"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <SenaryHeading
                    title="How much you want to increase?"
                    className="font-normal text-[#667085] text-xs leading-4"
                  />
                  <SenaryHeading
                    title={`${selectedBid.increaseInPercentage} %`}
                    className="font-semibold text-[#101828] text-xs leading-4"
                  />
                </div>
              </div>

              <Divider />

              <div className="mt-2 space-y-3">
                <SenaryHeading
                  title="Project Scope"
                  className="font-semibold text-[#101828] text-xs leading-4"
                />

                <Table
                  columns={columns}
                  dataSource={selectedBid.projectScopes}
                  pagination={false}
                  bordered
                />

                <CustomButton
                  text="Export Scope"
                  onClick={() => handleClick(selectedBid)}
                />
              </div>

              {selectedBid.file?.url ? (
                <div className="px-4 space-y-2 mt-3">
                  <a
                    href={selectedBid.file.url}
                    target="_blank"
                    download={selectedBid.file.url}
                    className="rounded-[8px] flex justify-center border border-solid border-schestiPrimary bg-schestiPrimary text-white leading-6 font-semibold py-3 px-5  cursor-pointer shadow-scenarySubdued h-auto text-sm w-full"
                  >
                    Download File
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
