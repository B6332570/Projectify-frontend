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

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get("/user/profile");
        const userResponse = response.data.result[0];
        setUserProfile(userResponse);

        const mediaResponse = await api.get(`/media-object/${userResponse.imageId}`);
        setUserProfile(prevState => ({
          ...prevState,
          image: mediaResponse.data.result[0].url
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAccountClick = () => {
    // Redirect to UserSetting page
    window.location.href = "/user-setting";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    // Redirect to login page
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

  return (
    <nav className="navbar">
      <AppBar position="static" sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#333333' }}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
         
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
            >
              <Card sx={{
                minWidth: 300,
                boxShadow: 3,
                overflow: 'hidden',
                position: 'relative',
                border: '2px solid #fff',
                color: theme.palette.mode === 'dark' ? '#000000' : '#fff',
                textAlign: 'center',
                padding: '20px',
              }}>
                <CardMedia
                  crossOrigin="anonymous"
                  component="img"
                  height="200"
                  image={userProfile && userProfile.image}
                  alt="Profile picture"
                  sx={{
                    objectFit: "cover",
                    width: "250px",
                    height: "250px"
                  }}
                />
                <CardContent sx={{
                  textAlign: 'center',
                  color: theme.palette.mode === 'dark' ? '#000000' : '#fff',
                  padding: '80px 20px 20px',
                  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  borderTop: '1px solid #fff'
                }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {userProfile && `${userProfile.firstName} ${userProfile.lastName}`}
                  </Typography>
                  <Typography variant="body2">
                    Username: {userProfile && userProfile.username}
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: '#fff' }} />
                  <Button onClick={handleAccountClick} variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
                    Edit Profile
                  </Button>
                  <Button onClick={handleLogout} variant="contained" color="secondary" fullWidth>
                    Logout
                  </Button>
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
