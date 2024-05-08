import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Modal, Box } from '@mui/material';

const axiosWithAuth = () => {
    const token = localStorage.getItem("accessToken");
  
    return axios.create({
      baseURL: "http://localhost:3001/api",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
};

const CreateTaskGroup = ({ open, onClose, projectId }) => {
  const [taskGroupName, setTaskGroupName] = useState('');
  const [error, setError] = useState('');

  const handleTaskGroupNameChange = (event) => {
    setTaskGroupName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to create a new task group
      const api = axiosWithAuth();

      const taskGroupsResponse = await api.post(`/task-group`, {
        taskGroupName: taskGroupName,
        projectId: projectId  // Set projectId here
      });
      console.log("ลอง log taskGroupsResponse ออกมาดูสิ๊:", taskGroupsResponse)

      // Check if the request was successful
      if (taskGroupsResponse.data.status === "success") {
        // Close the modal
        onClose();
      } else {
        setError('Failed to create task group. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while creating the task group.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-task-group-modal"
      aria-describedby="create-task-group-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 300,
          maxWidth: 500
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create New Task Group
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id="taskGroupName"
            label="Task Group Name"
            variant="outlined"
            fullWidth
            required
            value={taskGroupName}
            onChange={handleTaskGroupNameChange}
            margin="normal"
          />
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateTaskGroup;
