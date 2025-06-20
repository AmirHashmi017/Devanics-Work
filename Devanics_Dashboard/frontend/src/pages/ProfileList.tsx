"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "../redux/store"
import ProfileTable from "../components/ProfileTable"

const ProfileListPage: React.FC = () => {
  const handleEdit = (profile: any) => {
    // Logic to load and edit profile
    console.log(`Edit profile:`, profile)
  }

  return (
    <Provider store={store}>
      <ProfileTable onEdit={handleEdit} />
    </Provider>
  )
}

export default ProfileListPage
