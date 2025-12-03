'use client';
import { withAuth } from '@/app/hoc/withAuth';
// import { CommunityLayout } from '../../components/CommunityLayout';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileAboutMe } from './components/ProfileAboutMe';
import { ProfileWorkExperience } from './components/ProfileWorkExperience';
import { ProfileEducation } from './components/ProfileEducation';
import { ProfileSkills } from './components/ProfileSkills';
import { ProfileCertifications } from './components/ProfileCertifications';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserPostListing from '../../components/userPostListing';
import { userService } from '@/app/services/user.service';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import { Breadcrumb, Spin } from 'antd';

function ProfilePage() {
  const { id } = useParams();
  const router = useRouterHook();
  const userId = String(id || '');
  const [refetchPosts, setRefetchPosts] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await userService.httpGetCompanyInfo(userId);
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" style={{ color: '#007ab6' }} />
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div className="p-6">No user data found</div>;
  }
  return (
    <>
      <div className="space-y-6">
        <nav className="mt-8 ml-6 mb-6 text-sm">
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    className="!text-[#007ab6] hover:underline cursor-pointer"
                    onClick={() => router.push(`${Routes.SocialMedia}`)}
                  >
                    Community
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-[#1d2026] font-medium">Profile</span>
                ),
              },
            ]}
          />
        </nav>
        <ProfileInfo user={userData} />

        <div className="grid grid-cols-12 gap-5 mx-auto-6">
          <div className="col-span-4 space-y-4">
            <ProfileAboutMe user={userData} />
            <ProfileWorkExperience user={userData} />
            <ProfileEducation user={userData} />
            <ProfileSkills user={userData} />
            <ProfileCertifications user={userData} />
          </div>
          <div className="col-span-8 space-y-4">
            <UserPostListing
              userId={userId}
              fetchPosts={refetchPosts}
              onPostDeleted={() => setRefetchPosts((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ProfilePage);
