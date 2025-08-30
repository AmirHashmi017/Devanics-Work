'use client';

import React from 'react';
import Navbar from '../component/navbar/minnavbar';
import Tabs from '../component/tabs';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};
const CustomNavbar = ({ children }: Props) => {
  const pathname = usePathname();

  const unProtectedRoutes = [
    'checkmail',
    'checkmail',
    'companydetails',
    'congratulation',
    'forgetpassword',
    'login',
    'payment',
    'plans',
    'register',
    'sendcode',
    'setnewpassword',
    'settings',
    'trades',
    'verification',
  ];
  return (
    <>
      {!unProtectedRoutes.includes(pathname.split('/')[1]) && (
        <>
          <Navbar />
          <Tabs />
        </>
      )}
      {children}
    </>
  );
};

export default CustomNavbar;
