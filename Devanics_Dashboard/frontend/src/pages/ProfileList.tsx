import React from 'react';
import ProfileTable from '../components/ProfileTable';

const ProfileList: React.FC = () => {
  const handleEdit = (profile: any) => {
    // Logic to load and edit profile
    console.log(`Edit profile:`, profile);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', padding: '20px' }}>
      <h1>Profiles</h1>
      <ProfileTable onEdit={handleEdit} />
    </div>
  );
};

export default ProfileList;