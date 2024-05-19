import React from "react";
import { Link } from "react-router-dom";
import projectifyLogo from "../img/icon.png";
import "./Sidebar.css";

const Sidebar = () => {
  const userRole = localStorage.getItem("userRole");

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
