'use client';
import { useUser } from '@/app/hooks/useUser';
import SettingSideBar from '../verticleBar';
import { withAuth } from '@/app/hoc/withAuth';
import { OwnerGeneralSettingsForm } from './components/OwnerForm';
import { CommonGeneralSettingsForm } from './components/CommonForm';
import { EducationGeneralSettingsForm } from './components/EducationForm';

const GeneralSetting = () => {
  const user = useUser();

  if (user && user.userRole === 'owner') {
    return (
      <SettingSideBar>
        <OwnerGeneralSettingsForm />
      </SettingSideBar>
    );
  }

  if (user && (user.userRole === 'professor' || user.userRole === 'student')) {
    return (
      <SettingSideBar>
        <EducationGeneralSettingsForm />
      </SettingSideBar>
    );
  }

  return (
    <SettingSideBar>
      <CommonGeneralSettingsForm />
    </SettingSideBar>
  );
};

export default withAuth(GeneralSetting);
