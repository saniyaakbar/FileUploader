const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const Folder = require('../models/Folder');

// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Create this folder manually if it doesn't exist
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload file endpoint
router.post('/upload-file', upload.single('file'), async (req, res) => {
  const { fileName, folderId } = req.body;
  let parentFolderId = folderId;

  try {

    if (folderId == 'null') {
      parentFolderId = null;
    } 

    console.log(parentFolderId)

    const newFile = new File({
      fileName,
      folder: parentFolderId,
      filePath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: 'File upload failed', error });
  }
});

// Fetch paginated files/folders with filter support
router.get('/folders-files', async (req, res) => {
  let { folderId = null, searchTerm = '', page = 1, limit = 10 } = req.query;

  try {
    // Convert types
    page = parseInt(page);
    limit = parseInt(limit);

    console.log('Query Params:', { folderId, searchTerm, page, limit });

    if(typeof(folderId) !== 'ObjectId'){
      folderId = null
    }
    // Find folders in the current directory
    const folders = await Folder.find({
      parent: folderId,
      name: { $regex: searchTerm, $options: 'i' }
    });

    // Find files in the current directory
    const files = await File.find({
      folder: folderId,
      fileName: { $regex: searchTerm, $options: 'i' }
    });

    // Combine results and paginate
    const items = [...folders, ...files];
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    res.json({
      total: items.length,
      page,
      items: paginatedItems
    });
  } catch (error) {
    console.error('Error in /folders-files:', error);
    res.status(500).json({ error: 'Could not fetch data' });
  }
});

// New route to filter folders and files
router.get('/filtered-data', async (req, res) => {
  try {
    const { name, description, date } = req.query;
    const filters = {};

    if (name) {
      filters.name = { $regex: name, $options: 'i' };
    }
    if (description) {
      filters.description = { $regex: description, $options: 'i' };
    }
    if (date) {
      // Assuming 'createdAt' or some other date field for filtering
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filters.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const filteredFolders = await Folder.find(filters);
    const filteredFiles = await File.find(filters); // You might need to adjust the file filtering based on your requirements

    // Combine and send the filtered data
    res.json([...filteredFolders, ...filteredFiles]);
  } catch (error) {
    console.error('Error filtering data:', error);
    res.status(500).json({ error: 'Could not filter data' });
  }
});

//Get All files

router.get('/files', async (req, res) => {
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
      query.parent = null; // Default to fetching parent files
    }

    const files = await File.find(query);

    // Combine results and paginate
    const items = [...files];
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
    console.error('Error in /files get', error);
    res.status(500).json({ error: 'Could not fetch data' });
  }
});

module.exports = router;
