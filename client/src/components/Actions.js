import React, { useState } from 'react';
import { IconButton, Menu, Fade, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterForm from './FilterForm'; // Import the FilterForm

const Actions = ({ handleCreateFolderClick, handleUploadDocumentClick, onApplyFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Renamed for clarity
  const openAddMenu = Boolean(anchorEl);
  const openFilterMenu = Boolean(filterAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  return (
    <div className="actions">
      <IconButton
        aria-label="add"
        aria-controls={openAddMenu ? 'fade-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className="add-btn"
      >
        <AddIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'add-button',
        }}
        anchorEl={anchorEl}
        open={openAddMenu}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleCreateFolderClick}>Create Folder</MenuItem>
        <MenuItem onClick={handleUploadDocumentClick}>Upload Document</MenuItem>
      </Menu>

      <IconButton
        aria-label="filter"
        aria-controls={openFilterMenu ? 'filter-menu' : undefined}
        aria-haspopup="true"
        onClick={handleFilterClick}
        className="filter-btn"
      >
        <FilterAltIcon />
      </IconButton>

      <Menu
        id="filter-menu"
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
        anchorEl={filterAnchorEl}
        open={openFilterMenu}
        onClose={handleFilterClose}
        TransitionComponent={Fade}
      >
        <FilterForm onApplyFilter={onApplyFilter} onCancelFilter={handleFilterClose} />
      </Menu>
      {/* You can also keep the text input for more free-form filtering */}
      {/* <input
        type="text"
        placeholder="Filter files/folders…"
        className="filter-input"
        onChange={(e) => onApplyFilter({ searchTerm: e.target.value })}
      /> */}
    </div>
  );
};

export default Actions;