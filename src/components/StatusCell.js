import React from 'react';
import Box from '@mui/material/Box';

const StatusCell = ({ status, className }) => {
  let backgroundColor;
  let displayStatus;
  switch (status) {
    case 'to_do':
      backgroundColor = '#86c5da'; 
      displayStatus = 'To Do';
      break;
    case 'in_progress':
      backgroundColor = '#1E90FF'; 
      displayStatus = 'In Progress';
      break;
    case 'on_hold':
      backgroundColor = '#B0B0B0'; 
      displayStatus = 'On Hold';
      break;
    case 'block':
      backgroundColor = '#FF4500'; 
      displayStatus = 'Block';
      break;
    case 'ready_to_deploy':
      backgroundColor = '#006400'; 
      displayStatus = 'Ready to Deploy';
      break;
    case 'ready_to_test':
      backgroundColor = '#8A2BE2'; 
      displayStatus = 'Ready To Test';
      break;
    case 'done':
      backgroundColor = '#3eb03e'; 
      displayStatus = 'Done';
      break;
    default:
      backgroundColor = '#bdbdbd'; 
      displayStatus = 'Unknown';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        backgroundColor: backgroundColor,
        color: 'white',
        padding: '8px 16px',
        fontSize: '16px',
        fontWeight: '400',
        textAlign: 'center',
      }}
      className={className}
    >
      {displayStatus}
    </Box>
  );
};

export default StatusCell;
