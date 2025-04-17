const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  filePath: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number }
}, {
  timestamps: true 
});

module.exports = mongoose.model('File', FileSchema);
