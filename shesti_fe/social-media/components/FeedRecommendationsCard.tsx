import { LuInfo, LuPlus, LuArrowRight, LuUserCheck } from 'react-icons/lu';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar, Spin } from 'antd';
import { networkingService } from '@/app/services/networking.service';
import { useUser } from '@/app/hooks/useUser';
import { useState, useEffect } from 'react';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
// import ImageNext from 'next/image';

interface User {
  _id: string;
  name: string;
  userRole: string;
  socialAvatar?: string;
  avatar?: string;
}

interface FollowingState {
  [userId: string]: boolean;
}

export default function FeedRecommendationsCard() {
  const user = useUser();
  const router = useRouterHook();
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState<FollowingState>({});
  const [followingStatus, setFollowingStatus] = useState<FollowingState>({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.userRole) return;

      setLoading(true);
      try {
        const response = await networkingService.httpGetSchestiUsers({
          userRole: user.userRole,
          searchText: '',
          locationText: '',
          page: 0,
          limit: 3,
          selectedTrades: '',
          selectedStates: '',
        });

        if (response && response.data) {
          // The API returns users in response.data.users
          const users = response.data.users || [];
          setRecommendations(users);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.userRole]);

  const handleFollow = async (userId: string) => {
    try {
      setFollowingLoading((prev) => ({ ...prev, [userId]: true }));

      if (followingStatus[userId]) {
        // Unfollow
        await networkingService.httpRemoveFriend(userId);
        setFollowingStatus((prev) => ({ ...prev, [userId]: false }));

        // Fetch new recommendation to replace the unfollowed user
        const response = await networkingService.httpGetSchestiUsers({
          userRole: user ? user.userRole : '',
          searchText: '',
          locationText: '',
          page: 0,
          limit: 3,
          selectedTrades: '',
          selectedStates: '',
        });

        if (
          response &&
          response.data &&
          response.data.users &&
          response.data.users.length > 0
        ) {
          const users = response.data.users || [];
          setRecommendations(users);
        }
      } else {
        // Follow
        await networkingService.httpAddFriend(userId);
        setFollowingStatus((prev) => ({ ...prev, [userId]: true }));

        const response = await networkingService.httpGetSchestiUsers({
          userRole: user ? user.userRole : '',
          searchText: '',
          locationText: '',
          page: 0,
          limit: 3,
          selectedTrades: '',
          selectedStates: '',
        });

        if (
          response &&
          response.data &&
          response.data.users &&
          response.data.users.length > 0
        ) {
          const users = response.data.users || [];

          setTimeout(() => {
            setRecommendations(users);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setFollowingLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };
  const handleViewAllRecommendations = () => {
    router.push(`${Routes.SocialMedia}/coworkers`);
  };

  return (
    <div className="w-full border rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#101010]">Add to your feed</h2>
        <div className="rounded-full p-1 text-[#717171] hover:bg-gray-100">
          <LuInfo size={20} />
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 animate-pulse"
            >
              <div className="w-[55px] h-[55px] bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))
        ) : Array.isArray(recommendations) && recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <div
              key={recommendation._id}
              className="flex items-start space-x-3"
            >
              <Avatar
                size={55}
                src={
                  (recommendation.socialAvatar ||
                    recommendation.avatar ||
                    undefined) as string | undefined
                }
                icon={
                  !(recommendation.socialAvatar || recommendation.avatar) ? (
                    <UserOutlined />
                  ) : undefined
                }
              />
              {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-[#00496d] relative">
                             <ImageNext
                                      src={recommendation.socialAvatar || recommendation.avatar||""}
                                      alt={`Avatar`}
                                      fill
                                      className="object-cover"
                                    />
                                    </div> */}
              <div className="flex-1">
                <h5 className="font-bold text-base text-[#101010]">
                  {recommendation.name}
                </h5>
                <p className="text-xs text-[#717171]">
                  {recommendation.userRole}
                </p>
                <button
                  onClick={() => handleFollow(recommendation._id)}
                  disabled={followingLoading[recommendation._id]}
                  className={`mt-2 w-fit flex items-center justify-center rounded-full border px-6 py-2 transition-colors ${
                    followingStatus[recommendation._id]
                      ? 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'
                      : 'border-[#007ab6] text-[#007ab6] hover:bg-[#007ab6]/5'
                  }`}
                >
                  {followingLoading[recommendation._id] ? (
                    <Spin
                      size="small"
                      spinning
                      indicator={<LoadingOutlined spin />}
                    />
                  ) : (
                    <>
                      {followingStatus[recommendation._id] ? (
                        <LuUserCheck size={16} className="mr-1" />
                      ) : (
                        <LuPlus size={16} className="mr-1" />
                      )}
                      <span>
                        {followingStatus[recommendation._id]
                          ? 'Following'
                          : 'Follow'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No recommendations available
          </div>
        )}
      </div>

      <button
        onClick={handleViewAllRecommendations}
        className="mt-6 inline-flex items-center justify-start gap-2 text-left text-[#101010] hover:text-[#007ab6] cursor-pointer transition-colors bg-white whitespace-nowrap"
      >
        <span className="text-base font-medium whitespace-nowrap">
          View all recommendations
        </span>
        <LuArrowRight size={20} />
      </button>
    </div>
  );
}
