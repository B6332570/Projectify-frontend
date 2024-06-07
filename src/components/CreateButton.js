import React from 'react';
import './CreateButton.css';
import { Button, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CreateButton = ({ handleMenuClick, handleMenuItemClick, anchorEl, menuOpen, handleMenuClose }) => {
  return (
    <div className="create-button-wrapper">
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleMenuClick}
        style={{
          backgroundColor: "#464747",
          color: "#fff",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: "8px"
        }}
      >
        New Task
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("createTask")}>Create new task</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("createTaskGroup")}>Create new task group</MenuItem>
      </Menu>
    </div>
  );
};

export default CreateButton;
