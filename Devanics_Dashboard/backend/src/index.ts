import express, { Request } from 'express';
import mongoose from 'mongoose';
import { Profile } from './profile_model';
import multer from 'multer';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors())
const storage = multer.memoryStorage();
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/profileDB');

app.post('/api/profiles', upload.single('logo'), async (req: Request & { file?: Express.Multer.File }, res) =>{
  const { companyName, websiteLink, hiresPerYear, address, city, country, zipCode, phoneNumber, vatNumber, description, sendEmails, agreeGDPR, status } = req.body;
  if (!companyName || !websiteLink || !hiresPerYear || !address || !city || !country || !zipCode || !phoneNumber || !vatNumber || !description) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
  const profile = new Profile({
    logo: req.file ? {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    } : null,
    companyName,
    websiteLink,
    hiresPerYear,
    address,
    city,
    country,
    zipCode,
    phoneNumber,
    vatNumber,
    description,
    sendEmails: sendEmails === 'true',
    agreeGDPR: agreeGDPR === 'true',
    status: status || 'In Progress',
  });
  await profile.save();
  res.status(201).send(profile);
});

app.get('/api/profiles', async (req, res) => {
  const profiles = await Profile.find();
  res.send(profiles);
});

app.put('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findByIdAndUpdate(id, req.body, { new: true });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.send(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', detail: err });
  }
});

app.delete('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProfile = await Profile.findByIdAndDelete(id);
    if (!deletedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profile', detail: err });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));