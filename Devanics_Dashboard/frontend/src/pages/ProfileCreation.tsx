import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ProfileForm from "../components/ProfileForm"

const ProfileCreation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get the profile data and edit mode from navigation state
  const profileData = location.state?.profileData || null
  const isEdit = location.state?.isEdit || false

  const handleEdit = (id: string) => {
    // After successful edit, navigate back to profiles list
    navigate('/profiles')
  }

  return (
    <ProfileForm 
      initialData={profileData} 
      onEdit={handleEdit}
      isEditMode={isEdit}
    />
  )
}

export default ProfileCreation