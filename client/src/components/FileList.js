import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Collapse,
  Box,
  Stack,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import './FileList.css';
import SubFileList from './subFileList';

const FileList = ({ folders }) => {
  const { setShowUploadModal, setShowFolderModal, setSelectedFile, setCurrentParentFolderId } = useContext(AppContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openSubTable, setOpenSubTable] = useState({});
  const [subItems, setSubItems] = useState({}); // Store sub-items for each folder
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(menuAnchorEl);

  const fetchSubItems = async (folderId) => {
    try {
      if (folderId !== null) {
        console.log(folderId);
        const responseFiles = await fetch(
          `http://localhost:5000/api/files?folderId=${folderId}`
        );
        const filesData = await responseFiles.json();

        const responseFolders = await fetch(
          `http://localhost:5000/api/folders?parent=${folderId}` // Corrected API endpoint and query
        );
        const foldersData = await responseFolders.json();

        setSubItems((prev) => ({
          ...prev,
          [folderId]: [...foldersData.items, ...filesData.items],
        }));
      }
    } catch (error) {
      console.error('Error fetching sub-items:', error);
      setSubItems((prev) => ({ ...prev, [folderId]: [] }));
    }
  };

  const handleMenuClick = (event, item) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  };

  const handleMenuItemClick = (action) => {
    handleMenuClose();
    switch (action) {
      case 'edit':
        console.log('Edit:', selectedItem);
        break;
      case 'delete':
        console.log('Delete:', selectedItem);
        break;
      case 'createFolder':
        setCurrentParentFolderId(null); // Reset for top-level creation
        setShowFolderModal(true);
        break;
      case 'uploadDocument':
        setCurrentParentFolderId(null); // Reset for top-level upload
        setShowUploadModal(true);
        break;
      default:
        break;
    }
  };

  const toggleSubTable = (folderId) => {
    setOpenSubTable((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
    if (!openSubTable[folderId] && !subItems[folderId]) {
      fetchSubItems(folderId);
    }
    // We don't set currentParentFolderId here anymore
  };

  const handleCreateFolderClick = (parentFolderId) => {
    setCurrentParentFolderId(parentFolderId);
    setShowFolderModal(true);
  };

  const handleUploadDocumentClick = (parentFolderId) => {
    setCurrentParentFolderId(parentFolderId);
    setShowUploadModal(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableContainer component={Paper} className="file-list">
      <Table aria-label="parent folder list">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell /> {/* For the menu icon */}
          </TableRow>
        </TableHead>
        <TableBody>
          {folders?.map((folder) => (
            <React.Fragment key={folder._id}>
              <TableRow
                onClick={() => {
                  toggleSubTable(folder._id);
                  setCurrentParentFolderId(folder._id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  <FolderIcon sx={{ mr: 1 }} />
                  {folder.name}
                </TableCell>
                <TableCell>{folder.description}</TableCell>
                <TableCell>{folder.createdAt && format(new Date(folder.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell>{folder.updatedAt && format(new Date(folder.updatedAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="menu" onClick={(event) => handleMenuClick(event, folder)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                  <Collapse in={openSubTable[folder._id]} timeout="auto" unmountOnExit>
                    <Box sx={{ ml: 2 }}>
                      {subItems[folder._id]?.length > 0 ? (
                        <SubFileList subItems={subItems[folder._id]} setSelectedFile={setSelectedFile} fetchSubItems={fetchSubItems}/>
                      ) : (
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleCreateFolderClick(folder._id)}
                          >
                            Add Folder
                          </Button>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleUploadDocumentClick(folder._id)}
                          >
                            Add File
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('createFolder')}>Create Folder</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('uploadDocument')}>Upload Document</MenuItem>
      </Menu>
      {/* Removed pagination */}
    </TableContainer>
  );
};

export default FileList;