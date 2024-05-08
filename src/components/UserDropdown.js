import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleDropdown = () => {
  const [role, setRoles] = useState({
    role: "",
  });
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    // เรียก API เพื่อดึงข้อมูล roles จากตาราง user
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/', role);
        const allRoles = response.data.role;
        // กรองเฉพาะบทบาท 'business_analyst' และ 'developer'
        const filteredRoles = allRoles.filter(role => role === 'busหiness_analyst' || role === 'developer');
        setRoles(filteredRoles);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล role:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div>
      <label htmlFor="userDropdown" style={{ color: 'black' }}>เลือกบทบาท:</label>
      <select id="userDropdown" value={selectedRole} onChange={handleRoleChange}>
        <option value="">กรุณาเลือกบทบาท</option>
        {role.map((role, index) => (
          <option key={index} value={role}>{role}</option>
        ))}
      </select>
    </div>
  );
};

export default RoleDropdown;
