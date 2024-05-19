import React, { useState } from "react";
import './Login.css'
import {Form, message } from "antd";

import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    username: "",
    imageId: 1,
    
  
  });
  


  const signup = async (e) => {
    e.preventDefault();
    try {
      const signUpResponse = await axios.post("http://localhost:3001/api/auth/register", user);
  
      if (signUpResponse.data.status === "success") {
        const userId = signUpResponse.data.result[0].id;
  
        // เรียกใช้ handleImageChange เพื่ออัปโหลดไฟล์ภาพ
       const handleImagekrub = await handleImageChange(e); // เรียกใช้โดยไม่ต้องส่งพารามิเตอร์
       console.log("นี่คือ handleImagekrub:", handleImagekrub)

    
  
        await MySwal.fire({
          title: <strong>{signUpResponse.data.success}</strong>,
          showConfirmButton: false,
          html: 'Please Keep value to Sign-in',
          icon: 'success',
          timer: 1600
        });
        navigate("/signin");
      } else {
        MySwal.fire({
          title: <strong>{signUpResponse}</strong>,
          html: 'ผิดนะ ลอง log ค่าออกมาดู',
          icon: 'error'
        });
      }
    } catch (error) {
      MySwal.fire({
        title: <strong>Please enter Value Form</strong>,
        html: 'form invalid value',
        icon: 'error'
      });
      console.error("มีข้อผิดพลาดนะ ลอง log ออกมาดู", error);
    }
  };
  

  const handleImageChange = async (event) => {
    if (event.target && event.target.files) {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
        const mediaObjectResponse = await axios.post("http://localhost:3001/api/media-object", formData);
        const imageId = mediaObjectResponse.data.result[0]; // ดึง ID ของภาพจาก response
        console.log("นี่คือ imageId", imageId);



        setUser({ ...user, imageId }); // อัปเดต user ด้วย imageId ใหม่
       
      } catch (error) {
        console.error("มีข้อผิดพลาดในการอัปโหลดภาพ", error);
      }
    }
  };
  
  
  

  return (
    <div className="backgound">
      <div className="bg">
        <div className="signup-holder">
          <form className="signin-form" onSubmit={signup}>
            <div className="signup-div">
              <div className="welcome">
                <h4>Sign-Up krab  <i className="fa-solid fa-right-to-bracket" /></h4>
              </div>
              
              <div className="emailinput">
                <div className="emailtext">
                  E-mail
                </div>
                <div className="input-group">
                  <input
                    type="text" required
                    className="sigininput"
                    placeholder="Enter e-mail"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="passwordinput">
                <div className="input-group">
                  Password <small> (must be 6-12 characters)</small>
                </div>
                <div className="input-group">
                  <input
                    type="password" 
                    required className="sigininput"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    value={user.password}
                    
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                </div>
              </div>


              <div class="profileinput"> 
                <FormControl className="select-input">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    fullWidth
                  >
                    <MenuItem value="business_analyst">Business Analyst</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
                  </Select>
                </FormControl>
              </div>


       
              <div class="container">
                <div class="input-group">
                  <label htmlFor="firstName" style={{ color: 'black' }}>First Name</label>
                  <input
                    type="text" required
                    className="sigininput"
                    placeholder="Enter your First Name"
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />
                </div>

                <div class="input-group">
                  <label htmlFor="lastName" style={{ color: 'black' }}>Last Name</label>
                  <input
                    type="text" required
                    className="sigininput"
                    placeholder="Enter your Last Name"
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
              <label htmlFor="username" style={{ color: 'black' }}>User name</label>
                  <input
                    type="text" 
                    required className="sigininput"
                    placeholder="Enter Username"
                   
                    value={user.username}
                    
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                  />
                </div>
              


              <div class="container">
                <div class="input-group">
                  <label htmlFor="profileImage" style={{ color: 'black' }}>Profile Image</label>
                  <input
                    type="file" accept="image/*" id="profileImage"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        handleImageChange(e); // เรียกใช้งาน handleImageChange เมื่อมีการเลือกไฟล์ภาพ
                      }
                    }}
                  />
                </div>
              </div>


              <div>
                <button className="back-button" onClick={() => { navigate("/signin") }}>
                  <i className="fa-solid fa-circle-arrow-left"></i> Back
                </button>

                <button type="submit" className="sigup2-button" onClick={handleImageChange}>
                  Sign Up
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
