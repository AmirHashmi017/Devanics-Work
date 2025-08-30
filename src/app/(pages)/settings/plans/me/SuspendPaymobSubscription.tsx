import CustomButton from '@/app/component/customButton/button';
import { authService } from '@/app/services/auth.service';
import { getLoggedInUserDetails } from '@/redux/authSlices/auth.thunk';
import { AppDispatch } from '@/redux/store';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export function SuspendPaymobSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  async function suspendSubscription() {
    setIsLoading(true);
    try {
      const response = await authService.httpSuspendPaymobSubscription();
      if (response.data) {
        toast.success('Subscription canceled successfully');
        dispatch(getLoggedInUserDetails({}));
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CustomButton
      text="Cancel Subscription"
      className="!w-fit"
      isLoading={isLoading}
      onClick={suspendSubscription}
    />
  );
}
