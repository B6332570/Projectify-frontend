import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Divider} from 'antd';
import './User.css';
import { Typography, TextField, Button } from '@mui/material';


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

const UserSetting = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ 
    firstName: '', 
    lastName: '' 
});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get("/user/profile");

        const userResponse = response.data.result[0];
        console.log("Log ข้อมูล user มาดูหน่อยดิ๊:",userResponse)
        setUser(userResponse);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = axiosWithAuth();
      const UpdateUserResponse = await api.patch(`/user/${user.id}`, editedUser);
      
      console.log("Log อัพเดตข้อมูล user มาดูหน่อยดิ๊:",UpdateUserResponse)


    //   console.log('User updated successfully:', response.data);
      // Optional: Show a success message or perform additional actions upon successful update
    } catch (error) {
      console.error('Error updating user:', error);
      // Optional: Handle error scenarios (e.g., display error message to user)
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <Navbar />
      <div className="user-box">
        <Typography variant="h4" gutterBottom>User Settings</Typography>
        {user && (
          <div>
            <Typography variant="h5" gutterBottom>User Information</Typography>
            <Typography variant="body1" gutterBottom>First Name: {user.firstName}</Typography>
            <Typography variant="body1" gutterBottom>Last Name: {user.lastName}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>Edit User Information</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="First Name"
                variant="outlined"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default UserSetting;
