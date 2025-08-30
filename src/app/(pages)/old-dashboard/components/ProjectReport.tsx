import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { IDashboardStats } from '@/app/interfaces/companyInterfaces/companyClient.interface';
ChartJS.register(ArcElement, Tooltip, Legend);
const LABELS = [
  'Takeoff',
  'Estimate Project',
  'Invoices ',
  'Scheduled Project',
  'Meeting',
];

const COLORS = ['#001556', '#7F56D9', '#36B37E', '#EF9F28', '#B58905'];
type Props = {
  fetchDashboardState: IDashboardStats | undefined;
};
export default function ProjectsReport({ fetchDashboardState }: Props) {
  const VALUES = [
    fetchDashboardState?.totalTakeoff,
    fetchDashboardState?.totalGeneratedEstimates,
    fetchDashboardState?.totalInvoices,
    fetchDashboardState?.totalSchedules,
    fetchDashboardState?.totalMeetings,
  ];

  return (
    <Doughnut
      data={{
        labels: LABELS,
        datasets: [{ data: VALUES, backgroundColor: COLORS }],
      }}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
