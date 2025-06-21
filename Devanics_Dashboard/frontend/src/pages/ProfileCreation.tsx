import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ProfileForm from "../components/ProfileForm"

const ProfileCreation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const profileData = location.state?.profileData || null
  const isEdit = location.state?.isEdit || false

  const handleEdit = (id: string) => {
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