import React from 'react';
import ProfileForm from '../components/ProfileForm';

const ProfileCreation: React.FC = () => {
  const handleEdit = (id: string) => {
    // Logic to load and edit profile
    console.log(`Edit profile with id: ${id}`);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', padding: '20px' }}>
      <h1>My Profile</h1>
      <ProfileForm onEdit={handleEdit} />
    </div>
  );
};

export default ProfileCreation;