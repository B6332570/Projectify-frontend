import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './CreateProject.css'; // Import CSS file
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 
import axios from 'axios'; // Import Axios for making API requests

const CreateProject = ({ open, onClose }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [projectName, setProjectName] = useState('');
  const [owner, setOwner] = useState('');
  const [user, setUsers] = useState([]); // State to store users data

  useEffect(() => {
    // Fetch users data from backend when the component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users data from backend
      const response = await axios.get('http://localhost:3001/api/user');
      // Set users data to state
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

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
      // Create an object with data to send to the server
      const formData = {
        projectName: projectName,
        owner: owner,
      };

      // Send data to the server using Axios
      const response = await axios.post('http://localhost:3001/api/project', formData);

      // Check if data submission was successful
      if (response.status === 200) {
        // Data submission successful
        console.log('Project data submitted successfully.');
        // Proceed with any additional code for handling successful data submission
      } else {
        // Data submission failed
        console.error('Failed to submit project data.');
      }
    } catch (error) {
      // Error occurred while submitting data
      console.error('Error submitting project data:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      
    >
      <Box className="modal-container"> {/* Apply CSS class */}
        <div className="modal-header">
            New Project
        </div> {/* Header */}
        <TextField label="Project Name" value={projectName} onChange={handleProjectNameChange} className="textfield-input" fullWidth /> {/* Project Name */}
        <FormControl className="select-input"> {/* Owner */}
          <InputLabel id="owner-label" className="select-input" >Owner</InputLabel>
           
          <Select
           
            className="select-input"
            labelId="owner-label"
            id="owner"
            value={owner}
            onChange={handleOwnerChange}
            label="Owner"
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {/* Map through users data and render each user as a MenuItem */}
            {user && user.result && user.result[0] && user.result[0].data.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                </MenuItem>
            ))}

          </Select>
        </FormControl>
        <div className="description-editor"> {/* Description */}
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            toolbar={{
              options: ['inline', 'blockType', 'list', 'textAlign', 'history'],
              inline: {
                options: ['bold', 'italic', 'underline'], // เลือกตัวเลือกที่คุณต้องการ
              },
            }}
          />
        </div>
        <Button variant="contained" color="primary" className="button-save" fullWidth onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateProject;
