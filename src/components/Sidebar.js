import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import projectifyLogo from '../img/icon.png'; // import รูปภาพเข้ามา
import './Sidebar.css'; // สร้างไฟล์ CSS เพื่อสไตล์ Sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={projectifyLogo} alt="Projectify Logo" />
        <div className='sidebar-heading'>Projectify</div>
      </div>
      <div className="tabs">
        <ul>
          <li><Link to="/project">Project</Link></li>
          {/* <li><Link to="/Task">Task</Link></li> */}
        </ul>
      </div>

      
    </div>
  );
}

export default Sidebar;
