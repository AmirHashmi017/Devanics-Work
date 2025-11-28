import React, { useCallback, useState, useEffect } from 'react';
import { Dropdown, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

// module imports
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { supportTicketsService } from 'src/services/supportTicket.service';
import { ISupportTicket } from 'src/interfaces/supportTicketInterfaces/supportTicket.interface';
import QuinaryHeading from 'src/components/Headings/Quinary';
import moment from 'moment';
import Description from 'src/components/discription';
import NoData from 'src/components/noData';

const SupportTickets = () => {
  let navigate = useNavigate();
  const [supportTickets, setSupportTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination] = useState({
    page: 1,
    limit: 9,
  });

  const fetchedSupportTicketsHandler = useCallback(async () => {
    let result = await supportTicketsService.httpGetAdminSupportTickets(
      pagination.page,
      pagination.limit
    );
    setIsLoading(false);
    setSupportTickets(result?.data?.supportTickets);
  }, []);

  useEffect(() => {
    fetchedSupportTicketsHandler();
  }, []);

  const items: MenuProps['items'] = [
    {
      key: 'detail',
      label: 'Detail',
    },
  ];

  const handleDropdownItemClick = async (
    key: string,
    supportTicket: ISupportTicket
  ) => {
    if (key == 'detail') {
      navigate(`/supporticket/${supportTicket._id}`);
    }
  };

  console.log(supportTickets, 'supportTicketssupportTickets');

  const ticketStatusHandler = async (e: any) => {
    let result = await supportTicketsService.httpGetAdminSupportTickets(
      pagination.page,
      pagination.limit,
      e.target.value
    );

    setSupportTickets(result?.data?.supportTickets);
  };

  console.log(supportTickets, 'supportTickets');

  return (
    <div className="p-12">
      {isLoading ? (
        <div className="flex flex-col w-full mt-5">
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : supportTickets.length === 0 ? (
        <NoData
          title="No Data Found"
          description="There is not any record yet."
          displayBtn={false}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <TertiaryHeading
              title="Customer Support"
              className="text-graphiteGray"
            />
            <div className="flex items-center gap-x-3">
              <select
                onChange={ticketStatusHandler}
                className="rounded-lg border border-Gainsboro bg-white px-3.5 py-2.5"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>

              <div className="rounded-lg border border-Gainsboro bg-white w-[356px] h-[40px] my-5 flex items-center gap-2 px-3.5 py-2.5">
                <img
                  src={'/assets/icons/search.svg'}
                  alt="search icon "
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full h-full bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            {supportTickets?.map((supportTicket: ISupportTicket, i: number) => {
              const { _id, createdAt, title, description, updatedAt, status } =
                supportTicket;
              return (
                <div
                  key={i}
                  className={
                    'shadow-primaryGlow rounded-2xl cursor-pointer flex flex-col p-4 mt-6'
                  }
                  onClick={() => {
                    if (status !== 'open') {
                      navigate(`/supporticket/${supportTicket._id}`);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Description
                        title={`Ticket # ${_id}`}
                        className="text-steelGray font-semibold"
                      />
                      {status == 'open' ? (
                        <p className="bg-lightblue rounded-xl px-2">
                          <span className="text-xs text-darkblue font-normal">
                            Open
                          </span>
                        </p>
                      ) : (
                        <p className="bg-red-600 rounded-xl px-2 pb-1">
                          <span className="text-xs text-white font-normal">
                            Closed
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Description
                        title={moment(createdAt).startOf('minute').fromNow()}
                        className="text-lightenGreyish"
                      />
                      {status == 'open' ? (
                        <Dropdown
                          menu={{
                            items,
                            onClick: (event) => {
                              const { key } = event;
                              handleDropdownItemClick(key, supportTicket);
                            },
                          }}
                          placement="bottomRight"
                        >
                          <img
                            src="/assets/icons/more-horizontal.svg"
                            width={20}
                            height={4}
                            alt="options"
                            className="cursor-pointer"
                          />
                        </Dropdown>
                      ) : null}
                    </div>
                  </div>
                  <QuinaryHeading
                    title={title}
                    className="text-base font-medium mt-3"
                  />
                  <Description
                    className="text-steelGray mt-2"
                    title={description}
                  />
                  <div className="flex items-center gap-7 mt-5">
                    <p className="text-xs text-slateGray font-normal flex gap-1">
                      <img
                        src="/assets/icons/calendar.svg"
                        alt="date"
                        width={12}
                        height={12}
                      />
                      Date: {moment(createdAt).format('ll')}
                    </p>
                    <p className="text-xs text-slateGray font-normal flex gap-1 items-center">
                      <img
                        src="/assets/icons/reply-rounded.svg"
                        alt="date"
                        width={16}
                        height={14}
                      />
                      Last reply: {moment(updatedAt).format('ll')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SupportTickets;
