'use client';

import { useEffect } from 'react';
import { useRouterHook } from '../hooks/useRouterHook';

export function NotAuthorized() {
  const router = useRouterHook();

  useEffect(() => {
    router.push('/login');
  }, []);

  return <></>;
}
