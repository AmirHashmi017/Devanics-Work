import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  logo: {
    data: Buffer,
    contentType: String,
  },
  companyName: String,
  websiteLink: String,
  hiresPerYear: String,
  address: String,
  city: String,
  country: String,
  zipCode: String,
  phoneNumber: String,
  vatNumber: String,
  description: String,
  sendEmails: Boolean,
  agreeGDPR: Boolean,
  status: { type: String, enum: ['In Progress', 'Draft', 'Completed'], default: 'In Progress' },
  startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  archived: { type: Boolean, default: false },
});

export const Profile = mongoose.model('Profile', profileSchema);