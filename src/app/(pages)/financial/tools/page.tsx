'use client';
import React from 'react';
import { FinancialStatus } from './components/FinancialStatus';
import { TargetStats } from './components/TargetStats';
import { withAuth } from '@/app/hoc/withAuth';
import { FinancialToolsHeader } from './components/Header';
import { TargetChart } from './components/TargetChart';
import { AssetChart } from './components/AssetChart';
import { ExpenseChart } from './components/ExpenseChart';
import { handleDownloadPdfFromRefAsync } from '@/app/utils/downloadFile';
import { toast } from 'react-toastify';
import { ClientInvoiceHeader } from '../aia-invoicing/components/ClientInvoiceHeader';
import { ClientInvoiceFooter } from '../aia-invoicing/components/ClientInvoiceFooter';

const Finance = () => {
  const [downloading, setDownloading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <section className="my-4  mx-8 py-4 ">
      <FinancialToolsHeader
        isDownloading={downloading}
        onDownload={async () => {
          setDownloading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await handleDownloadPdfFromRefAsync(ref, 'financial-tools');
          } catch (error) {
            toast.error('Failed to download. Please try again.');
          } finally {
            setDownloading(false);
          }
        }}
      />

      <div ref={ref} className="space-y-7 mt-4">
        {downloading ? <ClientInvoiceHeader /> : null}
        <div className="grid grid-cols-12 gap-8">
          <FinancialStatus />
          <TargetStats />
        </div>

        <TargetChart />

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-5">
            <AssetChart />
          </div>

          <div className="col-span-7">
            <ExpenseChart />
          </div>
        </div>
        {downloading ? <ClientInvoiceFooter /> : null}
      </div>
    </section>
  );
};

export default withAuth(Finance);
