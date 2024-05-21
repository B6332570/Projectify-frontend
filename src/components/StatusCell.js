import React from 'react';
import Box from '@mui/material/Box';

const StatusCell = ({ status }) => {
  let backgroundColor;
  let displayStatus;
  switch (status) {
    case 'to_do':
      backgroundColor = '#09AEEA'; 
      displayStatus = 'To Do';
      break;
    case 'in_progress':
      backgroundColor = '#4CEAD4'; 
      displayStatus = 'In Progress';
      break;
    case 'on_hold':
      backgroundColor = '#9e9e9e'; 
      displayStatus = 'On Hold';
      break;
    case 'block':
      backgroundColor = '#F56B61'; 
      displayStatus = 'Block';
      break;
    case 'ready_to_deploy':
      backgroundColor = '#74CB80'; 
      displayStatus = 'Ready to Deploy';
      break;
    case 'ready_to_test':
      backgroundColor = '#68A1FF'; 
      displayStatus = 'Ready To Test';
      break;
    case 'done':
      backgroundColor = '#66bb6a'; 
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
    >
      {displayStatus}
    </Box>
  );
};

export default StatusCell;
