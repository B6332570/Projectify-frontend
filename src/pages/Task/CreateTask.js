import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Collapse, Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Grid, Paper, IconButton } from '@mui/material';
import axios from 'axios';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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

const CreateTask = ({ open, onClose }) => {
  const [taskItem, setTaskItem] = useState({
    title: "",
    taskName: "",
    description: "",
    os: "",
    status: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    priority: "",
    taskGroupId: 1,
  });

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [taskGroups, setTaskGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { projectId } = useParams();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();

        const taskGroupsResponse = await api.get(`/task-group`);
        const allTaskGroups = taskGroupsResponse.data.result;

        const filteredTaskGroups = allTaskGroups.filter(group => group.projectId == projectId);
        const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
        setTaskGroups(sortedTaskGroups);

        const usersResponse = await api.get("/user");
        setUsers(usersResponse.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  const isFormValid = () => {
    const { taskName, os, status, priority, taskGroupId, startDate, endDate } = taskItem;
    return taskName && os && status && priority && taskGroupId && startDate && endDate;
  };
  
  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert("Please fill out all required fields.");
      return;
    }
    try {
      const contentState = editorState.getCurrentContent();
      const rawContentState = JSON.stringify(convertToRaw(contentState));
  
      const formData = {
        ...taskItem,
        description: rawContentState,
        users: selectedUsers,
      };
  
      const api = axiosWithAuth();
      const taskItemResponse = await api.post("/task-item", formData);
  
      if (taskItemResponse.data.status === "success") {
        console.log('Task data submitted successfully.');
      } else {
        console.error('Failed to submit task data.');
      }
    } catch (error) {
      console.error('Error submitting task data:', error);
    }
  };
  



  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: '80%',
          height: '80%',
          overflow: 'auto',
          mx: 'auto',
          my: 4,
        }}
      >
        <Typography variant="h4" component="h2" mb={2}>
          Create New Task
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Task Name"
              value={taskItem.taskName}
              onChange={(e) => setTaskItem({ ...taskItem, taskName: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="os-label">OS</InputLabel>
              <Select
                labelId="os-label"
                id="os"
                value={taskItem.os}
                onChange={(e) => setTaskItem({ ...taskItem, os: e.target.value })}
                label="OS"
              >
                <MenuItem value="android">Android</MenuItem>
                <MenuItem value="ios">iOS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={taskItem.status}
                onChange={(e) => setTaskItem({ ...taskItem, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="to_do">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="block">Block</MenuItem>
                <MenuItem value="ready_to_deploy">Ready to Deploy</MenuItem>
                <MenuItem value="ready_to_test">Ready To Test</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                value={taskItem.priority}
                onChange={(e) => setTaskItem({ ...taskItem, priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <TextField
              type="date"
              label="Start Date"
              value={taskItem.startDate}
              onChange={(e) => setTaskItem({ ...taskItem, startDate: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="date"
              label="End Date"
              value={taskItem.endDate}
              onChange={(e) => setTaskItem({ ...taskItem, endDate: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="task-group-label">Task Group</InputLabel>
          <Select
            labelId="task-group-label"
            id="task-group"
            value={taskItem.taskGroupId}
            onChange={(e) => setTaskItem({ ...taskItem, taskGroupId: e.target.value })}
            label="Task Group"
          >
            {taskGroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.taskGroupName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="users-label">Users</InputLabel>
          <Select
            labelId="users-label"
            id="users"
            multiple
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.target.value)}
            label="Users"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.username} {user.firstName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2} width="100%">
          <Typography variant="h6" component="div" gutterBottom>
            Description
            <IconButton onClick={toggleExpanded}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Typography>
          <Collapse in={expanded}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={{
                  options: ['inline', 'blockType', 'list', 'textAlign', 'history'],
                  inline: {
                    options: ['bold', 'italic', 'underline'],
                  },
                }}
              />
            </Paper>
          </Collapse>
        </Box>

        <Button
  variant="contained"
  color="primary"
  sx={{ mt: 3, width: '100%' }}
  onClick={handleSubmit}
>
  Save
</Button>

      </Box>
    </Modal>
  );
};

export default CreateTask;
