import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ProgressBar from './ProgressBar'; // Import your custom ProgressBar component

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const FileUploadModalMUI = () => {
  const { showUploadModal, setShowUploadModal, currentParentFolderId } = useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    console.log(currentParentFolderId)
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileName', selectedFile.name);
    formData.append('folderId', currentParentFolderId);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    });

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setShowUploadModal(false);
        // Optionally refresh file list
      } else {
        setUploadError('Upload failed.');
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadError('Network error during upload.');
    };

    xhr.open('POST', 'http://localhost:5000/api/upload-file');
    xhr.send(formData);
  };

  const handleClose = () => {
    setShowUploadModal(false);
  };

  return (
    <Modal
      open={showUploadModal}
      onClose={handleClose}
      aria-labelledby="upload-document-modal-title"
      aria-describedby="upload-document-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          disabled={isUploading}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="upload-document-modal-title" variant="h6" component="h2" mb={2}>
          Upload document
        </Typography>

        {!isUploading ? (
          <div>
            <label htmlFor="browseFile" style={{ display: 'block', marginBottom: 10, color: '#555' }}>
              Browse document
            </label>
            <div
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onClick={handleBrowseClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: '1px dashed #ccc',
                borderRadius: 4,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <UploadFileIcon sx={{ fontSize: 40, color: '#777' }} />
              <Typography color="textSecondary">Drag and drop files here</Typography>
              <Typography color="textSecondary">or click to browse</Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                id="browseFile"
                style={{ display: 'none' }}
              />
              {selectedFile && (
                <Typography variant="body2" mt={1}>
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / (1024 * 1024))} MB)
                </Typography>
              )}
            </div>
          </div>
        ) : (
          <div className="upload-progress-container">
            <Typography>Uploading {selectedFile && selectedFile.name}...</Typography>
            <ProgressBar progress={uploadProgress} /> 
            <Typography variant="body2">{uploadProgress}% upload completed</Typography>
            {uploadError && <Typography color="error" mt={1}>{uploadError}</Typography>}
          </div>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FileUploadModalMUI;