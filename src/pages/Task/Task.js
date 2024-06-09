import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import CreateTask from "./CreateTask";
import CreateTaskGroup from "./CreateTaskGroup";
import StatusCell from "../../components/StatusCell";
import EditTaskItem from "./EditTaskItem";
import CreateButton from "../../components/CreateButton";
import "./Task.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Tooltip } from "antd";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TaskFilter from "../../components/TaskFilter";

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

const statusOrder = [
  "to_do",
  "in_progress",
  "on_hold",
  "block",
  "ready_to_deploy",
  "ready_to_test",
  "done",
];

const sortTaskItemsByStatus = (taskItems) => {
  console.log("นี่คือ taskItems", taskItems);
  return taskItems.sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );
};

const Row = ({
  row,
  taskGroup,
  handleEditTask,
  handleDeleteTaskItem,
  handleDeleteTaskGroup,
  handleEditTaskGroupName,
}) => {
  const hasTaskItems = row.length > 0;
  const [open, setOpen] = useState(hasTaskItems);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [usersData, setUsersData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTaskGroupName, setNewTaskGroupName] = useState(
    taskGroup.taskGroupName
  );
  const [width, setWidth] = useState(0);
  const inputRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeleteClick = (taskItem) => {
    setSelectedTaskToDelete(taskItem);
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteTaskItem(selectedTaskToDelete.id);
    setOpenDeleteConfirmation(false);
  };

  const handleDeleteCancelled = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setMenuOpen(false);
  };

  const handleTaskGroupNameChange = (event) => {
    setNewTaskGroupName(event.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const api = axiosWithAuth();
      await api.patch(`/task-group/${taskGroup.id}`, {
        taskGroupName: newTaskGroupName,
      });
      handleEditTaskGroupName(taskGroup.id, newTaskGroupName);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving task group name:", error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setNewTaskGroupName(taskGroup.taskGroupName);
  };

  const textFieldWidth = useMemo(() => {
    if (inputRef.current) {
      const context = document.createElement("canvas").getContext("2d");
      context.font = "16px Roboto";
      const metrics = context.measureText(newTaskGroupName);
      return metrics.width + 20;
    }
    return 200;
  }, [newTaskGroupName]);

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const api = axiosWithAuth();
        const userResponse = await api.get(`/user/profile/${userId}`);
        const imageId = userResponse.data.result[0].imageId;
        const mediaResponse = await api.get(`/media-object/${imageId}`);
        const imageUrl = mediaResponse.data.result[0].url;

        setUsersData((prevState) => ({
          ...prevState,
          [userId]: imageUrl,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    row.forEach((taskItem) => {
      taskItem.users.forEach((userItem) => {
        fetchUserData(userItem.userId);
      });
    });
  }, [row]);

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

  // Sorting task items by status
  const sortedTaskItems = sortTaskItemsByStatus(row);

  return (
    <React.Fragment>
      <TableRow sx={{ backgroundColor: "#F8F8F8", height: "auto" }}>
        <TableCell
          colSpan={7}
          className="icon-button"
          style={{ borderBottom: "none", paddingLeft: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ fontSize: "64px" }}
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <KeyboardArrowUpIcon className="icon-button-expanded" />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "70px",
                width: "100%",
              }}
            >
              {editMode ? (
                <>
                  <TextField
                    value={newTaskGroupName}
                    onChange={handleTaskGroupNameChange}
                    variant="outlined"
                    size="medium"
                    autoFocus
                    style={{ width: `${textFieldWidth}px`, minWidth: "350px" }}
                    inputRef={inputRef}
                  />
                  <Button
                    onClick={handleSaveClick}
                    style={{ marginLeft: "10px", color: "#ec9bc4" }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelClick}
                    style={{ marginLeft: "10px", color: "#ec9bc4" }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <span style={{ fontSize: "18px" }}>
                  {taskGroup && taskGroup.taskGroupName}
                </span>
              )}
              <IconButton
                aria-label="more"
                onClick={handleMenuClick}
                style={{ marginLeft: "20px" }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEditClick}>
                  Edit Task Group Name
                </MenuItem>
                <MenuItem onClick={() => handleDeleteTaskGroup(taskGroup.id)}>
                  Delete Task Group
                </MenuItem>
              </Menu>
            </div>
          </div>
        </TableCell>
      </TableRow>
      {sortedTaskItems.map((taskItem) => (
        <TableRow key={taskItem.id}>
          <TableCell colSpan={8} style={{ padding: "0.0001px" }}>
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit
              className="collapse-content"
            >
              <Box sx={{ display: "flex", width: "100%" }}>
                <TableCell
                  align="center"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "500px",
                    borderBottom: "none",
                  }}
                >
                  <Button
                    className="buttontask-no-hover"
                    style={{
                      fontSize: "16px",
                      color: "#575858",
                      backgroundColor: "white",
                      marginTop: "8px",
                    }}
                    onClick={() => handleEditTask(taskItem)}
                  >
                    {taskItem.taskName}
                  </Button>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: "290px", borderBottom: "none" }}
                >
                  <Avatar.Group maxCount={2} size={{ xxl: 50 }}>
                    {taskItem.users.map((userItem) => (
                      <Tooltip
                        title={`${userItem.user.username} ${userItem.user.firstName}`}
                        key={userItem.userId}
                      >
                        <Avatar
                          crossOrigin="anonymous"
                          src={usersData[userItem.userId]}
                          alt={`${userItem.user.username} ${userItem.user.firstName}`}
                        />
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    width: "250px",
                    marginLeft: "100px",
                    borderBottom: "none",
                    marginTop: "8px",
                  }}
                >
                  <StatusCell status={taskItem.status} />
                </TableCell>
                <TableCell
                  align="center"
                  className="table-cell-date"
                  style={{
                    width: "450px",
                    borderBottom: "none",
                    marginTop: "17px",
                    color: "#464747",
                  }}
                >
                  {formatDate(taskItem.startDate)}
                </TableCell>
                <TableCell
                  align="center"
                  className="table-cell-date"
                  style={{
                    width: "200px",
                    borderBottom: "none",
                    marginTop: "17px",
                    color: "#464747",
                  }}
                >
                  {formatDate(taskItem.endDate)}
                </TableCell>

                <TableCell
                  align="center"
                  className="table-cell-date"
                  style={{
                    width: "300px",
                    borderBottom: "none",
                    marginTop: "13px",
                    color: "#464747",
                  }}
                >
                  {getPriorityIcon(taskItem.priority)}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: "200px", borderBottom: "none" }}
                >
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(taskItem)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ))}
      <Dialog open={openDeleteConfirmation} onClose={handleDeleteCancelled}>
        <DialogTitle>Delete Task-item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task-item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelled} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const Task = () => {
  const [taskGroups, setTaskGroups] = useState([]);
  const [taskItems, setTaskItems] = useState([]);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateTaskGroup, setOpenCreateTaskGroup] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { projectId } = useParams();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openRows, setOpenRows] = useState({});
  const [usersData, setUsersData] = useState({});
  const [openDeleteTaskGroupConfirmation, setOpenDeleteTaskGroupConfirmation] =
    useState(false);
  const [selectedTaskGroupToDelete, setSelectedTaskGroupToDelete] =
    useState(null);
  // const [filterStatus, setFilterStatus] = useState("all");
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterPriority, setFilterPriority] = useState([]);
  const [filterOS, setFilterOS] = useState([]);

  const handleFilterChange = ({ statuses, priorities, os }) => {
    setFilterStatus(statuses);
    setFilterPriority(priorities);
    setFilterOS(os);
  };
  const handleEditTask = (taskItems) => {
    if (!taskItems.users.every((user) => usersData[user.userId])) {
      console.log("User data missing, fetching data");
    }
    setSelectedTask(taskItems);
    setOpenEditTask(true);
    setSelectedTaskId(taskItems.id);
  };

  const handleCloseEditTask = () => {
    setOpenEditTask(false);
  };

  const handleOpenCreateTask = () => {
    setOpenCreateTask(true);
  };

  const handleCloseCreateTask = () => {
    setOpenCreateTask(false);
  };

  const handleOpenCreateTaskGroup = () => {
    setOpenCreateTaskGroup(true);
  };

  const handleCloseCreateTaskGroup = async () => {
    setOpenCreateTaskGroup(false);
    try {
      const api = axiosWithAuth();
      const taskGroupsResponse = await api.get(`/task-group`);
      const allTaskGroups = taskGroupsResponse.data.result;
      const filteredTaskGroups = allTaskGroups.filter(
        (group) => group.projectId == projectId
      );
      const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
      setTaskGroups(sortedTaskGroups);
    } catch (error) {
      console.error("Error fetching updated task groups:", error);
    }
  };
  const handleDeleteTaskGroup = (taskGroupId) => {
    setSelectedTaskGroupToDelete(taskGroupId);
    setOpenDeleteTaskGroupConfirmation(true);
  };

  const handleDeleteTaskGroupConfirmed = async () => {
    try {
      const api = axiosWithAuth();
      await api.delete(`/task-group/${selectedTaskGroupToDelete}`);
      const taskGroupsResponse = await api.get(`/task-group`);
      console.log(`Deleted Task Group:`, selectedTaskGroupToDelete);
      const allTaskGroups = taskGroupsResponse.data.result;
      const filteredTaskGroups = allTaskGroups.filter(
        (group) => group.projectId == projectId
      );
      const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
      setTaskGroups(sortedTaskGroups);
      setOpenDeleteTaskGroupConfirmation(false);
    } catch (error) {
      console.error("Error deleting task group:", error);
    }
  };

  const handleDeleteTaskGroupCancelled = () => {
    setOpenDeleteTaskGroupConfirmation(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredTaskItems = taskItems.filter(
    (item) =>
      (filterStatus.length === 0 || filterStatus.includes(item.status)) &&
      (filterPriority.length === 0 || filterPriority.includes(item.priority)) &&
      (filterOS.length === 0 || filterOS.includes(item.os))
  );

  const handleMenuItemClick = (action) => {
    if (action === "createTask") {
      handleOpenCreateTask();
    } else if (action === "createTaskGroup") {
      handleOpenCreateTaskGroup();
    }
    handleMenuClose();
  };

  const handleDeleteTaskItem = async (taskId) => {
    try {
      const api = axiosWithAuth();
      await api.delete(`/task-item/${taskId}`);
      const taskItemsResponse = await api.get(`/task-item`);
      const allTaskItems = taskItemsResponse.data.result;
      const filteredTaskItems = allTaskItems.filter((item) =>
        taskGroups.some((group) => group.id === item.taskGroupId)
      );
      setTaskItems(filteredTaskItems);
    } catch (error) {
      console.error("Error deleting task item:", error);
    }
  };

  const handleEditTaskGroupName = (taskGroupId, currentName) => {
    const updatedTaskGroups = taskGroups.map((group) => {
      if (group.id === taskGroupId) {
        return { ...group, taskGroupName: currentName };
      }
      return group;
    });
    setTaskGroups(updatedTaskGroups);
  };

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
        const taskItemsResponse = await api.get(`/task-item`);
        const allTaskItems = taskItemsResponse.data.result;
        const filteredTaskItems = allTaskItems.filter((item) =>
          sortedTaskGroups.some((group) => group.id === item.taskGroupId)
        );
        setTaskGroups(sortedTaskGroups);
        setTaskItems(filteredTaskItems);
        setOpenEditTask(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [projectId]);

  return (
    <div className="flex">
      <Sidebar />
      <Navbar />

      <div className="tmain-content">
        <h1 className="task-page-title" style={{ textAlign: "center" }}>
          Task Page
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
            marginRight: "50px",
          }}
        >
         <div style={{ marginRight: "20px" }}>
            <TaskFilter onFilterChange={handleFilterChange} />
          </div>
          <CreateButton
            handleMenuClick={handleMenuClick}
            handleMenuItemClick={handleMenuItemClick}
            anchorEl={anchorEl}
            menuOpen={Boolean(anchorEl)}
            handleMenuClose={handleMenuClose}
          />
        </div>
        <div className="table-container">
          {openEditTask && selectedTask && (
            <EditTaskItem
              taskItem={selectedTask}
              open={openEditTask}
              onClose={handleCloseEditTask}
              taskGroupId={selectedTask.taskGroupId}
              usersData={usersData}
            />
          )}

          <CreateTask open={openCreateTask} onClose={handleCloseCreateTask} />
          <CreateTaskGroup
            open={openCreateTaskGroup}
            onClose={handleCloseCreateTaskGroup}
            projectId={projectId}
          />
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{
                      fontWeight: "bold",
                      width: "450px",
                      fontSize: "23px",
                      color: "#333",
                    }}
                  >
                    Task Group
                  </TableCell>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{
                      fontWeight: "bold",
                      width: "380px",
                      fontSize: "23px",
                      color: "#333",
                    }}
                  >
                    Owner
                  </TableCell>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{
                      fontWeight: "bold",
                      width: "370px",
                      fontSize: "23px",
                      color: "#333",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{
                      fontWeight: "bold",
                      width: "340px",
                      fontSize: "23px",
                      color: "#333",
                    }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{
                      fontWeight: "bold",
                      width: "305px",
                      fontSize: "23px",
                      color: "#333",
                    }}
                  >
                    End Date
                  </TableCell>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{
                      fontWeight: "bold",
                      width: "150px",
                      fontSize: "23px",
                      color: "#333",
                    }}
                  >
                    Priority
                  </TableCell>
                  <TableCell
                    align="center"
                    className="table-container-header"
                    sx={{ fontWeight: "bold" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskGroups.map((taskGroup) => {
                  const filteredTaskItems = taskItems
                    .filter(
                      (item) =>
                        (filterStatus.length === 0 ||
                          filterStatus.includes(item.status)) &&
                        (filterPriority.length === 0 ||
                          filterPriority.includes(item.priority)) &&
                        (filterOS.length === 0 || filterOS.includes(item.os))
                    )
                    .filter((item) => item.taskGroupId === taskGroup.id);
                  return (
                    <Row
                      key={taskGroup.id}
                      row={filteredTaskItems}
                      taskGroup={taskGroup}
                      handleEditTask={handleEditTask}
                      handleDeleteTaskItem={handleDeleteTaskItem}
                      handleDeleteTaskGroup={handleDeleteTaskGroup}
                      handleEditTaskGroupName={handleEditTaskGroupName}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Dialog
        open={openDeleteTaskGroupConfirmation}
        onClose={handleDeleteTaskGroupCancelled}
      >
        <DialogTitle>Delete Task Group</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task group?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTaskGroupCancelled} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTaskGroupConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Task;
