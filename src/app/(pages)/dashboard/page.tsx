'use client';
import { withAuth } from '@/app/hoc/withAuth';
import { DashboardHeader } from './components/Header';
import { DashboardConstruction } from './components/construction';
import { ProjectManagementChart } from './components/ProjectManagementChart';
import { DashboardDailyManagement } from './components/daily-management';
import { DashboardBidManagement } from './components/bid-management';
import { DashboardFinancialManagement } from './components/financial-management';
import { DashboardSocialMediaAnalytics } from './components/social-media';
import { DashboardRelationshipManagement } from './components/relationship-management';
import { DashboardEstimateReports } from './components/estimate-reports';
import React, { useRef, useState } from 'react';
import { AdManagement } from '@/app/component/ad-management';
import { handleDownloadPdfFromRefAsync } from '@/app/utils/downloadFile';
import { toast } from 'react-toastify';
import { robotoFont } from '@/app/component/fonts';
import { ClientInvoiceHeader } from '../financial/aia-invoicing/components/ClientInvoiceHeader';
import { ClientInvoiceFooter } from '../financial/aia-invoicing/components/ClientInvoiceFooter';
import { ErrorBoundary } from '@/app/component/error-boundary';

function NewDashboardPage() {
  const [isDownloadingInPdf, setIsDownloadingInPdf] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    setIsDownloadingInPdf(true);

    // wait 2 seconds

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      handleDownloadPdfFromRefAsync(ref, 'dashboard', false, false).then(
        (pdf) => {
          pdf.save('dashboard.pdf');
        }
      );
    } catch (error) {
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsDownloadingInPdf(false);
    }
  }

  return (
    <div
      style={robotoFont.style}
      className={`p-5 m-3  ${isDownloadingInPdf ? 'bg-white' : ''}`}
    >
      <DashboardHeader
        isDownloading={isDownloadingInPdf}
        onDownload={handleDownload}
      />

      <div ref={ref} className={` space-y-5 mt-5`}>
        {isDownloadingInPdf ? <ClientInvoiceHeader /> : null}
        <div className="grid grid-cols-12 gap-3 items-stretch">
          <div className="col-span-9">
            <ErrorBoundary>
              <DashboardConstruction />
            </ErrorBoundary>
          </div>

          <div className="col-span-3">
            <ErrorBoundary>
              <ProjectManagementChart />
            </ErrorBoundary>
          </div>
        </div>
        {!isDownloadingInPdf && <AdManagement />}
        <div className="grid grid-cols-2 gap-4">
          <DashboardDailyManagement />

          <div className="space-y-3 h-full">
            <DashboardBidManagement />
            <DashboardFinancialManagement />
          </div>
        </div>

        <DashboardSocialMediaAnalytics />

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <DashboardRelationshipManagement />
          </div>

          <div className="col-span-6">
            <ErrorBoundary>
              <DashboardEstimateReports />
            </ErrorBoundary>
          </div>
        </div>

        {isDownloadingInPdf ? <ClientInvoiceFooter /> : null}
      </div>
    </div>
  );
}

export default withAuth(NewDashboardPage);
