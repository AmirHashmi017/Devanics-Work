'use client';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const NotLoggedIn = () => {
  const router = useRouterHook();
  const paths = usePathname();

  useEffect(() => {
    const arr = ['/login'];
    if (!arr.includes(paths)) {
      router.push('/login');
    }
  }, []);
  return <></>;
};

export default NotLoggedIn;
