import express from 'express';
import WBS from '../Models/WBS.js';
const router = express.Router();

router.post('/createWbs', async (req, res) => {
  const { userId, wbsName, startDate, wbsId, endDate } = req.body;

  try {
    const Obs = new WBS({
      userId,
      wbsId,
      wbsName,
      startDate,
      endDate,
    });

    const newobs = await Obs.save();

    res
      .status(200)
      .json({ success: true, newobs, message: 'WBS created Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/allWbs', async (req, res) => {
  try {
    const allObs = await WBS.find();

    res.json(allObs);
  } catch (error) {}
});

router.get('/allWbs/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const allObs = await WBS.find({ userId: userId });

    res.json(allObs);
  } catch (error) {}
});

export default router;
