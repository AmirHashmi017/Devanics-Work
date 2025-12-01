import TertiaryHeading from '@/app/component/headings/tertiary';
import { useUser } from '@/app/hooks/useUser';
import { authService } from '@/app/services/auth.service';
import { getLoggedInUserDetails } from '@/redux/authSlices/auth.thunk';
import { AppDispatch } from '@/redux/store';
import { Switch } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export function ChangeAutoRenewel() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useUser();

  if (!user) {
    return null;
  }

  if (!user.subscription?.subscriptionId) {
    return null;
  }

  return (
    <div className="flex space-x-3 items-center">
      <Switch
        checked={user.isAutoPayment}
        loading={isLoading}
        disabled={
          user.subscription && user.subscription.paymentMethod !== 'Stripe'
        }
        onChange={async (checked) => {
          setIsLoading(true);
          try {
            const response = await authService.httpChangeAutoRenew({
              autoRenewal: checked,
            });
            if (response.data) {
              toast.success('Auto renewal updated successfully');
              dispatch(getLoggedInUserDetails({}));
            }
          } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || 'An error occurred');
          } finally {
            setIsLoading(false);
          }
        }}
      />
      <TertiaryHeading title="Auto Renewal" />
    </div>
  );
}
