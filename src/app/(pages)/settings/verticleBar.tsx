import React, { ReactNode } from 'react';
import VerticalsTabs from './components/verticalsTabs/index';

interface Props {
  children?: ReactNode;
}

import CustomNavbar from '@/app/component/customNavbar';
import { withAuth } from '@/app/hoc/withAuth';

const SettingSidebar = ({ children }: Props) => {
  return (
    <CustomNavbar>
      <section className="px-8 pt-6 flex gap-2 items-start relative ">
        <VerticalsTabs />
        {children}
      </section>
    </CustomNavbar>
  );
};

export default withAuth(SettingSidebar);
