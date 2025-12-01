import { IUserInterface } from '@/app/interfaces/user.interface';
import { Alert } from 'antd';

export function SubscriptionExpiredAlert({ user }: { user?: IUserInterface }) {
  if (user) {
    if (!user.subscription) {
      return null;
    } else if (
      user.subscription.status === 'trialing' ||
      user.subscription.status === 'active'
    ) {
      return null;
    } else {
      return (
        <Alert
          message="Subscription Expired"
          description="Your subscription has been expired. Please renew your subscription to continue using our services."
          type="error"
          showIcon
        />
      );
    }
  } else {
    return null;
  }
}
