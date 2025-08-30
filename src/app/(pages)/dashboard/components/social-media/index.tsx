import { FaComments } from 'react-icons/fa';
import { IoIosFlash } from 'react-icons/io';
import { FaThumbsUp } from 'react-icons/fa6';
import { SocialAnalyticsCard } from './SocialAnalyticsCard';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  getUserDashboardSocialMediaCommentsThunk,
  getUserDashboardSocialMediaLikesThunk,
  getUserDashboardSocialMediaSharesThunk,
} from '@/redux/user-dashboard/user-dashboard.thunk';
import { getRangeFromDateString } from '@/app/utils/date.utils';

export function DashboardSocialMediaAnalytics() {
  const { comments, likes, shares } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const lastMonth = getRangeFromDateString('lastMonth');

    dispatch(getUserDashboardSocialMediaCommentsThunk(lastMonth));
    dispatch(getUserDashboardSocialMediaLikesThunk(lastMonth));
    dispatch(getUserDashboardSocialMediaSharesThunk(lastMonth));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Comments */}
      <SocialAnalyticsCard
        Icon={FaComments}
        analytics={comments.data.analytics}
        color="#F1D303"
        title="Comments"
        value={comments.data.value}
        description="Here are comments."
        selectProps={{
          allowClear: true,
          onChange(value) {
            const result = getRangeFromDateString(value);
            dispatch(getUserDashboardSocialMediaCommentsThunk(result));
          },
        }}
        loading={comments.loading}
      />
      {/*   Shares */}
      <SocialAnalyticsCard
        Icon={IoIosFlash}
        analytics={shares.data.analytics}
        color="#2ba6ff"
        title="Shares"
        value={shares.data.value}
        description="Here are shares."
        selectProps={{
          allowClear: true,
          onChange(value) {
            const result = getRangeFromDateString(value);
            dispatch(getUserDashboardSocialMediaSharesThunk(result));
          },
        }}
        loading={shares.loading}
      />
      {/*   Likes */}
      <SocialAnalyticsCard
        Icon={FaThumbsUp}
        analytics={likes.data.analytics}
        color="#FB4C61"
        title="Likes"
        value={likes.data.value}
        description="Here are likes."
        selectProps={{
          allowClear: true,
          onChange(value) {
            const result = getRangeFromDateString(value);
            dispatch(getUserDashboardSocialMediaLikesThunk(result));
          },
        }}
        loading={likes.loading}
      />
    </div>
  );
}
