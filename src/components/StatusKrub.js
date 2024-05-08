// StatusKrub.js

import React from 'react';
import TableCell from '@mui/material/TableCell';

const StatusKrub = ({ status }) => {
  return (
    <TableCell
      align="right"
      style={{
        flex: 1,
        borderRadius: '50%', // ทำให้เป็นวงกลม
        width: '20px',
        height: '20px',
        backgroundColor: status === 'Completed' ? '#90caf9' : '#f48fb1', // เปลี่ยนสีเป็นสีมินิมอล
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white' // เพิ่มสีข้อความเป็นขาว
      }}
    >
      {status}
    </TableCell>
  );
};

export default StatusKrub;
