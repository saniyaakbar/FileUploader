import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

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

const FolderCreationModal = () => {
  const { showFolderModal, setShowFolderModal, currentParentFolderId, triggerFolderRefetch  } = useContext(AppContext);
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  console.log(currentParentFolderId, "SANIYA")
  const handleCreateFolder = () => {
    fetch('http://localhost:5000/api/create-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: folderName,
        description: folderDescription,
        parent: currentParentFolderId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowFolderModal(false);
        triggerFolderRefetch();
      })
      .catch((err) => console.error(err));
  };

  const handleClose = () => {
    setShowFolderModal(false);
  };

  return (
    <Modal
      open={showFolderModal}
      onClose={handleClose}
      aria-labelledby="create-folder-modal-title"
      aria-describedby="create-folder-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="create-folder-modal-title" variant="h6" component="h2">
            Create Folder
          </Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          id="folderName"
          label="Name"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          id="folderDescription"
          label="Description"
          placeholder="Folder Description"
          value={folderDescription}
          onChange={(e) => setFolderDescription(e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateFolder} disabled={!folderName.trim()}>
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FolderCreationModal;