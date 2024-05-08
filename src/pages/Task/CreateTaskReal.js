import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

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
      startDate: new Date(), // กำหนดเป็นวันที่และเวลาปัจจุบัน
      endDate: new Date(), // กำหนดเป็นวันที่และเวลาปัจจุบัน
      priority: "",
      taskGroupId: 1,
      
    
    });
    const [taskGroups, setTaskGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [taskItems, setTaskItems] = useState([]);
    const { projectId } = useParams();
    const [data, setData] = useState([]);
    const [openCreateProject, setOpenCreateProject] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

  
    // const handleCreateProjectClick = () => {
    //   setOpenCreateProject(true);
    // };
  
    // const handleCloseCreateProject = () => {
    //   setOpenCreateProject(false);
    // };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const api = axiosWithAuth();
          
          // ดึงข้อมูลโครงการ
          const projectsResponse = await api.get("/project");
          const projects = projectsResponse.data.result;
          console.log("Projects ตรงนี้:", projects); 
          
          
          // Step 1: Fetch all task groups
          const taskGroupsResponse = await api.get(`/task-group`);
          const allTaskGroups = taskGroupsResponse.data.result;
  
          // Step 2: Filter task groups by projectId
          const filteredTaskGroups = allTaskGroups.filter(group => group.projectId == projectId);
  
          // Step 3: Sort task groups by id from smallest to largest
          const sortedTaskGroups = filteredTaskGroups.sort((a, b) => a.id - b.id);
  
          // Step 4: Fetch all task items
          const taskItemsResponse = await api.get(`/task-item`);
          const allTaskItems = taskItemsResponse.data.result;
          console.log("อันนี้ก่อนฟิลเต้อ allTaskItems", allTaskItems)
  
          // Step 5: Filter task items by task group IDs
          const filteredTaskItems = allTaskItems.filter(item => sortedTaskGroups.some(group => group.id === item.taskGroupId));

          console.log("อันนี้หลังฟิลเต้อ filteredTaskItems", filteredTaskItems)


           // Step 6: Update state with sorted and filtered task groups and task items
           


          setTaskGroups(sortedTaskGroups);
          setTaskItems(filteredTaskItems);
         
       
        
          const usersResponse = await api.get("/user");
          setUsers(usersResponse.data.result);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [projectId]);
    

    

    const handleSubmit = async () => {
      try {
        const formData = {
          title: taskItem.title,
          taskName: taskItem.taskName,
          description: taskItem.description,
          os: taskItem.os,
          status: taskItem.status,
          startDate: taskItem.startDate,
          endDate: taskItem.endDate,
          priority: taskItem.priority,
          taskGroupId: taskItem.taskGroupId,
          users: selectedUsers,
        };
    
        console.log('Selected Users:', users); // เช็คค่าที่ถูกเลือก
    
        const api = axiosWithAuth();
    
        const taskItemResponse = await api.post("/task-item", formData);
    
        console.log("Response task-item:", taskItemResponse);
    
        if (taskItemResponse.data.status === "success") {
          console.log('Task data submitted successfully.');
        } else {
          console.error('Failed to submit task data.');
        }
      } catch (error) {
        console.error('Error submitting task data:', error);
      }
    };
    

    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-container">
          <div className="modal-header">
            New Task
          </div>
          <TextField
           label="Task Name" 
           value={taskItem.taskName}
           onChange={(e) => setTaskItem({ ...taskItem, taskName: e.target.value })} 
           className="textfield-input" 
           fullWidth />

          <TextField 
          label="Description" 
          value={taskItem.description} 
          onChange={(e) => setTaskItem({ ...taskItem, description: e.target.value })} 
          className="textfield-input" 
          fullWidth />

          <FormControl className="select-input">
            <InputLabel id="os-label">OS</InputLabel>
            <Select
              labelId="os-label"
              id="os"
              value={taskItem.os}
              onChange={(e) => setTaskItem({ ...taskItem, os: e.target.value })}
            >
              <MenuItem value="android">Android</MenuItem>
              <MenuItem value="ios">iOS</MenuItem>
            </Select>
          </FormControl>
        
          <FormControl className="select-input">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={taskItem.status}
              onChange={(e) => setTaskItem({ ...taskItem, status: e.target.value })}
              fullWidth
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
          <TextField
           type="date"
            label="Start Date"
             value={taskItem.startDate} 
             onChange={(e) => setTaskItem({ ...taskItem, startDate: e.target.value })}
             className="textfield-input" fullWidth />

          <TextField 
          type="date" 
          label="End Date" 
          value={taskItem.endDate} 
          onChange={(e) => setTaskItem({ ...taskItem, endDate: e.target.value })}
          className="textfield-input" 
          fullWidth />

          <FormControl className="select-input">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              value={taskItem.priority}
              onChange={(e) => setTaskItem({ ...taskItem, priority: e.target.value })}
              fullWidth
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
        
            </Select>


          </FormControl>

          
          
          

          <FormControl className="select-input">
            <InputLabel id="users-label">Users</InputLabel>
            <Select
  labelId="users-label"
  id="users"
  multiple
  value={selectedUsers} // ใช้ selectedUsers แทน users
  onChange={(e) => setSelectedUsers(e.target.value)} // ใช้ setSelectedUsers แทน setUsers
  fullWidth
>

            {users && users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
               {user.username} {user.firstName} 
              </MenuItem>
            ))}
          </Select>
          </FormControl>

          <FormControl className="select-input">
            <InputLabel id="task-group-label">Task Group</InputLabel>
            <Select
              labelId="task-group-label"
              id="task-group"
              value={taskItem.taskGroupId}
              onChange={(e) => setTaskItem({ ...taskItem, taskGroupId: e.target.value })}
              fullWidth
            >
              {taskGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.taskGroupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>





          
      

{/* 
          <div className="description-editor">
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
          </div> */}
          <Button variant="contained" color="primary" className="button-save" fullWidth onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Modal>
    );
};

export default CreateTask;
