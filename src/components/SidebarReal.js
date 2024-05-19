import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import projectifyLogo from "../img/icon.png"; // import รูปภาพเข้ามา

import "./tree.css";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const Sidebar = () => {
  const userRole = localStorage.getItem("userRole"); // ดึง role ของผู้ใช้จาก localStorage

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={projectifyLogo} alt="Projectify Logo" />
        <div className="sidebar-heading">Projectify</div>
      </div>
      <div className="tabs">
        <ul>
          <li>
            <Link to="/project">Project</Link>
          </li>
          
            <li>
              <Link to="/export-project">Export</Link>
            </li>
        
            {userRole === "admin" && (
            <li>
              <Link to="/user-manage">Management</Link>
            </li>
          )}
        </ul>
       
      </div>
    </div>
  );
};

export default Sidebar;
