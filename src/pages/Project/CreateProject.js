import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import './CreateProject.css'; // Import CSS file
import axios from 'axios'; // Import Axios for making API requests
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const axiosWithAuth = () => {
  const token = localStorage.getItem("accessToken");

  return axios.create({
    baseURL: "http://localhost:3001/api", // ตั้งค่า baseURL ของ API
    headers: {
      Authorization: `Bearer ${token}`, // ส่ง AccessToken ใน header
      "Content-Type": "application/json", // ตั้งค่า Content-Type ให้เป็น JSON
    },
  });
};

const CreateProject = ({ open, onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [user, setUsers] = useState([]); // State to store users data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const usersResponse = await api.get("/user");
        const users = usersResponse.data.result;
        setUsers(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };

  const handleSubmit = async () => {
    if (!projectName.trim() || !description.trim()) {
      MySwal.fire({
        title: 'Error',
        text: 'กรุณากรอกข้อมูลให้ถูกต้อง',
        icon: 'error',
        showConfirmButton: true,
      });
      return;
    }
  
    try {
      const api = axiosWithAuth();
      const formData = {
        projectsName: projectName,
        description: description, // Add description to form data
      };
      const projectsResponse = await api.post("/project", formData);
      
      const status = projectsResponse.data.status;
      console.log(status);
  
      if (status === "success") {
        console.log('Project data submitted successfully.');
        onClose(); // ปิด Modal ก่อน
        await MySwal.fire({
          title: <strong>{status}</strong>,
          showConfirmButton: false,
          html: 'Create Project Successfully',
          icon: 'success',
          timer: 1500
        });
        onCreate(); // Refresh หน้า
      } else {
        console.error('Failed to submit project data. Server returned status:', status);
      }
    } catch (error) {
      console.error("Error post data:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-container create-project-focus">
        <div className="modal-header">
          <Typography variant="h6">
            New Project
          </Typography>
        </div>
        <TextField 
          label="Project Name" 
          value={projectName} 
          onChange={handleProjectNameChange} 
          style={{ marginBottom: '20px' }} 
          fullWidth 
          sx={{
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#847d7d', // สีที่ต้องการ
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#847d7d', // สีของ border ที่ต้องการ
              borderWidth: '2px', // ความกว้างของ border ที่ต้องการ
            },
          }}
        />
        <TextField 
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          style={{ marginBottom: '20px' }} 
          fullWidth
          multiline
          rows={4}
          sx={{
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#847d7d', // สีที่ต้องการ
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#847d7d', // สีของ border ที่ต้องการ
              borderWidth: '2px', // ความกว้างของ border ที่ต้องการ
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#C4C4C4', // ตั้งค่าให้เป็นสีเดียวกับปกติ
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#847d7d', // สีของ border ที่ต้องการเมื่อ focused
              borderWidth: '2px', // ความกว้างของ border ที่ต้องการเมื่อ focused
            },
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            className="button-save" 
            onClick={handleSubmit}
            style={{
              backgroundColor: "#e78080",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px"
            }}
          >
            Create
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default CreateProject;
