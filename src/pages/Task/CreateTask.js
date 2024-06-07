import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import {
  Collapse,
  Modal,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
  IconButton,
  Chip,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import Swal from 'sweetalert2';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTheme } from "@mui/material/styles";
import StatusCell from "../../components/StatusCell";
import './CreateTask.css'; // import CSS file
import '../../components/StatusCell.css'; // import CSS file

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
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

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [taskGroups, setTaskGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userAvatars, setUserAvatars] = useState({});
  const { projectId } = useParams();
  const [expanded, setExpanded] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();

        const taskGroupsResponse = await api.get(`/task-group`);
        const allTaskGroups = taskGroupsResponse.data.result;

        const filteredTaskGroups = allTaskGroups.filter(
          (group) => group.projectId == projectId
        );
        const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
        setTaskGroups(sortedTaskGroups);

        const usersResponse = await api.get("/user");
        setUsers(usersResponse.data.result);

        // Fetch user avatars
        const avatars = {};
        for (const user of usersResponse.data.result) {
          const imageUrl = await fetchMediaObjectDetails(user.imageId);
          avatars[user.id] = imageUrl;
        }
        setUserAvatars(avatars);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchMediaObjectDetails = async (mediaObjectId) => {
    try {
      const api = axiosWithAuth();
      const response = await api.get(`/media-object/${mediaObjectId}`);
      return response.data.result[0].url;
    } catch (error) {
      console.error("Error fetching media object details:", error);
      return null;
    }
  };

  const isFormValid = () => {
    const { taskName, os, status, priority, taskGroupId, startDate, endDate } =
      taskItem;
    return (
      taskName &&
      os &&
      status &&
      priority &&
      taskGroupId &&
      startDate &&
      endDate
    );
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
        console.log("Task data submitted successfully.");
        onClose(); // ปิด Modal ทันทีหลังจากสร้าง Task สำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'Task Created',
          text: 'Your task has been created successfully!',
        });
      } else {
        console.error("Failed to submit task data.");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create task. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error submitting task data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while creating the task. Please try again.',
      });
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleChangeUsers = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedUsers(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'to_do':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'on_hold':
        return 'On Hold';
      case 'block':
        return 'Block';
      case 'ready_to_deploy':
        return 'Ready to Deploy';
      case 'ready_to_test':
        return 'Ready To Test';
      case 'done':
        return 'Done';
      default:
        return 'Unknown';
    }
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "80%",
          height: "80%",
          overflow: "auto",
          mx: "auto",
          my: 16,
        }}
      >
        <Typography variant="h4" component="h2" mb={2}>
          Create New Task
        </Typography>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Task Name"
              value={taskItem.taskName}
              onChange={(e) =>
                setTaskItem({ ...taskItem, taskName: e.target.value })
              }
              fullWidth
              variant="outlined"
              className="create-task-focus"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="os-label">OS</InputLabel>
              <Select
                labelId="os-label"
                id="os"
                value={taskItem.os}
                onChange={(e) =>
                  setTaskItem({ ...taskItem, os: e.target.value })
                }
                label="OS"
              >
                <MenuItem value="android">Android</MenuItem>
                <MenuItem value="ios">iOS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={taskItem.status}
                onChange={(e) =>
                  setTaskItem({ ...taskItem, status: e.target.value })
                }
                label="Status"
                renderValue={(selected) => getStatusDisplay(selected)}
              >
                <MenuItem value="to_do">
                  <StatusCell status="to_do" className="status-small"/>
                </MenuItem>
                <MenuItem value="in_progress">
                  <StatusCell status="in_progress" className="status-small" />
                </MenuItem>
                <MenuItem value="on_hold">
                  <StatusCell status="on_hold" className="status-small"/>
                </MenuItem>
                <MenuItem value="block">
                  <StatusCell status="block" className="status-small"/>
                </MenuItem>
                <MenuItem value="ready_to_deploy">
                  <StatusCell status="ready_to_deploy" className="status-small" />
                </MenuItem>
                <MenuItem value="ready_to_test">
                  <StatusCell status="ready_to_test" className="status-small" />
                </MenuItem>
                <MenuItem value="done">
                  <StatusCell status="done" className="status-small"/>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                value={taskItem.priority}
                onChange={(e) =>
                  setTaskItem({ ...taskItem, priority: e.target.value })
                }
                label="Priority"
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="Start Date"
              value={taskItem.startDate}
              onChange={(e) =>
                setTaskItem({ ...taskItem, startDate: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="End Date"
              value={taskItem.endDate}
              onChange={(e) =>
                setTaskItem({ ...taskItem, endDate: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>


        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined" sx={{ mt: 4 }}>
          <InputLabel id="task-group-label">Task Group</InputLabel>
          <Select
            labelId="task-group-label"
            id="task-group"
            value={taskItem.taskGroupId}
            onChange={(e) =>
              setTaskItem({ ...taskItem, taskGroupId: e.target.value })
            }
            label="Task Group"
          >
            {taskGroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.taskGroupName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ mt: 4 }}>
          <InputLabel id="users-label">Users</InputLabel>
          <Select
            labelId="users-label"
            id="users"
            multiple
            value={selectedUsers}
            onChange={handleChangeUsers}
            input={
              <OutlinedInput
                id="select-multiple-chip"
                label="Users"
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  const imageUrl = userAvatars[userId];
                  return (
                    <Chip
                      key={userId}
                      avatar={
                        <img
                          crossOrigin="anonymous"
                          alt={`${user?.username} ${user?.firstName}`}
                          src={imageUrl}
                          className="profile-icon"
                        />
                      }
                      label={`${user?.username} ${user?.firstName}`}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {users.map((user) => (
              <MenuItem
                key={user.id}
                value={user.id}
                style={{
                  fontWeight:
                    selectedUsers.indexOf(user.id) === -1
                      ? theme.typography.fontWeightRegular
                      : theme.typography.fontWeightMedium,
                }}
              >
                <Chip
                  avatar={
                    <img
                      crossOrigin="anonymous"
                      alt={`${user.username} ${user.firstName}`}
                      src={userAvatars[user.id]}
                      className="profile-icon"
                    />
                  }
                  label={`${user.username} ${user.firstName}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        </Grid>
        </Grid>

        <Box mt={3} width="100%">
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
                  options: [
                    "inline",
                    "blockType",
                    "list",
                    "textAlign",
                    "history",
                  ],
                  inline: {
                    options: ["bold", "italic", "underline"],
                  },
                }}
              />
            </Paper>
          </Collapse>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 35 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
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
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTask;
