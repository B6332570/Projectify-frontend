import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField } from '@mui/material';
import './EditTaskItem.css'; // import CSS file
import React, { useState, useEffect } from 'react';
import { Checkbox, FormControl, InputLabel, ListItemText, Select } from '@mui/material';


const MySwal = withReactContent(Swal);

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
    taskName: taskItem ? taskItem.taskName : '',
    description: taskItem ? taskItem.description : '',
    os: taskItem ? taskItem.os : '',
    status: taskItem ? taskItem.status : '',
    startDate: taskItem ? new Date(taskItem.startDate).toISOString().split('T')[0] : '',
    endDate: taskItem ? new Date(taskItem.endDate).toISOString().split('T')[0] : '',
    priority: taskItem ? taskItem.priority : '',
    users: [], // Initialize users as an empty array
  });

  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const usersResponse = await api.get("/user");
        setUsers(usersResponse.data.result);

      
        if (taskItem && taskItem.users) {
          setSelectedUserIds(taskItem.users.map(item => item.userId));
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
    setSelectedUserIds(selectedIds);
    console.log("Selected User IDs:", selectedIds); // บันทึกค่า selectedUserIds ไปยังคอนโซล
  };
  

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async () => {
    try {
      if (!updatedTaskItem.users || !selectedUserIds) {
        console.error('No user data found in updatedTaskItem or selectedUserIds is null or undefined');
        return;
      }
  
      const api = axiosWithAuth();
      const formattedStartDate = new Date(updatedTaskItem.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(updatedTaskItem.endDate).toISOString().split('T')[0];
  
      const updateTaskItemKrub = await api.patch(`/task-item/${taskItem.id}`, {
        ...updatedTaskItem,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        users: selectedUserIds // Update users with selectedUserIds
      });
  
      MySwal.fire({
        icon: 'success',
        title: 'Task Updated Successfully! คราบบบ',
        showConfirmButton: false,
        timer: 1500
      });
  
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  return (
    <Dialog open={true} onClose={onClose} className='dialogPaper' maxWidth={false}>
      <DialogTitle>Edit Task Item</DialogTitle>
      <DialogContent className="dialogContent">
        <TextField
          name="taskName"
          label="Task Name"
          value={updatedTaskItem.taskName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={updatedTaskItem.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          select
          name="os"
          label="OS"
          value={updatedTaskItem.os}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="ios">iOS</MenuItem>
          <MenuItem value="android">Android</MenuItem>
        </TextField>
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
          <MenuItem value="ready_to_deploy">Ready to Deploy</MenuItem>
          <MenuItem value="ready_to_test">Ready to Test</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          value={updatedTaskItem.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="endDate"
          label="End Date"
          type="date"
          value={updatedTaskItem.endDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          name="priority"
          label="Priority"
          value={updatedTaskItem.priority}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>


        <FormControl className="select-input">
            <InputLabel id="users-label">Users</InputLabel>
            <Select
              labelId="users-label"
              id="users"
              multiple
              value={selectedUserIds}
              onChange={handleChangeUsers}
              fullWidth
            >
              {users && users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>


          </FormControl>
      </DialogContent>
      <DialogActions className="dialogActions">
        <Button onClick={handleCancel} className="button cancelButton">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary" className="button saveButton">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskItem;
