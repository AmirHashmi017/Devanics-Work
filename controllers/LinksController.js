import express from 'express';
import Links from '../Models/Links.js';

const router = express.Router();

// GET links
router.get('/links/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const linksDoc = await Links.findOne({ userId, projectId });

    if (!linksDoc) {
      return res.status(200).json({ links: [] });
    }

    res.status(200).json({ links: linksDoc.links });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT links (create or update links)
router.put('/links/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const { links: incomingLinks } = req.body;

    // Generate `key` for each link
    const validatedLinks = incomingLinks.map((link) => ({
      ...link,
      $p: link.$p || '',
      key: `${link.source}-${link.target}-${link.type}`,
    }));

    // Fetch or create Links doc
    let linksDoc =
      (await Links.findOne({ userId, projectId })) ||
      new Links({ userId, projectId, links: [] });

    // Merge existing + new links based on key
    const combined = [...linksDoc.links, ...validatedLinks];

    // De-duplicate based on `key`
    const uniqueMap = new Map();
    combined?.forEach((link) => {
      const key = `${link.source}-${link.target}-${link.type}`;
      uniqueMap.set(key, { ...link, key });
    });

    linksDoc.links = Array.from(uniqueMap.values());

    const savedDoc = await linksDoc.save();
    res.status(200).json({ links: savedDoc.links });
  } catch (error) {
    console.error('Error updating links:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a single link by key
router.delete('/links/:userId/:projectId/:key', async (req, res) => {
  try {
    const { userId, projectId, key } = req.params;

    const linksDoc = await Links.findOne({ userId, projectId });
    if (!linksDoc) {
      return res.status(404).json({ error: 'Links not found' });
    }

    linksDoc.links = linksDoc.links.filter((link) => link.key !== key);

    const savedDoc = await linksDoc.save();
    res.status(200).json({ links: savedDoc.links });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
