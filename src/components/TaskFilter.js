import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Checkbox, FormControlLabel, Divider, Typography, Box } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(Checkbox)({
  '&.MuiCheckbox-root': {
    color: '#333', // สีที่ต้องการเมื่อไม่ถูกเลือก
  },
});

const TaskFilter = ({ onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedOS, setSelectedOS] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setSelectedStatuses((prev) => {
      const updatedStatuses = prev.includes(value) ? prev.filter((status) => status !== value) : [...prev, value];
      onFilterChange({ statuses: updatedStatuses, priorities: selectedPriorities, os: selectedOS });
      return updatedStatuses;
    });
  };

  const handlePriorityChange = (event) => {
    const value = event.target.value;
    setSelectedPriorities((prev) => {
      const updatedPriorities = prev.includes(value) ? prev.filter((priority) => priority !== value) : [...prev, value];
      onFilterChange({ statuses: selectedStatuses, priorities: updatedPriorities, os: selectedOS });
      return updatedPriorities;
    });
  };

  const handleOSChange = (event) => {
    const value = event.target.value;
    setSelectedOS((prev) => {
      const updatedOS = prev.includes(value) ? prev.filter((os) => os !== value) : [...prev, value];
      onFilterChange({ statuses: selectedStatuses, priorities: selectedPriorities, os: updatedOS });
      return updatedOS;
    });
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SortIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            padding: '10px',
            width: '250px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Box sx={{ padding: '10px' }}>
          <Typography variant="h6" gutterBottom>Status</Typography>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("to_do")}
                  onChange={handleStatusChange}
                  value="to_do"
                />
              }
              label="To Do"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("in_progress")}
                  onChange={handleStatusChange}
                  value="in_progress"
                />
              }
              label="In Progress"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("on_hold")}
                  onChange={handleStatusChange}
                  value="on_hold"
                />
              }
              label="On Hold"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("block")}
                  onChange={handleStatusChange}
                  value="block"
                />
              }
              label="Block"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("ready_to_deploy")}
                  onChange={handleStatusChange}
                  value="ready_to_deploy"
                />
              }
              label="Ready to Deploy"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("ready_to_test")}
                  onChange={handleStatusChange}
                  value="ready_to_test"
                />
              }
              label="Ready to Test"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedStatuses.includes("done")}
                  onChange={handleStatusChange}
                  value="done"
                />
              }
              label="Done"
            />
          </MenuItem>
        </Box>
        <Divider />
        <Box sx={{ padding: '10px' }}>
          <Typography variant="h6" gutterBottom>Priority</Typography>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedPriorities.includes("low")}
                  onChange={handlePriorityChange}
                  value="low"
                />
              }
              label="Low"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedPriorities.includes("medium")}
                  onChange={handlePriorityChange}
                  value="medium"
                />
              }
              label="Medium"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedPriorities.includes("high")}
                  onChange={handlePriorityChange}
                  value="high"
                />
              }
              label="High"
            />
          </MenuItem>
        </Box>
        <Divider />
        <Box sx={{ padding: '10px' }}>
          <Typography variant="h6" gutterBottom>OS</Typography>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedOS.includes("android")}
                  onChange={handleOSChange}
                  value="android"
                />
              }
              label="Android"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={selectedOS.includes("ios")}
                  onChange={handleOSChange}
                  value="ios"
                />
              }
              label="iOS"
            />
          </MenuItem>
        </Box>
      </Menu>
    </div>
  );
};

export default TaskFilter;
