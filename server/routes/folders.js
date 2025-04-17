const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');

// Create a new folder
router.post('/create-folder', async (req, res) => {
  const { name, parent } = req.body;
  try {
    let path = [];
    if (parent) {
      // Retrieve parent's breadcrumb path
      const parentFolder = await Folder.findById(parent);
      if (parentFolder) {
        path = [...parentFolder.path, { name: parentFolder.name, id: parentFolder._id }];
      }
    }
    const newFolder = new Folder({ name, parent, path });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: 'Folder creation failed' });
  }
});

// Get all parent folders (where parent is null)
router.get('/parent-folders', async (req, res) => {
  
  try {
      const parentFolders = await Folder.find({ parent: null });
      res.status(200).json(parentFolders);
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve parent folders' });
  }
});

// Get all parent folders or subfolders
router.get('/folders', async (req, res) => {
  let { parent = null, searchTerm = '', page = 1, limit = 10 } = req.query;

  try {
    const query = {
      name: { $regex: searchTerm, $options: 'i' }
    };

    if (parent == 'null') {
      query.parent = null;
    } else if (parent) {
      query.parent = parent;
    } else {
      query.parent = null; // Default to fetching parent folders
    }

    const folders = await Folder.find(query);

    // Combine results and paginate
    const items = [...folders];
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json({
      total: items.length,
      page: parseInt(page),
      limit: parseInt(limit),
      items: paginatedItems
    });
  } catch (error) {
    console.error('Error in /folders get', error);
    res.status(500).json({ error: 'Could not fetch data' });
  }
});


module.exports = router;
