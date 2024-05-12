import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Paper,
  Grid,
} from "@mui/material";
import "./EditTaskItem.css"; // import CSS file
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  Select,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { sizing } from "@mui/system";
import { Editor, EditorState } from "draft-js";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";

const MySwal = withReactContent(Swal);

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

const EditTaskItem = ({ taskItem, onClose }) => {
  const [updatedTaskItem, setUpdatedTaskItem] = useState({
    taskName: taskItem ? taskItem.taskName : "",
    description: taskItem ? taskItem.description : "",
    os: taskItem ? taskItem.os : "",
    status: taskItem ? taskItem.status : "",
    startDate: taskItem
      ? new Date(taskItem.startDate).toISOString().split("T")[0]
      : "",
    endDate: taskItem
      ? new Date(taskItem.endDate).toISOString().split("T")[0]
      : "",
    priority: taskItem ? taskItem.priority : "",
    users: [], // Initialize users as an empty array
  });

  const [expanded, setExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState("auto");

  const theme = useTheme();

  const toggleExpanded = () => {
    setExpanded(!expanded);
    setDescriptionHeight(expanded ? "auto" : "500px");
  };

  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  function getStyles(userId, selectedUserIds, theme) {
    return {
      fontWeight:
        selectedUserIds.indexOf(userId) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const usersResponse = await api.get("/user");
        setUsers(usersResponse.data.result);

        if (taskItem && taskItem.users) {
          setSelectedUserIds(taskItem.users.map((item) => item.userId));
        }

        console.log("taskItem.users:", taskItem.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [taskItem]); // Add taskItem as a dependency to useEffect

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedTaskItem({ ...updatedTaskItem, [name]: value });
  };

  const handleChangeUsers = (event) => {
    const selectedIds = event.target.value || []; // ตรวจสอบว่า event.target.value ไม่เป็น undefined
    setSelectedUserIds(
      typeof selectedIds === "string" ? selectedIds.split(",") : selectedIds
    );
    console.log("Selected User IDs:", selectedIds); // บันทึกค่า selectedUserIds ไปยังคอนโซล
  };

  const handleCancel = () => {
    onClose();
  };

  const fetchMediaObjectDetails = async (mediaObjectId) => {
    try {
      // Assuming `axiosWithAuth` is a function that returns an Axios instance with authentication
      const api = axiosWithAuth();
      const response = await api.get(`/media-object/${mediaObjectId}`);
      console.log(
        "Response from media object endpoint:",
        response.data.result[0].url
      );

      if (!response.data.result[0] || !response.data.result[0].url) {
        throw new Error("Invalid response from media object endpoint");
      }
      return response.data.result[0].url;
    } catch (error) {
      console.error("Error fetching media object details:", error);
      // Handle error gracefully, e.g., return a default image URL or null
      return null;
    }
  };

  const [userAvatars, setUserAvatars] = useState({});

  useEffect(() => {
    const fetchUserAvatars = async () => {
      const avatars = {};
      for (const user of users) {
        const imageUrl = await fetchMediaObjectDetails(user.imageId);
        avatars[user.id] = imageUrl;
      }
      setUserAvatars(avatars);
    };

    fetchUserAvatars();
  }, [users]);

  const handleSave = async () => {
    try {
      if (!updatedTaskItem.users || !selectedUserIds) {
        console.error(
          "No user data found in updatedTaskItem or selectedUserIds is null or undefined"
        );
        return;
      }

      const api = axiosWithAuth();
      const formattedStartDate = new Date(updatedTaskItem.startDate)
        .toISOString()
        .split("T")[0];
      const formattedEndDate = new Date(updatedTaskItem.endDate)
        .toISOString()
        .split("T")[0];

      const updateTaskItemKrub = await api.patch(`/task-item/${taskItem.id}`, {
        ...updatedTaskItem,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        users: selectedUserIds, // Update users with selectedUserIds
      });

      MySwal.fire({
        icon: "success",
        title: "Task Updated Successfully! คราบบบ",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        onClose(); // Close dialog
        window.location.reload(); // Reload page
      });
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth="คับผม"
      className="dialogPaper"
      maxWidth={false} // ใช้ false แทน "false"
    >
      <DialogContent className="dialogContent">
        <Grid container spacing={2}>
          <Grid item xs={2.5}>
            <Paper
              style={{ height: "1200px", padding: "16px", overflow: "auto" }}
            >
              {/* Content for the left frame goes here */}
            </Paper>
          </Grid>





          <Grid item xs={9.5}>
            <Paper
              style={{
                height: "1200px",
                padding: "16px",
                overflow: "auto",
                backgroundColor: "rgba(250, 250, 255, 0.5)", // เปลี่ยนสีพื้นหลังให้โปร่งแสงลง
              }}
            >
              {/* Content for the right frame goes here */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <TextField
                  name="taskName"
                  fullWidth={false} // ไม่ใช้ fullWidth
                  style={{ width: "1200px" }} // กำหนดความกว้างด้วย CSS inline style
                  id="standard-basic"
                  value={updatedTaskItem.taskName}
                  onChange={handleChange}
                  variant="standard"
                  margin="normal"
                />
                <Paper
                  style={{
                    height: descriptionHeight,
                    padding: "16px",
                    overflow: "auto",
                    transition: "height 0.3s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={toggleExpanded}>
                      {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <span>Description</span>
                  </div>
                  <Collapse in={expanded}>
                    <TextField
                      name="description"
                      value={updatedTaskItem.description}
                      onChange={handleChange}
                      multiline
                      style={{
                        width: "100%",
                        height: expanded ? "auto" : "0px",
                      }}
                      margin="normal"
                    />
                  </Collapse>
                </Paper>
                

                {/* นี่คือ กระดาษข้อมูล TaskItem */}
                <Paper
                  style={{
                    height: "800px",
                    padding: "16px",
                    overflow: "auto",
                    transition: "height 0.3s",
                    
                  }}
                >
                 <div style={{ marginTop: "10px", marginBottom: "30px"}}>Task</div> 
                
                  {/* นี่คือ Status */}
                  <Grid container spacing={1} style={{ marginBottom: "30px" }}>
                    <Grid item xs={6}>
                      <TextField
                        select
                        name="status"
                        label="Status"
                        value={updatedTaskItem.status}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      >
                        <MenuItem value="to_do">To Do</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="on_hold">On Hold</MenuItem>
                        <MenuItem value="block">Block</MenuItem>
                        <MenuItem value="ready_to_deploy">
                          Ready to Deploy
                        </MenuItem>
                        <MenuItem value="ready_to_test">Ready to Test</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  {/* นี่คือ Users */}
                  <div style={{ marginTop: "15px", marginBottom: "30px"}}>
                 
                    {/* กำหนดความกว้างที่ต้องการ */}
                    <Grid container spacing={1} >
                      <Grid item xs={6}>
                      
                        {/* ให้ใช้ Grid item แบบเต็มแถว */}
                        <FormControl fullWidth>
                        
                          {/* ให้ FormControl รับ full width */}
                          <InputLabel id="users-label">Owner</InputLabel>
                          <Select
                            labelId="users-label"
                            id="users"
                            multiple
                            value={selectedUserIds}
                            onChange={handleChangeUsers}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Chip"
                              />
                            }
                            renderValue={() => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selectedUserIds.map((userId) => {
                                  const user = users.find(
                                    (user) => user.id === userId
                                  );
                                  const imageUrl = userAvatars[userId];
                                  return (
                                    <Chip
                                      avatar={
                                        <img
                                          crossOrigin="anonymous"
                                          alt={`${user.username} ${user.firstName}`}
                                          src={imageUrl}
                                          className="profile-icon"
                                        />
                                      }
                                      key={userId}
                                      label={`${user.username} ${user.firstName}`}
                                    />
                                  );
                                })}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {users &&
                              users.map((user) => (
                                <MenuItem
                                  key={user.id}
                                  value={user.id}
                                  style={getStyles(
                                    user.id,
                                    selectedUserIds,
                                    theme
                                  )}
                                >
                                  {user.username} {user.firstName}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>

                  <Grid container spacing={1} style={{ marginBottom: "30px" }}>
                    <Grid item xs={6}>
                      {/* OS */}
                      <TextField
                        select
                        name="os"
                        label="OS"
                        value={updatedTaskItem.os}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                      >
                        <MenuItem value="ios">iOS</MenuItem>
                        <MenuItem value="android">Android</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} style={{ marginBottom: "30px" }}>
                    <Grid item xs={6}>
                      {/* Start Date */}
                      <TextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        value={updatedTaskItem.startDate}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} style={{ marginBottom: "30px" }}>
                    <Grid item xs={6}>
                      {/* End Date */}
                      <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        value={updatedTaskItem.endDate}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} style={{ marginBottom: "30px" }}>
                    <Grid item xs={6}>
                      {/* Priority */}
                      <TextField
                        select
                        name="priority"
                        label="Priority"
                        value={updatedTaskItem.priority}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <DialogActions className="dialogActions">
          <Button onClick={handleCancel} className="button cancelButton">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            className="button saveButton"
          >
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskItem;
