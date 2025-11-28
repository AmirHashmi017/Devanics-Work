import PrimaryHeading from 'src/components/Headings/Primary';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { fetchAdminSupportTicketStats } from 'src/redux/supportTicketsSlice/supportTicketSlice';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { AppDispatch } from 'src/redux/store';
import { fetchAdminCompanyUsers } from 'src/redux/usersSlice/user.thunk';
import useApiQuery from 'src/hooks/useApiQuery';
import SkeletonLoader from 'src/components/loader/Skeleton';

const Stats = () => {
  const [supportTickets, setSupportTickets] = useState('0');
  const [companies, setCompanies] = useState('0');
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  const { isLoading, data: revenueData } = useApiQuery({
    queryKey: ['support-tickets'],
    url: '/analytics/revenue',
  });
  const { isLoading: isLoadingUsers, data: usersData } = useApiQuery({
    queryKey: ['total-users'],
    url: '/analytics/users',
  });
  const { isLoading: IsLoadingTickets, data: ticketsData } = useApiQuery({
    queryKey: ['tickets'],
    url: '/analytics/tickets',
  });
  const { isLoading: isLoadingMonthRevenue, data: monthlyRevenue } =
    useApiQuery({
      queryKey: ['last-month-revenue'],
      url: '/analytics/revenue-last-month',
    });

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const supportsTicketStats = async () => {
    const {
      payload: { statusCode, data },
    }: any = await dispatch(fetchAdminSupportTicketStats());
    if (statusCode === 200) {
      setSupportTickets(data.total);
    }

    const {
      payload: { statusCode: status, data: companyData },
    }: any = await dispatch(fetchAdminCompanyUsers('Company'));
    if (status === 200) {
      setCompanies(companyData.companies);
    }
  };

  if (
    isLoading ||
    isLoadingUsers ||
    IsLoadingTickets ||
    isLoadingMonthRevenue
  ) {
    return <SkeletonLoader />;
  }

  console.log(usersData, 'users', ticketsData, 'ticket');
  const statsData = [
    {
      title: 'Total Revenue',
      count: '$' + revenueData?.data || 0,
    },
    {
      title: 'Total Companies',
      count: usersData?.data || 0,
    },
    {
      title: 'Active Tickets',
      count: ticketsData?.data || 0,
    },
    {
      title: 'Last Month Revenue',
      count: '$' + monthlyRevenue?.data || 0,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {statsData.map(({ title, count }, i) => (
        <div
          className="flex justify-between items-center rounded-xl shadow-primaryGlow p-5"
          key={i}
        >
          <div className="col-span-1">
            <PrimaryHeading title={count} className="text-goldenrodYellow" />
            <TertiaryHeading className="mt-1" title={`${title}`} />
          </div>
          <span>
            <img
              src="/assets/icons/logo.svg"
              alt="revenue"
              className="bg-grayishBlue bg-opacity-10 p-3 rounded-xl h-12 w-12"
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stats;
