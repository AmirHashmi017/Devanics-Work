import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProfile } from '../redux/profileSlice';
import axios from 'axios';
import Sidebar from './sidebar';
import Footer from './footer';
import "../styles/Components.css"
import "../styles/dashboard.css"


interface ProfileFormProps {
  initialData?: {
    id: string;
    logo: string | null;
    companyName: string;
    websiteLink: string;
    hiresPerYear: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    phoneNumber: string;
    vatNumber: string;
    description: string;
    sendEmails: boolean;
    agreeGDPR: boolean;
    status: 'In Progress' | 'Draft' | 'Completed';
    startDate: string;
  };
  onEdit?: (id: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onEdit }) => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    companyName: initialData?.companyName || '',
    websiteLink: initialData?.websiteLink || '',
    hiresPerYear: initialData?.hiresPerYear || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    zipCode: initialData?.zipCode || '',
    phoneNumber: initialData?.phoneNumber || '',
    vatNumber: initialData?.vatNumber || '',
    description: initialData?.description || '',
    sendEmails: initialData?.sendEmails || false,
    agreeGDPR: initialData?.agreeGDPR || false,
    status: initialData?.status || 'In Progress',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
  });
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    if (formData.logo) formDataToSend.append('logo', formData.logo);
    formDataToSend.append('companyName', formData.companyName);
    formDataToSend.append('websiteLink', formData.websiteLink);
    formDataToSend.append('hiresPerYear', formData.hiresPerYear);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('zipCode', formData.zipCode);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('vatNumber', formData.vatNumber);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('sendEmails', formData.sendEmails.toString());
    formDataToSend.append('agreeGDPR', formData.agreeGDPR.toString());
    formDataToSend.append('status', formData.status);
    formDataToSend.append('startDate', formData.startDate);

    const response = await axios.post('http://localhost:3001/api/profiles', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(addProfile(response.data));
  };

  const formStyles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
    } as React.CSSProperties,
    
    sidebar: {
      width: '280px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      padding: '2rem 1.5rem',
      position: 'fixed' as const,
      height: '100vh',
      overflowY: 'auto' as const,
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '3rem',
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    
    logoIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: '#10b981',
      borderRadius: '8px',
      marginRight: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '0.95rem',
    } as React.CSSProperties,
    
    navItemActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    navIcon: {
      width: '20px',
      height: '20px',
      marginRight: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
    },
    
    upgradeSection: {
      position: 'absolute' as const,
      bottom: '2rem',
      left: '1.5rem',
      right: '1.5rem',
    },
    
    upgradeButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    
    mainContent: {
      marginLeft: '280px',
      flex: 1,
      padding: '2rem',
      backgroundColor: '#f8fafc',
    },
    
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0,
    },
    
    profileCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
    },
    
    profileHeader: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #e5e7eb',
    },
    
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    
    formGroupFull: {
      gridColumn: '1 / -1',
    },
    
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    
    input: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
    } as React.CSSProperties,
    
    inputFocus: {
      borderColor: '#10b981',
      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
    },
    
    select: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
    } as React.CSSProperties,
    
    textarea: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      minHeight: '120px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      outline: 'none',
    },
    
    fileUpload: {
      position: 'relative' as const,
      display: 'inline-block',
      cursor: 'pointer',
    },
    
    fileInput: {
      position: 'absolute' as const,
      opacity: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    
    fileButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 24px',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      color: '#6b7280',
      fontSize: '0.9rem',
      transition: 'border-color 0.2s, color 0.2s',
    },
    
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
      marginBottom: '2rem',
    },
    
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: '#10b981',
    },
    
    checkboxLabel: {
      fontSize: '0.9rem',
      color: '#374151',
    },
    
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      paddingTop: '1.5rem',
      borderTop: '1px solid #e5e7eb',
    },
    
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
    } as React.CSSProperties,
    
    buttonPrimary: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: '1px solid #d1d5db',
    },
  };

  return (
    <div style={formStyles.container}>
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div style={formStyles.mainContent}>
        <div style={formStyles.header}>
          <h1 style={formStyles.title}>My Profile</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}></div>
            </div>
          </div>
        </div>

        <div style={formStyles.profileCard}>
          <h2 style={formStyles.profileHeader}>Profile Details</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Logo Upload */}
            <div style={{ ...formStyles.formGroup, ...formStyles.formGroupFull, marginBottom: '2rem' }}>
              <label style={formStyles.label}>Upload company logo</label>
              <div style={formStyles.fileUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
                  style={formStyles.fileInput}
                />
                <div style={formStyles.fileButton}>
                  📁 Upload Logo
                </div>
              </div>
            </div>

            <div style={formStyles.formGrid}>
              {/* Company Name */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Company Name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  style={formStyles.input}
                />
              </div>

              {/* Website Link */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Website Link</label>
                <input
                  type="url"
                  placeholder="Website Link"
                  value={formData.websiteLink}
                  onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                  style={formStyles.input}
                />
              </div>

              {/* Hires Per Year */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>No. of hires/year</label>
                <input
                  type="text"
                  placeholder="No of hires/year"
                  value={formData.hiresPerYear}
                  onChange={(e) => setFormData({ ...formData, hiresPerYear: e.target.value })}
                  style={formStyles.input}
                />
              </div>

              {/* Address */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Enter Address</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={formStyles.input}
                />
              </div>

              {/* City */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Select City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={formStyles.select}
                >
                  <option value="">Select City</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Tokyo">Tokyo</option>
                </select>
              </div>

              {/* Country */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Select Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={formStyles.select}
                >
                  <option value="">Select Country</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              {/* Zip Code */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Enter Zip Code</label>
                <input
                  type="text"
                  placeholder="Enter Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  style={formStyles.input}
                />
              </div>

              {/* Phone Number */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Enter Company's Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter Company's Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  style={formStyles.input}
                />
              </div>

              {/* VAT Number */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>VAT Number</label>
                <input
                  type="text"
                  placeholder="VAT Number"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                  style={formStyles.input}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ ...formStyles.formGroup, ...formStyles.formGroupFull }}>
              <label style={formStyles.label}>Write description here</label>
              <textarea
                placeholder="Write description here"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={formStyles.textarea}
              />
            </div>

            {/* Checkboxes */}
            <div style={formStyles.checkboxGroup}>
              <div style={formStyles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={formData.sendEmails}
                  onChange={(e) => setFormData({ ...formData, sendEmails: e.target.checked })}
                  style={formStyles.checkbox}
                />
                <label style={formStyles.checkboxLabel}>
                  Send me occasional emails about Carrier's services
                </label>
              </div>
              
              <div style={formStyles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={formData.agreeGDPR}
                  onChange={(e) => setFormData({ ...formData, agreeGDPR: e.target.checked })}
                  style={formStyles.checkbox}
                />
                <label style={formStyles.checkboxLabel}>
                  I agree to GDPR Compliant lorem ipsum dolor sit amet. <span style={{ color: '#10b981', cursor: 'pointer' }}>Read more</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div style={formStyles.buttonGroup}>
              <button
                type="button"
                style={{ ...formStyles.button, ...formStyles.buttonSecondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...formStyles.button, ...formStyles.buttonPrimary }}
              >
                Save
              </button>
              {onEdit && initialData && (
                <button
                  type="button"
                  onClick={() => onEdit(initialData.id)}
                  style={{ ...formStyles.button, ...formStyles.buttonPrimary }}
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProfileForm;