import { useUser } from './useUser';

export function useUserSubscription() {
  const user = useUser();
  return {
    userSubscription: user?.subscription,
    isTrialing: user?.subscription?.status === 'trialing',
    isActive: user?.subscription?.status === 'active',
    paymentMethod: user?.subscription?.paymentMethod,
    isSuspended: () => !!user?.subscription?.isSuspended,
  };
}
