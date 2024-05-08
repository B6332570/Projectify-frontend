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

  return (
    <React.Fragment>
      <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
        <TableCell className="icon-button">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon className="icon-button-expanded" /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="flex" component="th" scope="row" colSpan={9}>{taskGroup && taskGroup.taskGroupName}</TableCell>
      </TableRow>
      {row.map((taskItem) => (
        <TableRow key={taskItem.id}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <TableCell align="center" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Button onClick={() => handleEditTask(taskItem)}>{taskItem.taskName}</Button>
                </TableCell>
                <TableCell align="center" style={{ flex: 1 }}>
                  {taskItem.users.map((userItem, index) => (
                    <span key={userItem.user.userId}>
                      {userItem.user.username} {userItem.user.firstName}
                      {index !== taskItem.users.length - 1 && ', '}
                    </span>
                  ))}
                </TableCell>
                <StatusCell status={taskItem.status} />
                <TableCell align="center" style={{ flex: 1 }}>{formatDate(taskItem.startDate)}</TableCell>
                <TableCell align="center" style={{ flex: 1 }}>{formatDate(taskItem.startDate)}</TableCell>
                <TableCell align="center" style={{ flex: 1 }}>{taskItem.priority}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" color="error" onClick={() => handleDeleteClick(taskItem)}>Delete</Button>
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

  const handleEditTask = (taskItem) => {
    setSelectedTask(taskItem);
    setOpenEditTask(true);
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

      // After successful deletion, fetch the updated task items
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
      <div className="main-content">
        <div className="table-container">
          <h2>Task Page</h2>
          {openEditTask && selectedTask && (
            <EditTaskItem taskItem={selectedTask} open={openEditTask} onClose={handleCloseEditTask} />
          )}
          <div>
            <h1>Task Page</h1>
            <Button variant="contained" onClick={handleMenuClick}>Create</Button>
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
          </div>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>Task Group</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
