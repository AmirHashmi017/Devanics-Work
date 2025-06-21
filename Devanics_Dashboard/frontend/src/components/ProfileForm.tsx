"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { addProfile, updateProfile } from "../redux/profileSlice"
import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu"
import axios from "axios"
import Sidebar from "./sidebar"
import Footer from "./footer"
import Slider from "./Slider"
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
  isEditMode?: boolean
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onEdit, isEditMode = false }) => {
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
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSlider, setShowSlider] = useState(false)
  const [sliderType, setSliderType] = useState<"success" | "error" | "warning" | "info">("success")
  const [sliderMessage, setSliderMessage] = useState("")

  // Set initial logo preview if editing
  useEffect(() => {
    if (isEditMode && initialData?.logo && typeof initialData.logo === 'string') {
      setLogoPreview(initialData.logo)
    }
  }, [isEditMode, initialData])

  const clearForm = () => {
    setFormData({
      logo: null,
      companyName: "",
      websiteLink: "",
      hiresPerYear: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      phoneNumber: "",
      vatNumber: "",
      description: "",
      sendEmails: false,
      agreeGDPR: false,
      status: "In Progress",
      startDate: new Date().toISOString().split("T")[0],
    })
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation checks with specific messages
    if (!formData.companyName.trim()) {
      setSliderType("warning")
      setSliderMessage("Company name cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.websiteLink.trim()) {
      setSliderType("warning")
      setSliderMessage("Website link cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.hiresPerYear.trim()) {
      setSliderType("warning")
      setSliderMessage("Number of hires per year cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.address.trim()) {
      setSliderType("warning")
      setSliderMessage("Address cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.city) {
      setSliderType("warning")
      setSliderMessage("Please select a city")
      setShowSlider(true)
      return
    }
    
    if (!formData.country) {
      setSliderType("warning")
      setSliderMessage("Please select a country")
      setShowSlider(true)
      return
    }
    
    if (!formData.zipCode.trim()) {
      setSliderType("warning")
      setSliderMessage("Zip code cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.phoneNumber.trim()) {
      setSliderType("warning")
      setSliderMessage("Phone number cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.vatNumber.trim()) {
      setSliderType("warning")
      setSliderMessage("VAT number cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.description.trim()) {
      setSliderType("warning")
      setSliderMessage("Description cannot be empty")
      setShowSlider(true)
      return
    }
    
    if (!formData.agreeGDPR) {
      setSliderType("warning")
      setSliderMessage("You must agree to GDPR compliance")
      setShowSlider(true)
      return
    }

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
      if (isEditMode && initialData?.id) {
        
        const response = await axios.put(`http://localhost:3001/api/profiles/${initialData.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        dispatch(updateProfile({ id: initialData.id, changes: response.data }))
        setSliderType("success")
        setSliderMessage("Profile updated successfully!")
        setShowSlider(true)
        
        // Navigate back to profiles list after a short delay
        setTimeout(() => {
          navigate('/profiles')
        }, 2000)
      } else {
        // Create new profile
        const response = await axios.post("http://localhost:3001/api/profiles", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        dispatch(addProfile(response.data))
        setSliderType("success")
        setSliderMessage("Profile saved successfully!")
        setShowSlider(true)
        clearForm()
        setTimeout(() => {
          navigate('/profiles')
        }, 2000)
      }
    } catch (error) {
      setSliderType("error")
      setSliderMessage(`Error ${isEditMode ? 'updating' : 'saving'} profile. Please try again.`)
      setShowSlider(true)
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

  const handleCancel = () => {
    if (isEditMode) {
      navigate('/profiles')
    } else {
      clearForm()
    }
  }

  return (
    <div className="app-container">
      <Slider type={sliderType} message={sliderMessage} show={showSlider} onClose={() => setShowSlider(false)} />
      
      {/* Sidebar and Main Content Container */}
      <div className="profile-dashboard">
        <Sidebar />

        <div className="main-content">
          {/* Header */}
          <header className="header">
            <h1 className="header__title">{isEditMode ? 'Edit Profile' : 'My Profile'}</h1>

            <div className="header__actions">
              <div className="header__lang">
                <span>
                  <img width={70} height={40} src="/assets/language.png" alt="Language" />
                </span>
              </div>

              <button className="header__notification">
                <img src="/assets/Vector.png" alt="Notifications" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="header__user">
                    <div className="header__user-avatar">
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
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Karachi">Karachi</option>
                      <option value="New York">New York</option>
                      <option value="London">London</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Country</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
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
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update' : 'Save'}
                  </button>
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