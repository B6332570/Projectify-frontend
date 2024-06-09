import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, TextField, Button, Box, Card, CardContent, colors } from "@mui/material";
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Avatar } from 'antd';
import { Divider } from "antd";
import './ResetPassword.css';
import './User.css';

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

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("User ID for password reset:", id);
  }, [id]);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3001/api/auth/${id}/reset-password`, { oldPassword, password });
      if (response.data.status === "success") {
        message.success('Password has been reset successfully.');
        navigate('/signin');
      } else {
        message.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

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
        setUser({
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

  return (
    <div className="backgroundbobweb">
    <div className="flex">
      <Sidebar />
      <Navbar />
     
        
          {user && (
            <Card className="user-card">
              <CardContent>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Avatar
                    crossOrigin="anonymous"
                    size={{ xxl: 150 }}
                    alt={user.firstName}
                    src={user.image}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom marginTop={5} sx={{ fontWeight:"700"}}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Divider className="custom-divider" sx={{ my: 2, width: "100%"}} />


                  <form className="user-form" onSubmit={handleResetPassword}>
                    <Typography variant="h5" gutterBottom  sx={{ mb: 6 ,fontWeight:"700"}}>
                      Reset Password
                    </Typography>
                    <TextField
                      label="Old Password"
                      type="password"
                      variant="outlined"
                      required
                      fullWidth
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      sx={{
                        mb: 6,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#C4C4C4' },
                          '&:hover fieldset': { borderColor: '#C4C4C4' },
                          '&.Mui-focused fieldset': { borderColor: '#a0a0a0' },
                        },
                        '& .MuiFormLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': {
                            color: '#666666',
                          },
                        },
                      }}
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      variant="outlined"
                      required
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        mb: 6,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#C4C4C4' },
                          '&:hover fieldset': { borderColor: '#C4C4C4' },
                          '&.Mui-focused fieldset': { borderColor: '#a0a0a0' },
                        },
                        '& .MuiFormLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': {
                            color: '#666666',
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      variant="outlined"
                      required
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{
                        mb: 6,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#C4C4C4' },
                          '&:hover fieldset': { borderColor: '#C4C4C4' },
                          '&.Mui-focused fieldset': { borderColor: '#a0a0a0' },
                        },
                        '& .MuiFormLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': {
                            color: '#666666',
                          },
                        },
                      }}
                     
                     
                    />
                    <Button type="submit" variant="contained"  sx={{ backgroundColor: '#333333', color: '#ffffff', '&:hover': { backgroundColor: '#3f3f3f' } }} >
                      Reset Password
                    </Button>
                  </form>
                  <Button variant="contained"  onClick={() => navigate(-1)} style={{ marginTop: '20px' }} sx={{ backgroundColor: '#333333', color: '#ffffff', '&:hover': { backgroundColor: '#3f3f3f' } }}>
                    Back
                  </Button>
                </Box>
              </CardContent>
              
            </Card>
          )}
        </div>
      </div>
   
  );
};

export default ResetPassword;
