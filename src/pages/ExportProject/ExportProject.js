import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, Paper, Grid } from "@mui/material";
import { saveAs } from "file-saver";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import './ExportProject.css';

const axiosWithAuth = () => {
  const token = localStorage.getItem("accessToken");
  return axios.create({
    baseURL: "http://localhost:3001/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const ExportProject = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  const handleExport = async () => {
    try {
      const api = axiosWithAuth();
      const response = await api.get("/project/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "projects.xlsx");
    } catch (error) {
      console.error("Error exporting project:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar userRole={userRole} />
      <div className="main-content">
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Typography variant="h4" gutterBottom className="animated-text">
            Export Project Data
          </Typography>
          {userRole === "admin" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleExport}
              className="animated-button"
            >
              Export Project to Excel
            </Button>
          ) : (
            <Typography variant="body1" color="error" className="animated-text">
              You do not have permission to export projects.
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default ExportProject;
