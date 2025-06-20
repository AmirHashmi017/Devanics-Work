import type React from "react"
import ProfileForm from "../components/ProfileForm"

const ProfileCreation: React.FC = () => {
  const handleEdit = (id: string) => {
    // Logic to load and edit profile
    console.log(`Edit profile with id: ${id}`)
  }

  return <ProfileForm onEdit={handleEdit} />
}

export default ProfileCreation
