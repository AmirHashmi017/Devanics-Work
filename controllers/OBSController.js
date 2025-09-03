import express from 'express';
import OBS from '../Models/OBS.js';
const router = express.Router();

router.post('/createObs', async (req, res) => {
  const { userId, description, organization } = req.body;

  try {
    const Obs = new OBS({
      userId,
      description,
      organization,
    });

    const newobs = await Obs.save();

    res
      .status(200)
      .json({ success: true, newobs, message: 'OBS created Successfully' });
  } catch (error) {
    console.log(error, ' ===> Error while creating OBS');
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/allObs', async (req, res) => {
  try {
    const allObs = await OBS.find();

    res.json(allObs);
  } catch (error) {}
});

router.get('/allObs/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const allObs = await OBS.find({ userId: userId });

    res.json(allObs);
  } catch (error) {}
});

export default router;
