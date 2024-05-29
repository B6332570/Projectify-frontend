// UserSetting.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Divider } from "antd";
import { Typography, TextField, Button, Box, Card, CardContent } from "@mui/material";
import './User.css';
import { Avatar } from 'antd';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom"; // import Link from react-router-dom

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
    firstName: "",
    lastName: "",
    username: "",
    imageId: 0,
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get("/user/profile");

        const userResponse = response.data.result[0];
        console.log("User data fetched:", userResponse);

        const mediaResponse = await api.get(`/media-object/${userResponse.imageId}`);
        console.log("mediaResponse:", mediaResponse);

        setUser(userResponse);
        setEditedUser({
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          username: userResponse.username,
          imageId: userResponse.imageId || 0,
          image: mediaResponse.data.result[0].url,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    if (event.target && event.target.files) {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      const api = axiosWithAuth();

      try {
        const mediaObjectResponse = await axios.post(
          "http://localhost:3001/api/media-object",
          formData
        );
        const imageId = mediaObjectResponse.data.result[0].id;
        console.log("Image uploaded, imageId:", imageId);

        const mediaResponse = await api.get(`/media-object/${imageId}`);
        console.log("mediaResponse:", mediaResponse);

        setEditedUser((prevState) => ({
          ...prevState,
          imageId: imageId,
          image: mediaResponse.data.result[0].url,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = axiosWithAuth();
      const updatedUserData = {
        firstName: editedUser.firstName || user.firstName,
        lastName: editedUser.lastName || user.lastName,
        username: editedUser.username || user.username,
        imageId: editedUser.imageId || user.imageId,
      };
      console.log("Updated user data to be sent:", updatedUserData);
      const updateUserResponse = await api.patch(`/user`, updatedUserData);

      console.log("Update User Response:", updateUserResponse);

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จแล้ว !!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        text: 'กรุณาลองใหม่อีกครั้ง',
        showConfirmButton: true
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <Navbar />
      <div className="user-box">
        {user && (
          <Card className="user-card">
            <CardContent>
              <Box display="flex" alignItems="center" flexDirection="column">
                <Avatar
                  crossOrigin="anonymous"
                  size={{ xxl: 150 }}
                  alt={user.firstName}
                  src={editedUser.image}
                  sx={{ width: 100, height: 100, mb: 2 }}
                  onLoad={() => console.log(`Image loaded: ${editedUser.image}`)}
                  onError={(e) => console.error(`Image failed to load: ${editedUser.image}`, e)}
                />
                <Typography variant="h5" gutterBottom marginTop={5}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Divider sx={{ my: 2, width: "100%" }} />
                <Typography variant="h5" gutterBottom    sx={{ mb: 6 }}>
                  Edit User Information
                </Typography>
                <form onSubmit={handleSubmit} className="user-form">
                  <TextField
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 6 }}
                  />
                  <TextField
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    value={editedUser.firstName}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 6 }}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    value={editedUser.lastName}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 6 }}
                  />
                  <div className="input-group">
                    <label htmlFor="profileImage" style={{ color: "black" }}>
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="profileImage"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleImageChange(e);
                        }
                      }}
                    />
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </form>
                <Link to={`/reset-password/${user.id}`} style={{ marginTop: '10px' }}>
                  Want to reset password?
                </Link>
              </Box>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserSetting;
