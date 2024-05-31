import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import './Navbar.css';

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

const Navbar = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const responseProfile = await api.get("/user/profile");
        const userResponse = responseProfile.data.result[0];
        setUserProfile(userResponse);

        const mediaResponse = await api.get(`/media-object/${userResponse.imageId}`);
        setUserProfile(prevState => ({
          ...prevState,
          image: mediaResponse.data.result[0].url
        }));

        const responseUsers = await api.get("/user");
        const userList = responseUsers.data.result;
        const currentUser = userList.find(user => user.id === userResponse.id);
        if (currentUser) {
          setUserRole(currentUser.role);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAccountClick = () => {
    window.location.href = "/user-setting";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    window.location.href = "/signin";
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'developer':
        return 'Developer';
      case 'business_analyst':
        return 'Business Analyst';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  return (
    <nav className="navbar">
      <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            {/* Navbar content */}
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="inherit" sx={{ mr: 2 }}>
              {userProfile && `${userProfile.firstName} ${userProfile.lastName}`}
            </Typography>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {userProfile && userProfile.image && (
                <img crossOrigin='anonymous' alt="Profile" src={userProfile.image} className="profile-icon" />
              )}
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              MenuListProps={{ className: "navbar-menu-list" }}
            >
              <Card sx={{
                minWidth: 300,
                boxShadow: 3,
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '15px',
                textAlign: 'center',
                padding: '20px',
                background: '#f3f4f6',
              }}>
                <CardMedia
                  crossOrigin="anonymous"
                  component="img"
                  height="150"
                  image={userProfile && userProfile.image}
                  alt="Profile picture"
                  sx={{
                    objectFit: "cover",
                    width: "150px",
                    height: "150px",
                    borderRadius: '50%',
                    margin: '0 auto'
                  }}
                />
                <CardContent sx={{
                  textAlign: 'center',
                  color: '#333',
                  padding: '20px 20px 40px',
                }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {userProfile && `${userProfile.firstName} ${userProfile.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Username: {userProfile && userProfile.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Role: <span style={{ color: userRole === 'admin' ? '#e5c100' : 'inherit' }}>{getRoleDisplayName(userRole)}</span>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button onClick={handleAccountClick} variant="contained" sx={{ backgroundColor: '#f6d2d2', color: '#464747', '&:hover': { backgroundColor: '#f4c6c6' } }}>
                      Edit Profile
                    </Button>
                    <Button onClick={handleLogout} variant="contained" sx={{ backgroundColor: '#464747', color: '#f6d2d2', '&:hover': { backgroundColor: '#3f3f3f' } }}>
                      Logout
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Navbar;
