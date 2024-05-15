import React from 'react';
import Box from '@mui/material/Box';

const StatusCell = ({ status }) => {
  let backgroundColor;
  let displayStatus;
  switch (status) {
    case 'to_do':
      backgroundColor = '#f48fb1'; // สีแดง
      displayStatus = 'To Do';
      break;
    case 'in_progress':
      backgroundColor = '#fbc02d'; // สีส้ม
      displayStatus = 'In Progress';
      break;
    case 'on_hold':
      backgroundColor = '#9e9e9e'; // สีเทา
      displayStatus = 'On Hold';
      break;
    case 'block':
      backgroundColor = '#9c27b0'; // สีม่วง
      displayStatus = 'Block';
      break;
    case 'ready_to_deploy':
      backgroundColor = '#1e88e5'; // สีฟ้า
      displayStatus = 'Ready to Deploy';
      break;
    case 'ready_to_test':
      backgroundColor = '#43a047'; // สีเขียว
      displayStatus = 'Ready To Test';
      break;
    case 'done':
      backgroundColor = '#66bb6a'; // สีเขียวอ่อน
      displayStatus = 'Done';
      break;
    default:
      backgroundColor = '#bdbdbd'; // สีเทาอ่อน
      displayStatus = 'Unknown';
  }

  return (
    <Box
      sx={{
        marginLeft: '40px',
        width: '300px',
        height: '60px',
        backgroundColor: backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px', // ปรับให้เป็นสี่เหลี่ยม
        color: 'white',
        position: 'relative'
      }}
    >
      <span>{displayStatus}</span>
    </Box>
  );
};

export default StatusCell;
