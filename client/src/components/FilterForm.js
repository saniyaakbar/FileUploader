import React, { useState } from 'react';
import { TextField, Button, Stack, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';

const FilterForm = ({ onApplyFilter, onCancelFilter }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);

  const handleApply = () => {
    const filters = {
      name,
      description,
      date: date ? moment(date).format('YYYY-MM-DD') : null,
    };
    onApplyFilter(filters);
  };

  const handleClear = () => {
    setName('');
    setDescription('');
    setDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Filters</h4>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p style={{ fontSize: "1.3rem", color: "red", cursor: "pointer", marginRight: "8px" }} onClick={handleClear}>Clear</p>
            <IconButton onClick={onCancelFilter}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <label htmlFor="name">Name</label>
        <TextField
          id="name"
          label="Folder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="description">Description</label>
        <TextField
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <DatePicker
          id="date"
          label="Date (DD/MM/YY)"
          format="DD/MM/YY"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          slotProps={{
            textField: {
            },
          }}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancelFilter}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Apply
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
};

export default FilterForm;