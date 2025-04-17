import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { format } from 'date-fns';
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

const SubFileList = ({ subItems, setSelectedFile, fetchSubItems }) => {

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const { setShowUploadModal, setShowFolderModal, setCurrentParentFolderId } = useContext(AppContext);
  const [openSubTable, setOpenSubTable] = useState({});

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

  const [selectedItem, setSelectedItem] = useState(null);
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

  return (
    <TableContainer>
      <Table size="small" aria-label="sub-items list">
        <TableBody>
          {subItems?.map((item) => (
            <React.Fragment key={item._id}>
              <TableRow
                   onClick={() => {
                  toggleSubTable(item._id);
                  setCurrentParentFolderId(item._id);
                }}
                style={{ cursor: item.children ? 'pointer' : 'default' }}
              >
                <TableCell component="th" scope="row">
                  {item.children ? <FolderIcon sx={{ mr: 1 }} /> : <InsertDriveFileIcon sx={{ mr: 1 }} />}
                  {item.name || item.fileName}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.createdAt && format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell>{item.updatedAt && format(new Date(item.updatedAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell align="right">

                <IconButton aria-label="menu" onClick={(event) => handleMenuClick(event, item)}>
                    <MoreVertIcon />
                  </IconButton>
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
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                  <Collapse in={openSubTable[item._id]} timeout="auto" unmountOnExit>
                    <Box sx={{ ml: 2 }}>
                      {subItems[item._id]?.length > 0 ? (
                        <SubFileList subItems={subItems[item._id]} setSelectedFile={setSelectedFile} fetchSubItems={fetchSubItems}/>
                      ) : (
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleCreateFolderClick(item._id)}
                          >
                            Add Folder
                          </Button>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleUploadDocumentClick(item._id)}
                          >
                            Add File
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              {/* {item.children && (
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={openNestedSubTable[item._id]} timeout="auto" unmountOnExit>
                      <Box sx={{ ml: 2 }}>
                        {nestedSubItems[item._id]?.length > 0 && (
                          <SubFileList
                            subItems={nestedSubItems[item._id]}
                            setSelectedFile={setSelectedFile}
                            folder={folder}
                            fetchSubItems={fetchSubItems}
                          />
                        )}
                        {nestedSubItems[item._id]?.length === 0 && (
                          <Typography variant="body2" color="textSecondary">
                            No items inside.
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )} */}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubFileList