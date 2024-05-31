import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './CreateProject.css'; // Import CSS file
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 
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

const CreateProject = ({ open, onClose }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [projectName, setProjectName] = useState('');
  const [owner, setOwner] = useState('');
  const [user, setUsers] = useState([]); // State to store users data
  // const [projectCreationStatus, setProjectCreationStatus] = useState(null); // State for project creation status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const usersResponse = await api.get("/user");

        // const users = usersResponse.data.result[0].data;
        const users = usersResponse.data.result;
        setUsers(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const api = axiosWithAuth();
      const formData = {
        projectsName: projectName,
      };
      const projectsResponse = await api.post("/project", formData);
      
      const status = projectsResponse.data.status;
      console.log(status);
  
      if (status === "success") {
        console.log('Project data submitted successfully.');
        onClose(); // ปิด Modal หลังจากที่โปรเจคถูกสร้างเรียบร้อยแล้ว
        await MySwal.fire({
          title: <strong>{status}</strong>,
          showConfirmButton: false,
          html: 'Create Project Successfully',
          icon: 'success',
          timer: 1500
        });
      } else {
        console.error('Failed to submit project data. Server returned status:', status);
      }
    } catch (error) {
      console.error("Error post data:", error);
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
            New Project
        </div>
        <TextField label="Project Name" value={projectName} onChange={handleProjectNameChange} className="textfield-input" fullWidth />
     
        <div className="description-editor">
          Title
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
        </div>
        <Button variant="contained" color="primary" className="button-save" fullWidth onClick={handleSubmit}>
          Create
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateProject;
