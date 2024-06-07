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
} from "@mui/material";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
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

  const [editorState, setEditorState] = useState(() => 
    taskItem && taskItem.description
      ? EditorState.createWithContent(ContentState.createFromText(taskItem.description))
      : EditorState.createEmpty()
  );

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

    console.log("taskItem", taskItem);
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        // Fetch task items from the task group
        const taskItemsResponse = await api.get(
          `/task-group/${taskItem.taskGroupId}`
        );
        const taskItems = taskItemsResponse.data.result[0].taskItems;

        console.log("taskItems krabb", taskItems);

        // Fetch all task items including user data
        const allTaskItemsResponse = await api.get(`/task-item`);
        const allTaskItemsWithUsers = allTaskItemsResponse.data.result;
        console.log("allTaskItemsWithUsers krabb", allTaskItemsWithUsers);

        // Merge user data into task items from the task group
        const taskItemsWithUsers = taskItems.map((item) => ({
          ...item,
          users:
            allTaskItemsWithUsers.find((t) => t.id === item.id)?.users || [],
        }));

        console.log("taskItemsWithUsers krabb", taskItemsWithUsers);

        setFilteredTaskItems(taskItemsWithUsers);
      } catch (error) {
        console.error("Error fetching task items:", error);
      }
    };

    fetchData();
  }, [taskItem, taskGroupId]);

  const renderValue = (selected) => {
    console.log("Selected IDs:", selected); // Log selected IDs
    console.log("Users array:", users); // Log entire users array to verify data

    return selected
      .map((userId) => {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          console.warn("User not found for ID:", userId); // Warn if user isn't found
          return null;
        }
        return `${user.username} ${user.firstName}`;
      })
      .filter(Boolean)
      .join(", "); // Filter out any nulls and join names
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
        id: taskItem.id || "", // เพิ่มการตั้งค่า id ของ taskItem ด้วย
      });

      setEditorState(
        taskItem.description
          ? EditorState.createWithContent(ContentState.createFromText(taskItem.description))
          : EditorState.createEmpty()
      );

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
    setSelectedUserIds(
      // Assuming value is an array of user IDs or a single string of user IDs
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleTaskItemClick = (clickedTaskItem) => {
    console.log("clickedTaskItem", clickedTaskItem);
    // Check if clickedTaskItem exists and contains valid data
    if (clickedTaskItem && clickedTaskItem.id) {
      // Update the state with the clicked TaskItem data
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

        setEditorState(
          clickedTaskItem.description
            ? EditorState.createWithContent(ContentState.createFromText(clickedTaskItem.description))
            : EditorState.createEmpty()
        );

        console.log("clickedTaskItem", clickedTaskItem);
        const userIds = clickedTaskItem.users?.map((user) => user.userId); // Use optional chaining here
        console.log("userIds ค้าบบบ", userIds);
        setSelectedUserIds(userIds || []); // Provide a default value if userIds is undefined
      }, 50); // ดีเลย์ 50 มิลลิวินาที
    } else {
      // If clickedTaskItem is not valid, reset the state or display a message
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

      setEditorState(EditorState.createEmpty());
      // Optionally, you can display a message to indicate no TaskItem is selected
      console.log("No valid TaskItem selected.");
    }
  };

  const fetchMediaObjectDetails = async (mediaObjectId) => {
    try {
      // Assuming `axiosWithAuth` is a function that returns an Axios instance with authentication
      const api = axiosWithAuth();
      const response = await api.get(`/media-object/${mediaObjectId}`);
      // console.log(
      //   "Response from media object endpoint:",
      //   response.data.result[0].url
      // );

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

  useEffect(() => {
    // Log หรือ update state ตามความจำเป็น
    console.log("Users or selectedUserIds updated");
  }, [users, selectedUserIds]); // Dependencies ที่สำคัญสำหรับการตอบสนองต่อการเปลี่ยนแปลง

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
          description: editorState.getCurrentContent().getPlainText(), // Save the editor content as plain text
          users: selectedUserIds, // Update users with selectedUserIds
        }
      );

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
      fullWidth
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
              {filteredTaskItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTaskItemClick(item)} // Pass clicked TaskItem to handler
                  className="taskName"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    width: '100%', // กำหนดความกว้างของช่อง TaskName
                    height: '100px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0"; // เปลี่ยนสีพื้นหลังเมื่อเลื่อนเมาส์เข้า
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white"; // คืนค่าสีพื้นหลังเมื่อเมาส์ออก
                  }}
                >
                  <span>{item.taskName}</span>
                  <span>{getPriorityIcon(item.priority)}</span>
                </div>
              ))}
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
                  style={{ width: "1500px" }} // กำหนดความกว้างด้วย CSS inline style
                  id="standard-basic"
                  value={updatedTaskItem.taskName}
                  onChange={handleChange}
                  variant="standard"
                  margin="normal"
                  className="edit-task-focus" // เพิ่ม className
                  InputProps={{
                    style: {
                      fontSize: "25px", // ปรับขนาดฟอนต์ของ input
                    },
                  
                  }}
                  sx={{
                    '& .MuiInput-underline:before': {
                      borderBottomColor: 'rgba(0, 0, 0, 0.42)', // สีปกติ
                      borderBottomWidth: '1px', // ความหนาของเส้นปกติ
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                      borderBottomColor: 'rgba(0, 0, 0, 0.42)', // สีเหมือนเดิมเมื่อ hover
                      borderBottomWidth: '1px', // ความหนาเหมือนเดิมเมื่อ hover
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: 'rgba(0, 0, 0, 0.42)', // สีเมื่อ focus
                      borderBottomWidth: '1px', // ความหนาเมื่อ focus
                    },
                  }}
          
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
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                      }}
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
                  <div style={{ marginTop: "10px", marginBottom: "30px" }}>
                    Task
                  </div>

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
                  <div style={{ marginTop: "15px", marginBottom: "30px" }}>
                    {/* กำหนดความกว้างที่ต้องการ */}
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
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
                                  console.log(
                                    "Rendering user with selectedUserIds:",
                                    selectedUserIds
                                  ); // Debugging line
                                  console.log("user เนอะ:", user);
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
                            style={{ marginRight: "8px", color: "69B16C", verticalAlign: 'middle' }}
                          />
                          Low
                        </MenuItem>
                        <MenuItem value="medium">
                          <ReportProblemIcon
                            style={{ marginRight: "8px", color: "EFAD25", verticalAlign: 'middle' }}
                          />
                          Medium
                        </MenuItem>
                        <MenuItem value="high">
                          <ReportProblemIcon
                            style={{ marginRight: "8px", color: "F16E70", verticalAlign: 'middle' }}
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
