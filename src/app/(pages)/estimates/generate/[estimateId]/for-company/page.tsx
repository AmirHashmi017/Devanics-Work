'use client';

import { withAuth } from '@/app/hoc/withAuth';
import { GeneratedEstimateForClientAndCompany } from '../components/EstimateForClientAndCompany';

function GeneratedEstimateForCompanyPage() {
  return (
    <div>
      <GeneratedEstimateForClientAndCompany />
    </div>
  );
}

export default withAuth(GeneratedEstimateForCompanyPage);
