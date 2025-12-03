import {
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa';
import { TbBrandWhatsapp } from 'react-icons/tb';
import { FaLinkedin } from 'react-icons/fa6';
// import { Avatar } from "antd";
// import { UserOutlined } from "@ant-design/icons";
import ImageNext from 'next/image';
import { useUser } from '@/app/hooks/useUser';
import { TbEdit } from 'react-icons/tb';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';

type ProfileInfoProps = {
  user: {
    _id: string;
    name?: string;
    socialName?: string;
    tagLine?: string;
    website?: string;
    avatar?: string;
    socialAvatar?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
      whatsapp?: string;
      youtube?: string;
    };
    // add more fields based on your API response
  };
};

export function ProfileInfo({ user }: ProfileInfoProps) {
  const userlogin = useUser();
  const canEdit = userlogin?._id === user._id;
  const links = user.socialLinks || {};
  const router = useRouterHook();
  const editProfileUrl = `${Routes.SocialMedia}/profile/${user._id}/edit`;

  const handleEditProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user._id) return;
    router.push(editProfileUrl);
  };
  return (
    <div className="max-w-6xl mx-auto p-6 border rounded-lg shadow">
      <div className="w-full border-gray-200 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Image */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden">
            {/* <Avatar
                            src={user?.socialAvatar || user?.avatar}
                            icon={<UserOutlined />}
                            size={128}
                        /> */}
            <ImageNext
              src={user?.socialAvatar || user?.avatar || ''}
              alt={`Avatar`}
              fill
              className="object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#1d2026]">
                {user?.socialName || user?.name || 'User Name'}
              </h1>
              {/* <div className="flex items-center bg-[#e6f2f8] px-3 py-1 rounded-md">
                                <FaCrown className="w-4 h-4 text-[#007ab6] mr-2" />
                                <span className="text-[#007ab6] font-medium">Top Rated</span>
                            </div> */}
            </div>

            <p className="text-[#6e7485] text-lg mb-4">
              {user?.tagLine || 'Professional'}
            </p>

            {/* <div className="flex flex-wrap gap-6 mb-2">
                            <div className="flex items-center">
                                <FaStar className="w-5 h-5 text-[#007ab6] mr-2" fill="#007ab6" />
                                <span className="font-bold text-[#1d2026] mr-1">4.8</span>
                                <span className="text-[#6e7485]">(134,633 review)</span>
                            </div>

                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-[#007ab6] mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                        fill="#007ab6"
                                    />
                                    <path
                                        d="M12 14.5C6.99 14.5 3 17.86 3 22C3 22.28 3.22 22.5 3.5 22.5H20.5C20.78 22.5 21 22.28 21 22C21 17.86 17.01 14.5 12 14.5Z"
                                        fill="#007ab6"
                                    />
                                </svg>
                                <span className="font-bold text-[#1d2026] mr-1">430,117</span>
                                <span className="text-[#6e7485]">Coworkers</span>
                            </div>

                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-[#007ab6] mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22 10V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V10C3.11 10 4 10.9 4 12C4 13.1 3.11 14 2 14V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V14C20.9 14 20 13.1 20 12C20 10.9 20.9 10 22 10ZM20 8.54C18.81 9.23 18 10.53 18 12C18 13.47 18.81 14.77 20 15.46V18H4V15.46C5.19 14.77 6 13.47 6 12C6 10.52 5.2 9.23 4 8.54V6H20V8.54ZM11 15H13V17H11V15ZM11 11H13V13H11V11ZM11 7H13V9H11V7Z"
                                        fill="#007ab6"
                                    />
                                </svg>
                                <span className="font-bold text-[#1d2026] mr-1">7</span>
                                <span className="text-[#6e7485]">Certifications</span>
                            </div>
                        </div> */}
          </div>

          {/* Website & Social Links */}
          <div className="flex flex-col items-end gap-4 -mt-4">
            {canEdit && (
              <div className="flex justify-end">
                <TbEdit
                  className="h-6 w-6 text-[#007ab6] cursor-pointer hover:text-[#005a8a] transition-colors"
                  onClick={handleEditProfile}
                  title="Edit Profile"
                />
              </div>
            )}
            {user?.website && (
              <div className="flex items-center">
                <FaGlobe className="w-5 h-5 text-[#007ab6] mr-2" />
                <a
                  href={user.website}
                  className="text-[#007ab6] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              </div>
            )}
            {/* Website & Social Links */}
            <div className="flex gap-4">
              {links.facebook && (
                <a
                  href={links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e5566] hover:text-[#007ab6] transition-colors"
                  title="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
              )}

              {links.twitter && (
                <a
                  href={links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e5566] hover:text-[#007ab6] transition-colors"
                  title="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}

              {links.instagram && ( // Fixed typo here too
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e5566] hover:text-[#007ab6] transition-colors"
                  title="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}

              {links.youtube && (
                <a
                  href={links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e5566] hover:text-[#007ab6] transition-colors"
                  title="YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              )}

              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e5566] hover:text-[#007ab6] transition-colors"
                  title="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}

              {links.whatsapp && (
                <a
                  href={`https://wa.me/${links.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e5566] hover:text-[#007ab6] transition-colors"
                  title="WhatsApp"
                >
                  <TbBrandWhatsapp className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
