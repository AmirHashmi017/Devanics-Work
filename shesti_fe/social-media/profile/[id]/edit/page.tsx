'use client';
import { withAuth } from '@/app/hoc/withAuth';
// import { CommunityLayout } from "../../../components/CommunityLayout";
import { ProfileForm } from '../components/ProfileForm';

function EditProfilePage() {
  return (
    <>
      <ProfileForm />
    </>
  );
}

export default withAuth(EditProfilePage);
