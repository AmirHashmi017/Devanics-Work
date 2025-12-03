import {
  BsInfoCircle,
  BsGlobe,
  BsTelephone,
  BsEnvelope,
  BsBriefcase,
  BsChatSquare,
} from 'react-icons/bs';

type ProfileAboutMeProps = {
  user: {
    aboutMe?: string;
    website?: string;
    phone?: string;
    email?: string;
    organizationName?: string;
  };
};

export function ProfileAboutMe({ user }: ProfileAboutMeProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-[#e9eaf0] p-8">
      <h1 className="text-3xl font-bold text-[#1d2026] mb-6">ABOUT</h1>

      <div className="space-y-2">
        {/* About text */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
              <BsInfoCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[#1d2026] text-base">
            {user?.aboutMe || 'No about me information available.'}
          </p>
        </div>

        {/* Website */}
        {user?.website && (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                <BsGlobe className="w-5 h-5" />
              </div>
            </div>
            <a
              href={user.website}
              className="text-[#007ab6] text-base hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.website}
            </a>
          </div>
        )}

        {/* Phone */}
        {user?.phone && (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                <BsTelephone className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[#1d2026] text-base">{user.phone}</p>
          </div>
        )}

        {/* Status & Message */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
              <BsChatSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-[#1d2026] text-base">Available</p>
            <a href="#" className="text-[#007ab6] text-base hover:underline">
              Send message
            </a>
          </div>
        </div>

        {/* Email */}
        {user?.email && (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                <BsEnvelope className="w-5 h-5" />
              </div>
            </div>
            <a
              href={`mailto:${user.email}`}
              className="text-[#007ab6] text-base hover:underline break-all"
            >
              {user.email}
            </a>
          </div>
        )}

        {/* Organization */}
        {user?.organizationName && (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                <BsBriefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[#1d2026] text-base">
              Organization ·{' '}
              <span className="text-[#1d2026]">{user.organizationName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
