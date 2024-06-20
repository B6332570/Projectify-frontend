import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  Box,
  Chip,
  OutlinedInput,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import "./EditTaskItem.css"; // import CSS file
import { useTheme } from "@mui/material/styles";

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

const EditTaskItem = ({ taskItem, onClose, taskGroupId }) => {
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
  const [filteredTaskItems, setFilteredTaskItems] = useState([]);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [taskItem]);

  useEffect(() => {
    if (!taskItem || !taskGroupId) return;

    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const taskItemsResponse = await api.get(
          `/task-group/${taskItem.taskGroupId}`
        );
        const taskItems = taskItemsResponse.data.result[0].taskItems;

        const allTaskItemsResponse = await api.get(`/task-item`);
        const allTaskItemsWithUsers = allTaskItemsResponse.data.result;

        const taskItemsWithUsers = taskItems.map((item) => ({
          ...item,
          users:
            allTaskItemsWithUsers.find((t) => t.id === item.id)?.users || [],
        }));

        setFilteredTaskItems(taskItemsWithUsers);
      } catch (error) {
        console.error("Error fetching task items:", error);
      }
    };

    fetchData();
  }, [taskItem, taskGroupId]);

  const renderValue = (selected) => {
    return selected
      .map((userId) => {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          console.warn("User not found for ID:", userId);
          return null;
        }
        return `${user.username} ${user.firstName}`;
      })
      .filter(Boolean)
      .join(", ");
  };

  useEffect(() => {
    if (taskItem) {
      setUpdatedTaskItem({
        taskName: taskItem.taskName || "",
        description: taskItem.description || "",
        os: taskItem.os || "",
        status: taskItem.status || "",
        startDate: taskItem.startDate
          ? new Date(taskItem.startDate).toISOString().split("T")[0]
          : "",
        endDate: taskItem.endDate
          ? new Date(taskItem.endDate).toISOString().split("T")[0]
          : "",
        priority: taskItem.priority || "",
        users: taskItem.users || [],
        id: taskItem.id || "",
      });

      const userIds = taskItem.users?.map((user) => user.userId);
      setSelectedUserIds(userIds || []);
    }
  }, [taskItem]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedTaskItem({ ...updatedTaskItem, [name]: value });
  };

  const handleChangeUsers = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedUserIds(typeof value === "string" ? value.split(",") : value);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleTaskItemClick = (clickedTaskItem) => {
    if (clickedTaskItem && clickedTaskItem.id) {
      setTimeout(() => {
        setUpdatedTaskItem({
          ...clickedTaskItem,
          startDate: clickedTaskItem.startDate
            ? new Date(clickedTaskItem.startDate).toISOString().split("T")[0]
            : "",
          endDate: clickedTaskItem.endDate
            ? new Date(clickedTaskItem.endDate).toISOString().split("T")[0]
            : "",
          users: clickedTaskItem.users || [],
        });

        const userIds = clickedTaskItem.users?.map((user) => user.userId);
        setSelectedUserIds(userIds || []);
      }, 50);
    } else {
      setUpdatedTaskItem({
        taskName: "",
        description: "",
        os: "",
        status: "",
        startDate: "",
        endDate: "",
        priority: "",
        users: [],
      });
    }
  };

  const fetchMediaObjectDetails = async (mediaObjectId) => {
    try {
      const api = axiosWithAuth();
      const response = await api.get(`/media-object/${mediaObjectId}`);

      if (!response.data.result[0] || !response.data.result[0].url) {
        throw new Error("Invalid response from media object endpoint");
      }
      return response.data.result[0].url;
    } catch (error) {
      console.error("Error fetching media object details:", error);
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

  useEffect(() => {
    console.log("Users or selectedUserIds updated");
  }, [users, selectedUserIds]);

  const getPriorityIcon = (priority) => {
    let icon;
    let text;
    switch (priority) {
      case "low":
        icon = (
          <ReportProblemIcon
            style={{
              color: "69B16C",
              marginRight: "8px",
              verticalAlign: "middle",
              marginTop: "4px",
            }}
          />
        );
        text = "Low";
        break;
      case "medium":
        icon = (
          <ReportProblemIcon
            style={{
              color: "EFAD25",
              marginRight: "8px",
              verticalAlign: "middle",
              marginTop: "4px",
            }}
          />
        );
        text = "Medium";
        break;
      case "high":
        icon = (
          <ReportProblemIcon
            style={{
              color: "F16E70",
              marginRight: "8px",
              verticalAlign: "middle",
              marginTop: "4px",
            }}
          />
        );
        text = "High";
        break;
      default:
        return null;
    }
    return (
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "70px" }}
      >
        {icon}
        <span>{text}</span>
      </div>
    );
  };

  const handleSave = async () => {
    try {
      if (!updatedTaskItem.users || !selectedUserIds) {
        console.error(
          "No user data found in updatedTaskItem or selectedUserIds is null or undefined"
        );
        return;
      }

      const api = axiosWithAuth();

      const formattedStartDate = updatedTaskItem.startDate.split("T")[0];
      const formattedEndDate = updatedTaskItem.endDate.split("T")[0];

      const updateTaskItemKrub = await api.patch(
        `/task-item/${updatedTaskItem.id}`,
        {
          ...updatedTaskItem,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          description: updatedTaskItem.description, // Save the description directly from the state
          users: selectedUserIds,
        }
      );

      MySwal.fire({
        icon: "success",
        title: "Task Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        onClose();
        window.location.reload();
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
      fullWidth
      className="dialogPaper"
      maxWidth={false}
    >
      <DialogContent className="dialogContent">
        <Grid container spacing={2}>
          <Grid item xs={2.5}>
            <Paper
              style={{
                height: "calc(100vh - 200px)",
                padding: "16px",
                backgroundColor: "#ffe6e9",
                overflowY: "auto",
                paddingTop: "0px",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  marginBottom: "16px",
                  position: "sticky",
                  top: "0",
                  fontSize: "25px",
                  backgroundColor: "#ffe6e9",
                  zIndex: 1,
                  padding: "20px 0px 1px 16px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Task List
              </Typography>
              {filteredTaskItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTaskItemClick(item)}
                  className="taskName"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    backgroundColor: "#ffffff",
                    width: "100%",
                    height: "100px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-all",
                  }}
                >
                  <span
                    style={{
                      wordWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordBreak: "break-all",
                      flex: 1,
                    }}
                  >
                    {item.taskName}
                  </span>
                  <span>{getPriorityIcon(item.priority)}</span>
                </div>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={9.5}>
            <Paper
              style={{
                height: "calc(100vh - 200px)",
                padding: "16px",
               
                overflow: "auto",
                backgroundColor: "#ffe6e9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <TextField
                  name="taskName"
                  fullWidth={false}
                  style={{ width: "1500px" }}
                  id="standard-basic"
                  value={updatedTaskItem.taskName}
                  onChange={handleChange}
                  variant="standard"
                  margin="normal"
                  className="edit-task-focus"
                  InputProps={{
                    style: {
                      fontSize: "25px",
                    },
                  }}
                  sx={{
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "rgba(0, 0, 0, 0.42)",
                      borderBottomWidth: "1px",
                    },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                      borderBottomColor: "rgba(0, 0, 0, 0.42)",
                      borderBottomWidth: "1px",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "rgba(0, 0, 0, 0.42)",
                      borderBottomWidth: "1px",
                    },
                  }}
                />

                <Paper
                  style={{
                    height: "290px",
                    padding: "16px",
                    overflow: "auto",
                    transition: "height 0.3s",
                    // height: "calc(100vh - 290px)",
                  }}
                >
                  <div
                    style={{
                 
                      fontSize: "20px",
                    }}
                  >
                    Description
                  </div>

                  <TextField
                    name="description"
                    label=""
                    multiline
                    rows={7}
                    fullWidth
                    value={updatedTaskItem.description}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    className="edit-task-focus"
                    sx={{
                      "& .MuiFormLabel-root.Mui-focused": {
                        color: "#847d7d", // สีที่ต้องการ
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#847d7d", // สีของ border ที่ต้องการ
                          borderWidth: "1px", // ความกว้างของ border ที่ต้องการ
                        },
                    }}
                  />
                </Paper>

                <Paper
                  style={{
                   
                    padding: "16px",
                  
                    transition: "height 0.3s",
                    height: "calc(100vh - 623px)",
                  }}
                >
                  <div
                    style={{
                      marginTop: "10px",
                      marginBottom: "30px",
                      fontSize: "20px",
                    }}
                  >
                    Task Information
                  </div>

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

                  <div style={{ marginTop: "15px", marginBottom: "30px" }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel
                            id="users-label"
                            sx={{
                              transform: "translate(14px, -9px) scale(0.75)",
                              "&.Mui-focused": {
                                transform: "translate(14px, -9px) scale(0.75)",
                              },
                            }}
                          >
                            Owner
                          </InputLabel>
                          <Select
                            labelId="users-label"
                            id="users"
                            multiple
                            value={selectedUserIds}
                            onChange={handleChangeUsers}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Owner"
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "rgba(0, 0, 0, 0.6)",
                                    borderWidth: "1px",
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "rgba(0, 0, 0, 0.6)",
                                    borderWidth: "1px",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "rgba(0, 0, 0, 0.6)",
                                      borderWidth: "1px",
                                    },
                                  "& fieldset": {
                                    borderColor: "rgba(0, 0, 0, 0.6)",
                                    borderWidth: "1px",
                                    padding: "4 16px",
                                    right: 0,
                                  },
                                }}
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
                                          alt={`${user?.username} ${user?.firstName}`}
                                          src={imageUrl}
                                          className="profile-icon"
                                        />
                                      }
                                      key={userId}
                                      label={`${user?.username} ${user?.firstName}`}
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
                      <TextField
                        select
                        name="priority"
                        label="Priority"
                        value={updatedTaskItem.priority}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                      >
                        <MenuItem value="low">
                          <ReportProblemIcon
                            style={{
                              marginRight: "8px",
                              color: "69B16C",
                              verticalAlign: "middle",
                            }}
                          />
                          Low
                        </MenuItem>
                        <MenuItem value="medium">
                          <ReportProblemIcon
                            style={{
                              marginRight: "8px",
                              color: "EFAD25",
                              verticalAlign: "middle",
                            }}
                          />
                          Medium
                        </MenuItem>
                        <MenuItem value="high">
                          <ReportProblemIcon
                            style={{
                              marginRight: "8px",
                              color: "F16E70",
                              verticalAlign: "middle",
                            }}
                          />
                          High
                        </MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <DialogActions className="dialogActions">
          <Button
            onClick={handleCancel}
            sx={{
              backgroundColor: "#f6d2d2",
              color: "#464747",
              "&:hover": { backgroundColor: "#f4c6c6" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#464747",
              color: "#f6d2d2",
              "&:hover": { backgroundColor: "#3f3f3f" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskItem;
