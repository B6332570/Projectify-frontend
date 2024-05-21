import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CreateTask from './CreateTask';
import CreateTaskGroup from './CreateTaskGroup';
import StatusCell from '../../components/StatusCell';
import EditTaskItem from './EditTaskItem';
import CreateButton from '../../components/CreateButton';
import './Task.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Tooltip } from 'antd';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


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

const Row = ({ row, taskGroup, handleEditTask, handleDeleteTaskItem }) => {
  const hasTaskItems = row.length > 0;
  const [open, setOpen] = useState(hasTaskItems);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [usersData, setUsersData] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const api = axiosWithAuth();
        const userResponse = await api.get(`/user/profile/${userId}`);
        const imageId = userResponse.data.result[0].imageId;
        const mediaResponse = await api.get(`/media-object/${imageId}`);
        const imageUrl = mediaResponse.data.result[0].url;

        setUsersData(prevState => ({
          ...prevState,
          [userId]: imageUrl
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
      case 'low':
        icon = <ReportProblemIcon style={{ color: '69B16C', marginRight: '8px', verticalAlign: 'middle', marginTop: '4px' }} />;
        text = 'Low';
        break;
      case 'medium':
        icon = <ReportProblemIcon style={{ color: 'EFAD25', marginRight: '8px', verticalAlign: 'middle', marginTop: '4px' }} />;
        text = 'Medium';
        break;
      case 'high':
        icon = <ReportProblemIcon style={{ color: 'F16E70', marginRight: '8px', verticalAlign: 'middle', marginTop: '4px' }} />;
        text = 'High';
        break;
      default:
        return null;
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginLeft:'70px' }}>
        {icon}
        <span>{text}</span>
      </div>
    );
  };

  return (
    <React.Fragment>
      <TableRow sx={{ backgroundColor: '#F8F8F8', height: 'auto' }}>
        <TableCell colSpan={7} className="icon-button" style={{ borderBottom: 'none', width: '500px', paddingLeft: '20px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            style={{ fontSize: '64px' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon className="icon-button-expanded" /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <span style={{ marginLeft: '100px' }}>{taskGroup && taskGroup.taskGroupName}</span>
        </TableCell>
      </TableRow>
      {row.map((taskItem) => (
        <TableRow key={taskItem.id}>
          <TableCell colSpan={8} style={{ padding: '0.0001px' }}>
            <Collapse in={open} timeout="auto" unmountOnExit className="collapse-content">
              <Box sx={{ display: 'flex', width: '100%' }}>
                <TableCell align="center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '400px' }}>
                  <Button  onClick={() => handleEditTask(taskItem)}>{taskItem.taskName}</Button>
                </TableCell>
                <TableCell align="center" style={{ width: '400px' }}>
                  <Avatar.Group maxCount={2} size={{ xxl: 50 }}>
                    {taskItem.users.map((userItem) => (
                      <Tooltip title={`${userItem.user.username} ${userItem.user.firstName}`} key={userItem.userId}>
                        <Avatar
                          crossOrigin='anonymous'
                          src={usersData[userItem.userId]}
                          alt={`${userItem.user.username} ${userItem.user.firstName}`}
                        />
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </TableCell>
                <TableCell align="center" style={{ width: '200px' }}>
                <StatusCell status={taskItem.status} />
                </TableCell>
                <TableCell align="center" className="table-cell-date" style={{ width: '450px' }}>{formatDate(taskItem.startDate)}</TableCell>
<TableCell align="center" className="table-cell-date" style={{ width: '200px' }}>{formatDate(taskItem.endDate)}</TableCell>

                <TableCell align="center" className="table-cell-date"  style={{ width: '300px' }}>
                  {getPriorityIcon(taskItem.priority)}
                </TableCell>
                <TableCell align="center" style={{ width: '200px' }}>
                  <IconButton aria-label="delete" onClick={() => handleDeleteClick(taskItem)}>
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
        <DialogContent>Are you sure you want to delete this task-item?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelled} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
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

  const handleEditTask = (taskItems) => {
    if (!taskItems.users.every(user => usersData[user.userId])) {
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
      const filteredTaskGroups = allTaskGroups.filter(group => group.projectId == projectId);
      const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
      setTaskGroups(sortedTaskGroups);
    } catch (error) {
      console.error("Error fetching updated task groups:", error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    if (action === 'createTask') {
      handleOpenCreateTask();
    } else if (action === 'createTaskGroup') {
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
      const filteredTaskItems = allTaskItems.filter(item => taskGroups.some(group => group.id === item.taskGroupId));
      setTaskItems(filteredTaskItems);
    } catch (error) {
      console.error("Error deleting task item:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const taskGroupsResponse = await api.get(`/task-group`);
        const allTaskGroups = taskGroupsResponse.data.result;
        const filteredTaskGroups = allTaskGroups.filter(group => group.projectId == projectId);
        const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
        const taskItemsResponse = await api.get(`/task-item`);
        const allTaskItems = taskItemsResponse.data.result;
        const filteredTaskItems = allTaskItems.filter(item => sortedTaskGroups.some(group => group.id === item.taskGroupId));
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
        <CreateButton handleMenuClick={handleMenuClick} handleMenuItemClick={handleMenuItemClick} />
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
          <h1>Task Page</h1>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick('createTask')}>Create Task</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('createTaskGroup')}>Create Task Group</MenuItem>
          </Menu>
          <CreateTask open={openCreateTask} onClose={handleCloseCreateTask} />
          <CreateTaskGroup open={openCreateTaskGroup} onClose={handleCloseCreateTaskGroup} projectId={projectId} />
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold', width: '450px' }}>Task Group</TableCell>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold', width: '330px' }}>Owner</TableCell>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold', width: '450px' }}>Status</TableCell>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell align="center" className="table-container-header" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskGroups.map((taskGroup) => {
                  const filteredTaskItems = taskItems.filter(item => item.taskGroupId === taskGroup.id);
                  return (
                    <Row
                      key={taskGroup.id}
                      row={filteredTaskItems}
                      taskGroup={taskGroup}
                      handleEditTask={handleEditTask}
                      handleDeleteTaskItem={handleDeleteTaskItem}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Task;
