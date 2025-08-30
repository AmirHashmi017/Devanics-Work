import React from 'react';
import { IDashboardStats } from '@/app/interfaces/companyInterfaces/companyClient.interface';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Props = {
  fetchDashboardState: IDashboardStats | undefined;
};

function StatisticsReport({ fetchDashboardState }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: 'TakeOff',
        data: fetchDashboardState?.monthlyTakeOffTotalRecords,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Estimate',
        data: fetchDashboardState?.monthlyEstimateTotalRecords,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Schedule',
        data: fetchDashboardState?.monthlyScheduleTotalRecords,
        borderColor: 'rgb(53, 235, 144)',
        backgroundColor: 'rgba(53, 235, 93, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default StatisticsReport;
