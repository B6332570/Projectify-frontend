import React, { useState, useEffect } from "react";
import './Login.css';
import './Signup.css';
import { Form, message } from "antd";
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    roles: [],
    firstName: "",
    lastName: "",
    username: "",
    imageId: 1,
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from API
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/role");
        console.log("All Role", response.data.result);
        const rolesData = Array.isArray(response.data.result) ? response.data.result : [];
        console.log("rolesData", rolesData);
        setRoles(rolesData.filter(role => role.role !== 'admin'));
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  const signup = async (e) => {
    e.preventDefault();
    try {
      const signUpResponse = await axios.post("http://localhost:3001/api/auth/register", user);

      if (signUpResponse.data.status === "success") {
        const userId = signUpResponse.data.result[0].id;

        const handleImagekrub = await handleImageChange(e);
        console.log("นี่คือ handleImagekrub:", handleImagekrub);

        await MySwal.fire({
          title: <strong>{signUpResponse.data.success}</strong>,
          showConfirmButton: false,
          html: 'You have signed up successfully.',
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
        const imageId = mediaObjectResponse.data.result[0];
        console.log("นี่คือ imageId", imageId);

        setUser({ ...user, imageId });
      } catch (error) {
        console.error("มีข้อผิดพลาดในการอัปโหลดภาพ", error);
      }
    }
  };

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setUser({
      ...user,
      roles: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const getRoleDisplayName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      // Split role name by underscore, capitalize each word, and join with space
      return role.role
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    return "Unknown Role";
  };

  return (
    <div className="login-page">
      <div className="backgroundbob">
        <div className="bg">
          <div className="sigin-holder">
            <form className="signin-form" onSubmit={signup}>
              <div className="signup-div">
                <div className="welcome">
                  <h5 className="text-3xl ml-2 p-1 font-bold drop-shadow-lg" style={{ display: 'flex', alignItems: 'center' }}>
                    <b className="text-primary">Sign Up</b>
                  </h5>
                </div>
                <br />
                <div className="emailinput">
                  <div className="emailtext">E-mail</div>
                  <div className="signup-input-group">
                    <input
                      type="text"
                      required
                      className="sigininput"
                      placeholder="Enter e-mail"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="passwordinput">
                  <div className="passwordtext">
                    Password <small>(must at least 6 characters)</small>
                  </div>
                  <div className="signup-input-group">
                    <input
                      type="password"
                      required
                      className="sigininput"
                      placeholder="Enter password"
                      autoComplete="current-password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="role-select">
                  <div className="emailtext">Role</div>
                  <FormControl className="custom-form-control" fullWidth>
                    <InputLabel 
                      id="role-label"
                      sx={{
                        color: '#6B7380', // สีในสถานะปกติ
                        '&.Mui-focused': {
                          color: '#6B7380', // เปลี่ยนสีเมื่อ focused
                        },
                      }}
                      >
                        Select your roles
                      </InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      multiple
                      value={user.roles}
                      onChange={handleRoleChange}
                      input={<OutlinedInput label="Select your roles" />}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ccc', // สีขอบปกติ
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ccc', // สีขอบเมื่อ hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgb(159, 159, 159);', // สีขอบเมื่อ focused
                        },
                      }}
                      renderValue={(selected) =>
                        selected
                          .map((roleId) => getRoleDisplayName(roleId))
                          .join(', ')
                      }
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {getRoleDisplayName(role.id)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="container">
                  <div className="signup-input-group">
                    <label htmlFor="firstName" style={{ color: 'black' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="sigininput"
                      placeholder="Enter your First Name"
                      value={user.firstName}
                      onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="container">
                  <div className="signup-input-group">
                    <label htmlFor="lastName" style={{ color: 'black' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="sigininput"
                      placeholder="Enter your Last Name"
                      value={user.lastName}
                      onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="container">
                  <div className="signup-input-group">
                    <label htmlFor="username" style={{ color: 'black' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      className="sigininput"
                      placeholder="Enter Username"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                  </div>
                </div>
                <div className="container">
                  <div className="signup-input-group">
                    <label htmlFor="profileImage" style={{ color: 'black' }}>
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="profileImage"
                      className="sigininput"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleImageChange(e);
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="back-button"
                    onClick={() => {
                      navigate("/signin");
                    }}
                  >
                    <i className="fa-solid fa-circle-arrow-left"></i> Back
                  </button>
                  <button
                    type="submit"
                    className="sigup2-button"
                    onClick={handleImageChange}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
