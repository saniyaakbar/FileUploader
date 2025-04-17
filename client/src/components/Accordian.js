import React, { useState, useEffect, useContext } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

function FolderAccordion({ folder, fetchSubItems }) {
  const [expanded, setExpanded] = useState(false);
  const [subItems, setSubItems] = useState([]);
  const [loadingSubItems, setLoadingSubItems] = useState(false);
  const [errorSubItems, setErrorSubItems] = useState(null);

  const handleChange = async () => {
    setExpanded(!expanded);
    if (!expanded && subItems.length === 0 && folder._id) {
      setLoadingSubItems(true);
      setErrorSubItems(null);
      try {
        const filesResponse = await fetch(
          `http://localhost:5000/api/files?folderId=${folder._id}`
        );
        const filesData = await filesResponse.json();

        const foldersResponse = await fetch(
          `http://localhost:5000/api/folders?parent=${folder._id}`
        );
        const foldersData = await foldersResponse.json();

        const combinedSubItems = [
          ...foldersData.items.map(f => ({ ...f, type: 'folder' })),
          ...filesData.items.map(f => ({ ...f, type: 'file' })),
        ];
        setSubItems(combinedSubItems);
        setLoadingSubItems(false);
      } catch (err) {
        console.error('Error fetching sub-items:', err);
        setErrorSubItems(err.message || 'Failed to fetch sub-items');
        setLoadingSubItems(false);
      }
    }
  };

  return (
    <li>
      <Accordion expanded={expanded} onChange={handleChange} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`folder-${folder._id}-content`}
          id={`folder-${folder._id}-header`}
        >
          <FolderIcon sx={{ mr: 1 }} />
          <Typography>{folder.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loadingSubItems ? (
            <Typography>Loading...</Typography>
          ) : errorSubItems ? (
            <Typography color="error">{errorSubItems}</Typography>
          ) : (
            <ul>
              {subItems
                ?.filter(item => item.type === 'folder')
                .map((childItem) => (
                  <FolderAccordion
                    key={childItem._id}
                    folder={childItem}
                    fetchSubItems={fetchSubItems}
                  />
                ))}
              {subItems
                ?.filter(item => item.type === 'file')
                .map((file) => (
                  <li key={file._id} className="file-item">
                    <InsertDriveFileIcon sx={{ mr: 1 }} />
                    {file.fileName}
                  </li>
                ))}
              {subItems?.filter(item => item.type === 'folder').length === 0 &&
                subItems?.filter(item => item.type === 'file').length === 0 && (
                  <Typography color="textSecondary">No items inside</Typography>
                )}
            </ul>
          )}
        </AccordionDetails>
      </Accordion>
    </li>
  );
}

export default FolderAccordion;
