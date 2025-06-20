"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { addProfile } from "../redux/profileSlice"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu"
import axios from "axios"
import Sidebar from "./sidebar"
import Footer from "./footer"
import "../styles/ProfileForm.css"

interface ProfileFormProps {
  initialData?: {
    id: string
    logo: string | null
    companyName: string
    websiteLink: string
    hiresPerYear: string
    address: string
    city: string
    country: string
    zipCode: string
    phoneNumber: string
    vatNumber: string
    description: string
    sendEmails: boolean
    agreeGDPR: boolean
    status: "In Progress" | "Draft" | "Completed"
    startDate: string
  }
  onEdit?: (id: string) => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onEdit }) => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    companyName: initialData?.companyName || "",
    websiteLink: initialData?.websiteLink || "",
    hiresPerYear: initialData?.hiresPerYear || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    zipCode: initialData?.zipCode || "",
    phoneNumber: initialData?.phoneNumber || "",
    vatNumber: initialData?.vatNumber || "",
    description: initialData?.description || "",
    sendEmails: initialData?.sendEmails || false,
    agreeGDPR: initialData?.agreeGDPR || false,
    status: initialData?.status || "In Progress",
    startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    if (formData.logo) formDataToSend.append("logo", formData.logo)
    formDataToSend.append("companyName", formData.companyName)
    formDataToSend.append("websiteLink", formData.websiteLink)
    formDataToSend.append("hiresPerYear", formData.hiresPerYear)
    formDataToSend.append("address", formData.address)
    formDataToSend.append("city", formData.city)
    formDataToSend.append("country", formData.country)
    formDataToSend.append("zipCode", formData.zipCode)
    formDataToSend.append("phoneNumber", formData.phoneNumber)
    formDataToSend.append("vatNumber", formData.vatNumber)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("sendEmails", formData.sendEmails.toString())
    formDataToSend.append("agreeGDPR", formData.agreeGDPR.toString())
    formDataToSend.append("status", formData.status)
    formDataToSend.append("startDate", formData.startDate)

    try {
      const response = await axios.post("http://localhost:3001/api/profiles", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      dispatch(addProfile(response.data))
      alert("Profile saved successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, logo: file })

    // Create preview URL
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogoPreview(null)
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar and Main Content Container */}
      <div className="profile-dashboard">
        <Sidebar />

        <div className="main-content">
          {/* Header */}
          <header className="header">
            <h1 className="header__title">My Profile</h1>

            <div className="header__actions">
              <div className="header__lang">
                <span>
                  {/* FIXED: Use absolute path from public folder */}
                  <img width={70} height={40} src="/assets/language.png" alt="Language" />
                </span>
              </div>

              <button className="header__notification">
                {/* FIXED: Use absolute path from public folder */}
                <img src="/assets/Vector.png" alt="Notifications" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="header__user">
                    <div className="header__user-avatar">
                      {/* FIXED: Use absolute path from public folder */}
                      <img src="/assets/john.png" alt="John Doe" />
                    </div>
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

          {/* Content Area */}
          <div className="content-area">
            <div className="profile-section">
              {/* Profile Tabs */}
              <div className="profile-tabs">
                <div className="profile-tab">Profile Details</div>
              </div>

              {/* Profile Form */}
              <form className="profile-form" onSubmit={handleSubmit}>
                {/* FIXED: Logo Upload with Independent Layout */}
                <div className="upload-section">
                  <div className="upload-field-container">
                    <div className="upload-area-new">
                      <span className="upload-text-new">Upload company logo</span>
                      <div className="upload-folder-icon">
                        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M22 6H12L10 4H2C0.9 4 0 4.9 0 6V18C0 19.1 0.9 20 2 20H22C23.1 20 24 19.1 24 18V8C24 6.9 23.1 6 22 6Z"
                            fill="#06bf97"
                          />
                        </svg>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input-new"
                      />
                    </div>

                    
                  </div>

                  {/* Preview Area - Separate from upload field */}
                  <div className="preview-area">
                    <div className="logo-preview-circle">
                      {logoPreview ? (
                        <img src={logoPreview || "/placeholder.svg"} alt="Logo Preview" />
                      ) : (
                        <div className="preview-placeholder">
                          <img src="/assets/upload.png" alt="Upload placeholder" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="form-grid">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div></div>

                  <div className="form-group">
                    <input
                      type="url"
                      placeholder="Website Link"
                      value={formData.websiteLink}
                      onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="No. of hires/year"
                      value={formData.hiresPerYear}
                      onChange={(e) => setFormData({ ...formData, hiresPerYear: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select City</option>
                      <option value="New York">New York</option>
                      <option value="London">London</option>
                      <option value="Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Country</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter Zip code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Enter Company's Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="VAT Number"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <textarea
                    placeholder="Write description here"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                {/* Checkboxes */}
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.sendEmails}
                      onChange={(e) => setFormData({ ...formData, sendEmails: e.target.checked })}
                      className="checkbox-input"
                    />
                    <label className="checkbox-label">Send me occasional emails about CertiJob's services</label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.agreeGDPR}
                      onChange={(e) => setFormData({ ...formData, agreeGDPR: e.target.checked })}
                      className="checkbox-input"
                    />
                    <label className="checkbox-label">
                      I agree to GDPR Compliant. Lorem ipsum dolor sit amet.{" "}
                      <a href="#" className="read-more-link">
                        Read more
                      </a>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  {onEdit && initialData && (
                    <button type="button" onClick={() => onEdit(initialData.id)} className="btn btn-primary">
                      Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfileForm
