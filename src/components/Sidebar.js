import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import projectifyLogo from '../img/icon.png'; // import รูปภาพเข้ามา
import './Sidebar.css'; // สร้างไฟล์ CSS เพื่อสไตล์ Sidebar
import './tree.css'; 

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

      <div className="container">
  <div className="tree">
    <div className="branch" style={{ '--x': 0 }}>
      <span style={{ '--i': 0 }}></span>
      <span style={{ '--i': 1 }}></span>
      <span style={{ '--i': 2 }}></span>
      <span style={{ '--i': 3 }}></span>
    </div>
    <div className="branch" style={{ '--x': 1 }}>
      <span style={{ '--i': 0 }}></span>
      <span style={{ '--i': 1 }}></span>
      <span style={{ '--i': 2 }}></span>
      <span style={{ '--i': 3 }}></span>
    </div>
    <div className="branch" style={{ '--x': 2 }}>
      <span style={{ '--i': 0 }}></span>
      <span style={{ '--i': 1 }}></span>
      <span style={{ '--i': 2 }}></span>
      <span style={{ '--i': 3 }}></span>
    </div>
    <div className="branch" style={{ '--x': 3 }}>
      <span style={{ '--i': 0 }}></span>
      <span style={{ '--i': 1 }}></span>
      <span style={{ '--i': 2 }}></span>
      <span style={{ '--i': 3 }}></span>
    </div>
    <div className="stem">
      <span style={{ '--i': 0 }}></span>
      <span style={{ '--i': 1 }}></span>
      <span style={{ '--i': 2 }}></span>
      <span style={{ '--i': 3 }}></span>
    </div>
    <span className="shadow"></span>
  </div>
</div>


      

      

      

      
    </div>
  );
}

export default Sidebar;
