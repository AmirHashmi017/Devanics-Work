import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProfile } from '../redux/profileSlice';
import axios from 'axios';

interface ProfileFormProps {
  initialData?: {
    id: string; // Made id required in initialData
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

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
      <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })} />
      <input placeholder="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
      <input placeholder="Website Link" value={formData.websiteLink} onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })} />
      <input placeholder="No of hires/year" value={formData.hiresPerYear} onChange={(e) => setFormData({ ...formData, hiresPerYear: e.target.value })} />
      <input placeholder="Enter Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
        <option value="">Select City</option>
        <option value="New York">New York</option>
      </select>
      <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
        <option value="">Select Country</option>
        <option value="USA">USA</option>
      </select>
      <input placeholder="Enter Zip Code" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
      <input placeholder="Enter Company’s Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
      <input placeholder="VAT Number" value={formData.vatNumber} onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })} />
      <textarea placeholder="Write description here" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      <label><input type="checkbox" checked={formData.sendEmails} onChange={(e) => setFormData({ ...formData, sendEmails: e.target.checked })} /> Send me occasional emails</label>
      <label><input type="checkbox" checked={formData.agreeGDPR} onChange={(e) => setFormData({ ...formData, agreeGDPR: e.target.checked })} /> I agree to GDPR</label>
      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'In Progress' | 'Draft' | 'Completed' })}>
        <option value="In Progress">In Progress</option>
        <option value="Draft">Draft</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Save</button>
      <button type="button">Cancel</button>
      {onEdit && initialData && <button type="button" onClick={() => onEdit(initialData.id)}>Edit</button>}
    </form>
  );
};

export default ProfileForm;