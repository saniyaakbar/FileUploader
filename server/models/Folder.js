const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  path: { type: Array, default: [] }, // Breadcrumb path
  description: { type: String, required: true },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Folder', FolderSchema);