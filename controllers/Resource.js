import express from 'express';
import Resource from '../Models/Resources.js';
const router = express.Router();
// Create a new role
router.post('/', async (req, res) => {
  try {
    const { userId, Name, Type } = req.body;
    const role = new Resource({ userId, Name, Type });
    await role.save();
    res.status(201).send(role);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Resource.find();
    res.send(roles);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a role by ID
router.get('/:id', async (req, res) => {
  try {
    const role = await Resource.find({ userId: req.params.id });
    if (!role) {
      return res.status(200).send([]);
    }
    res.send(role);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a role by ID
router.patch('/:id', async (req, res) => {
  try {
    const { Name, Type } = req.body;

    const role = await Resource.findOneAndUpdate(
      { _id: req.params.id },
      {
        Name,
        Type,
      }
    );
    if (!role) {
      return res.status(404).send({ error: 'Role not found' });
    }

    res.send(role);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a role by ID
router.delete('/:id', async (req, res) => {
  try {
    const role = await Resource.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).send({ error: 'Role not found' });
    }
    res.send(role);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
