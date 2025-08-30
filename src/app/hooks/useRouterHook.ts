import { useRouter } from 'next-nprogress-bar';

export function useRouterHook() {
  const router = useRouter();
  return router;
}
