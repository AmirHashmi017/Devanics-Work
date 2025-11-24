'use client';

import { withAuth } from '@/app/hoc/withAuth';
import Plans from '../settings/plans/plans';

const UpgrdePlan = () => {
  return (
    <div className="flex flex-col my-10 pb-10 mx-24 justify-center flex-wrap">
      <Plans />
    </div>
  );
};

export default withAuth(UpgrdePlan);
