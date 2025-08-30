'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from 'antd';

import ProjectsReport from './components/ProjectReport';
const InvoiceReport = dynamic(() => import('./components/InvoiceReport'), {
  ssr: false,
});
const StatisticsReport = dynamic(
  () => import('./components/StatisticsReport'),
  {
    ssr: false,
  }
);
import { AdsManagement } from './components/AdsManagement';
import { TotalCost } from './components/TotalCost';
import dynamic from 'next/dynamic';
import { userService } from '@/app/services/user.service';
import { ProjectDetails } from './components/ProjectDetails';
import { withAuth } from '@/app/hoc/withAuth';
import { IDashboardStats } from '@/app/interfaces/companyInterfaces/companyClient.interface';
const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardState = useCallback(async () => {
    const statsResults = await userService.httpDashbaordStatics();
    setIsLoading(false);
    setDashboardStats(statsResults?.data);
  }, []);

  useEffect(() => {
    fetchDashboardState();
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <section className="my-4  mx-8 px-4 ">
          <TotalCost fetchDashboardState={dashboardStats} />

          <div className="grid grid-cols-12 gap-3">
            <InvoiceReport fetchDashboardState={dashboardStats} />
            <div className="col-span-5 flex flex-col space-y-8 p-3 shadow-lg border border-t bg-white rounded-md px-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[18px] text-[#344054] leading-[28px] font-semibold">
                  Projects
                </h3>
              </div>
              <div className="mx-auto w-48">
                <ProjectsReport fetchDashboardState={dashboardStats} />
              </div>
              <ProjectDetails fetchDashboardState={dashboardStats} />
            </div>
          </div>

          <div className="my-4 shadow-lg bg-white rounded-md p-4 border border-t">
            <div className="flex justify-between items-center">
              <h3 className="text-[18px] text-[#344054] leading-[28px] font-semibold">
                Statistics
              </h3>
            </div>
            <StatisticsReport fetchDashboardState={dashboardStats} />
          </div>

          <AdsManagement />
        </section>
      )}
    </>
  );
};

export default withAuth(Dashboard);
