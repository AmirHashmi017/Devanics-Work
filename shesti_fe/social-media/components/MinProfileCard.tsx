// import { Edit, ExternalLink } from "lucide-react"
// import { UserOutlined } from '@ant-design/icons';
// import { Avatar } from 'antd';
import { LuExternalLink } from 'react-icons/lu';
import { TbEdit } from 'react-icons/tb';
import { useUser } from '@/app/hooks/useUser';
import ImageNext from 'next/image';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';

type MinProfileCardProps = {
  className?: string;
};
export default function MinProfileCard({ className }: MinProfileCardProps) {
  const user = useUser();
  const fullName = user?.socialName || user?.name || '';
  const userAvatar = user?.socialAvatar || user?.avatar || '/profileAvatar.png';
  const userRole = user?.userRole || '';
  const userId = user?._id;
  const router = useRouterHook();
  const profileUrl = `${Routes.SocialMedia}/profile/${userId}`;
  const editProfileUrl = `${Routes.SocialMedia}/profile/${userId}/edit`;

  const handleOpenProfile = () => {
    if (!userId) return;
    router.push(profileUrl);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    router.push(profileUrl);
  };
  const handleEditLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    router.push(editProfileUrl);
  };

  const handleViewAllRecommendations = () => {
    router.push(`${Routes.SocialMedia}/coworkers`);
  };
  return (
    <div
      className={`w-full rounded-xl overflow-hidden shadow border border-gray-100 ${className}`}
    >
      <div className="relative p-3 pb-4">
        {/* Top icons */}
        <div className="absolute right-2 top-2 flex gap-2">
          <TbEdit
            className="h-6 w-6 text-[#007ab6] cursor-pointer"
            onClick={handleEditLink}
          />
          <LuExternalLink
            className="h-6 w-6 text-[#007ab6] cursor-pointer "
            onClick={handleExternalLink}
          />
        </div>

        {/* Profile image and info */}
        <div className="mt-10 flex flex-col items-center ">
          <div
            className="relative w-12 h-12 cursor-pointer"
            onClick={handleOpenProfile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && handleOpenProfile()
            }
          >
            <ImageNext
              src={userAvatar}
              alt="Avatar"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h1
            className="mt-4 text-lg font-bold text-[#101010] whitespace-nowrap cursor-pointer"
            onClick={handleOpenProfile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && handleOpenProfile()
            }
          >
            {fullName}
          </h1>
          <p className="text-sm text-[#717171]">{userRole}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#ededed]"></div>

      {/* Divider */}
      <div className="h-px w-full bg-[#ededed]"></div>

      {/* Stats */}
      <div className="p-3 text-sm">
        {/* <div className="mt-4 flex items-center justify-between">
                    <span className="text-[#717171]">Coworkers</span>
                    <span className="text-[#007ab6] font-medium">489</span>
                </div> */}
        <div className="mt-2">
          <button
            onClick={handleViewAllRecommendations}
            className="text-[#007ab6] text-sm whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
          >
            Grow your Network
          </button>
        </div>
      </div>
    </div>
  );
}
