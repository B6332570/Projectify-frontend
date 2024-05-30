import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Typography, Collapse } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import projectifyLogo from '../img/logopink.png';
import InboxIcon from '@mui/icons-material/Inbox';
import ExportIcon from '@mui/icons-material/ExitToApp';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Sidebar = ({ handleCreateProjectClick }) => {
  const theme = useTheme();
  const userRole = localStorage.getItem('userRole');
  const [openProject, setOpenProject] = useState(false);
  const [openManage, setOpenManage] = useState(false);

  useEffect(() => {
    // Load the initial state from localStorage
    const savedOpenProject = localStorage.getItem('openProject') === 'true';
    const savedOpenManage = localStorage.getItem('openManage') === 'true';
    setOpenProject(savedOpenProject);
    setOpenManage(savedOpenManage);
  }, []);

  const handleProjectClick = () => {
    setOpenProject(prevOpenProject => {
      const newState = !prevOpenProject;
      localStorage.setItem('openProject', newState);
      return newState;
    });
  };

  const handleManageClick = () => {
    setOpenManage(prevOpenManage => {
      const newState = !prevOpenManage;
      localStorage.setItem('openManage', newState);
      return newState;
    });
  };

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 250,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 250,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
      color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
    },
  }));

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#e0e0e0' : '#4d4d4d',
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
    },
  }));

  return (
    <StyledDrawer variant="permanent">
      <Box component={Link} to="/project" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2, textDecoration: 'none' }}>
        <img src={projectifyLogo} alt="Projectify Logo" style={{ width: 60, height: 60, marginRight: 8 }} />
        <Typography variant="h6" noWrap component="div" sx={{ color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff' }}>
          Projectify
        </Typography>
      </Box>
      <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff' }} />
      <List>
        <StyledListItem button onClick={handleProjectClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Project" />
          {openProject ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem>
        <Collapse in={openProject} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledListItem button component={Link} to="/project" sx={{ pl: 4 }}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </StyledListItem>
            <StyledListItem button onClick={handleCreateProjectClick} sx={{ pl: 4 }}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Project" />
            </StyledListItem>
          </List>
        </Collapse>
        <StyledListItem button component={Link} to="/export-project">
          <ListItemIcon>
            <ExportIcon />
          </ListItemIcon>
          <ListItemText primary="Export" />
        </StyledListItem>
        {userRole === 'admin' && (
          <>
            <StyledListItem button onClick={handleManageClick}>
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="Management" />
              {openManage ? <ExpandLess /> : <ExpandMore />}
            </StyledListItem>
            <Collapse in={openManage} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <StyledListItem button component={Link} to="/user-manage" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="User" />
                </StyledListItem>
                <StyledListItem button component={Link} to="/project-manage" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Project" />
                </StyledListItem>
              </List>
            </Collapse>
          </>
        )}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
