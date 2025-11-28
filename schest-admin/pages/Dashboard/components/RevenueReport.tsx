import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import SkeletonLoader from 'src/components/loader/Skeleton';
import useApiQuery from 'src/hooks/useApiQuery';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const RevenueReport = ({ reportType }: { reportType: string }) => {
  const { isLoading, data: revenueReport } = useApiQuery({
    queryKey: ['revenue-report', reportType],
    url: `analytics/${reportType}-revenue-report`,
  });

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const reportData =
    reportType === 'yearly'
      ? revenueReport?.data.map(({ month, paymentMethods }: any) => {
          const totalRevenue = paymentMethods.reduce(
            (acc: any, { totalRevenue }: any) => acc + totalRevenue,
            0
          );
          return {
            name: months[month - 1],
            uv: totalRevenue,
            details: paymentMethods.map(
              ({ paymentMethod, totalRevenue }: any) => ({
                paymentMethod,
                totalRevenue,
              })
            ),
          };
        })
      : revenueReport?.data.map(({ day, paymentMethods }: any) => {
          const totalRevenue = paymentMethods.reduce(
            (acc: any, { totalRevenue }: any) => acc + totalRevenue,
            0
          );
          return {
            name: `Day ${day}`,
            uv: totalRevenue,
            details: paymentMethods.map(
              ({ paymentMethod, totalRevenue }: any) => ({
                paymentMethod,
                totalRevenue,
              })
            ),
          };
        });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={reportData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string, props: any) => {
            const { payload } = props;
            return [
              payload.details
                ?.map(({ paymentMethod, totalRevenue }: any) => {
                  const currency = paymentMethod === 'Paymob' ? 'EGP' : 'USD';
                  return `${totalRevenue} ${currency}`;
                })
                .join(', '),
            ];
          }}
        />

        <Area
          type="monotone"
          dataKey="uv"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueReport;
