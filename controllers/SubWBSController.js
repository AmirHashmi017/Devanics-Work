import express from 'express';
import WBS from '../Models/WBS.js';
import SubWBS from '../Models/SubWBS.js';

const router = express.Router();

router.post('/subcreateWbs', async (req, res) => {
  const { WBS_Id, wbsName, startDate, wbsId, endDate } = req.body;

  try {
    const Obs = new SubWBS({
      WBS_Id,
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
router.get('/getAllWbs', async (req, res) => {
  try {
    const wbsList = await WBS.find().lean(); // Fetch all WBS
    const subWbsList = await SubWBS.find().lean(); // Fetch all SubWBS

    // Group SubWBS by their WBS_Id
    const groupedSubWbs = subWbsList.reduce((acc, subWbs) => {
      if (!acc[subWbs.WBS_Id]) {
        acc[subWbs.WBS_Id] = [];
      }
      acc[subWbs.WBS_Id].push(subWbs);
      return acc;
    }, {});

    // Attach SubWBS to their respective WBS
    const result = wbsList.map((wbs) => ({
      ...wbs,
      subWbs: groupedSubWbs[wbs._id] || [],
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/deleteWbs/:id', async (req, res) => {
  const wbsId = req.params.id;

  try {
    // Find and delete the WBS
    const wbs = await SubWBS.findByIdAndDelete(wbsId);

    if (!wbs) {
      return res.status(404).json({ message: 'WBS not found' });
    }

    res.status(200).json({
      success: true,
      message: ' SubWBS deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/suballWbs', async (req, res) => {
  try {
    const allObs = await SubWBS.find();

    res.json(allObs);
  } catch (error) {}
});

router.get('/suballWbs/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const allObs = await SubWBS.find({ userId: userId });

    res.json(allObs);
  } catch (error) {}
});

export default router;
