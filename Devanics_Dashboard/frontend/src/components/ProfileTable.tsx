"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateProfile, deleteProfile, archiveProfile, fetchProfilesAsync } from "../redux/profileSlice"
import type { RootState, AppDispatch } from "../redux/store"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { Card, CardContent } from "./Card"
import { Input } from "./Input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import Sidebar from './sidebar';
import Footer from './footer';
import "../styles/Components.css"
import "../styles/dashboard.css"

interface ProfileTableProps {
  onEdit: (profile: any) => void
}

export default function ProfileTable({ onEdit }: ProfileTableProps) {
  const dispatch: AppDispatch = useDispatch()
  const profiles = useSelector((state: RootState) => state.profiles)
  const [refresh, setRefresh] = useState(false)
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProfilesAsync()).then(() => {
      console.log("Fetched profiles:", profiles)
      setRefresh((prev) => !prev)
    })
  }, [dispatch])

  const handleStatusChange = (id: string, status: string) => {
    const validStatus = status as "In Progress" | "Draft" | "Completed"
    if (["In Progress", "Draft", "Completed"].includes(status)) {
      dispatch(updateProfile({ id, changes: { status: validStatus } }))
      axios.put(`http://localhost:3001/api/profiles/${id}`, { status: validStatus })
    }
  }

  const handleArchive = (id: string) => {
    const profile = profiles.find((p) => p.id === id)
    if (profile) {
      dispatch(archiveProfile(id))
      axios.put(`http://localhost:3001/api/profiles/${id}`, { archived: !profile.archived })
    }
  }

  const handleDelete = (id: string) => {
    dispatch(deleteProfile(id))
    axios.delete(`http://localhost:3001/api/profiles/${id}`)
  }

  const handleEdit = (profile: any) => {
    // Navigate to profile creation page with the profile data
    navigate('/profile/create', { state: { profileData: profile, isEdit: true } });
  }

  const filteredProfiles = profiles.filter((profile) => {
    const matchesTab = activeTab === "active" ? !profile.archived : profile.archived
    const matchesSearch =
      profile.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + itemsPerPage)

  const getStatusClass = (status: string) => {
    switch (status) {
      case "In Progress":
        return "status-badge--progress"
      case "Draft":
        return "status-badge--draft"
      case "Completed":
        return "status-badge--completed"
      default:
        return "status-badge--progress"
    }
  }

  const handleCreateClick = () => {
    navigate('/profile/create');
  };

  return (
    <div className="dashboard">
      
      <Sidebar />

      <div className="main-content">
 
        <header className="header">
          <h1 className="header__title">Profiles</h1>

          <div className="header__actions">
            <div className="header__lang">
              <span><img width={70} height={40} src="../assets/language.png"></img></span>
              
            </div>

            <button className="header__notification"><img src="../assets/Vector.png"></img></button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="header__user">
                  <div className="header__user-avatar"><img src="../assets/john.png"></img></div>
                  <span className="header__user-name">John Doe</span>
                  <span className="header__user-dropdown">▼</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="content">
          <div className="content__header">
            <div className="content__tabs">
              <button
                onClick={() => {
                  setActiveTab("active")
                  setCurrentPage(1)
                }}
                className={`content__tab ${activeTab === "active" ? "content__tab--active" : ""}`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setActiveTab("archive")
                  setCurrentPage(1)
                }}
                className={`content__tab ${activeTab === "archive" ? "content__tab--active" : ""}`}
              >
                Archive
              </button>
            </div>

            <div className="content__controls">
              <button className="create-btn" onClick={handleCreateClick}>Create Profile</button>
            </div>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>No. of hires/year</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProfiles.length > 0 ? (
                    paginatedProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="table__cell--id">RID-{profile.id.slice(-3)}</TableCell>
                        <TableCell>
                          <div className="company-info">
                            <span className="company-name">{profile.companyName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{profile.hiresPerYear}</TableCell>
                        <TableCell>{new Date(profile.startDate).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className={`status-badge ${getStatusClass(profile.status)}`}>
                                {profile.status}
                                <span>▼</span>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleStatusChange(profile.id, "In Progress")}>
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(profile.id, "Draft")}>
                                Draft
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(profile.id, "Completed")}>
                                Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <div className="action-buttons">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <button className="action-btn action-btn--more" title="More actions">
                                  <img src="assets/archive.png"></img>
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleArchive(profile.id)}>
                                  {profile.archived ? "Unarchive" : "Archive"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <button
                              className="action-btn action-btn--delete"
                              onClick={() => handleDelete(profile.id)}
                              title="Delete"
                            >
                              <img src="assets/Delete.png"></img>
                            </button>
                            <button
                              className="action-btn action-btn--edit"
                              onClick={() => handleEdit(profile)}
                              title="Edit"
                            >
                              <img src="assets/Edit.png"></img>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-state__icon">📋</div>
                          <div className="empty-state__title">No profiles available</div>
                          <div className="empty-state__description">
                            {searchTerm
                              ? "Try adjusting your search terms"
                              : "Create your first profile to get started"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredProfiles.length > 0 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <span className="pagination__info">
                {currentPage} of {totalPages}
              </span>
              <button
                className="pagination__btn"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>

        <Footer/>
      </div>
    </div>
  )
}