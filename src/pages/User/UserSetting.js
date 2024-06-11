import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import "./User.css";
import { Avatar } from "antd";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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

const UserSetting = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]); // เพิ่ม state สำหรับ roles
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    imageId: 0,
    image: "",
    roles: [], // เปลี่ยนเป็น roles
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get("/user/profile");

        const userResponse = response.data.result[0];
        console.log("User data fetched:", userResponse);

        const mediaResponse = await api.get(
          `/media-object/${userResponse.imageId}`
        );
        console.log("mediaResponse:", mediaResponse);

        setUser(userResponse);
        setEditedUser({
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          username: userResponse.username,
          imageId: userResponse.imageId || 0,
          image: mediaResponse.data.result[0].url,
          roles: userResponse.userRoles.map((role) => role.roleId), // ดึง roleId มาเก็บใน state
        });

        // Fetch roles จาก backend และกรอง role ที่ไม่ต้องการออก
        const rolesResponse = await api.get("/role");
        let filteredRoles = rolesResponse.data.result;

        // ถ้าไม่ใช่ admin ให้กรอง role ออก
        if (
          !userResponse.userRoles.some((role) => role.role.role === "admin")
        ) {
          filteredRoles = filteredRoles.filter((role) => role.id !== 3);
        }

        console.log("filteredRoles", filteredRoles);
        setRoles(filteredRoles); // ตั้งค่า roles ที่กรองแล้ว
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoleChange = (event) => {
    setEditedUser((prevState) => ({
      ...prevState,
      roles: event.target.value, // อัปเดต roles เป็น array ของ roleId
    }));
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

  const handleImageChange = async (event) => {
    if (event.target && event.target.files) {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      const api = axiosWithAuth();

      try {
        const mediaObjectResponse = await axios.post(
          "http://localhost:3001/api/media-object",
          formData
        );
        const imageId = mediaObjectResponse.data.result[0].id;
        console.log("Image uploaded, imageId:", imageId);

        const mediaResponse = await api.get(`/media-object/${imageId}`);
        console.log("mediaResponse:", mediaResponse);

        setEditedUser((prevState) => ({
          ...prevState,
          imageId: imageId,
          image: mediaResponse.data.result[0].url,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = axiosWithAuth();
      const updatedUserData = {
        firstName: editedUser.firstName || user.firstName,
        lastName: editedUser.lastName || user.lastName,
        username: editedUser.username || user.username,
        roles: editedUser.roles, // ส่ง roles ในรูปแบบ array ของ roleId
        imageId: editedUser.imageId || user.imageId,
      };

      console.log("Updated user data to be sent:", updatedUserData);
      const updateUserResponse = await api.patch(`/user`, updatedUserData);

      console.log("Update User Response:", updateUserResponse);

      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จแล้ว !!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: "กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="backgroundbobweb">
      <div className="flex">
        <Sidebar />
        <Navbar />

        {user && (
          <Card className="user-card">
            <CardContent>
              <Box display="flex" alignItems="center" flexDirection="column">
                <Avatar
                  crossOrigin="anonymous"
                  size={{ xxl: 150 }}
                  alt={user.firstName}
                  src={editedUser.image}
                  sx={{ width: 100, height: 100, mb: 2 }}
                  onLoad={() =>
                    console.log(`Image loaded: ${editedUser.image}`)
                  }
                  onError={(e) =>
                    console.error(
                      `Image failed to load: ${editedUser.image}`,
                      e
                    )
                  }
                />
                <Typography variant="h5" gutterBottom marginTop={5}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Divider sx={{ my: 2, width: "100%" }} />
                <Typography variant="h5" gutterBottom sx={{ mb: 6 }}>
                  User Information
                </Typography>
                <form onSubmit={handleSubmit} className="user-form">
                  <TextField
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    fullWidth
                    className="user-select-focus"
                    sx={{
                      mb: 6,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#C4C4C4 !important" },
                        "&:hover fieldset": {
                          borderColor: "#C4C4C4 !important",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#a0a0a0 !important",
                        },
                        "&.Mui-focused": { outline: "none !important" },
                      },
                      "& .MuiFormLabel-root": {
                        color: "#666666 !important",
                        "&.Mui-focused": {
                          color: "#666666 !important",
                        },
                      },
                    }}
                  />
                  <TextField
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    className="user-select-focus"
                    value={editedUser.firstName}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      mb: 6,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#C4C4C4" },
                        "&:hover fieldset": { borderColor: "#C4C4C4" },
                        "&.Mui-focused fieldset": { borderColor: "#a0a0a0" },
                        "&.Mui-focused": { outline: "none" },
                      },
                      "& .MuiFormLabel-root": {
                        color: "#666666",
                        "&.Mui-focused": {
                          color: "#666666",
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    className="user-select-focus"
                    value={editedUser.lastName}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      mb: 6,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#C4C4C4" },
                        "&:hover fieldset": { borderColor: "#C4C4C4" },
                        "&.Mui-focused fieldset": { borderColor: "#a0a0a0" },
                      },
                      "& .MuiFormLabel-root": {
                        color: "#666666",
                        "&.Mui-focused": {
                          color: "#666666",
                        },
                      },
                    }}
                  />

                  {/* เพิ่ม select สำหรับเลือก role */}
                  <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel
 
                    >Role
                    </InputLabel>
                    <Select
                    label="Role"
                      multiple
                      value={editedUser.roles}
                      onChange={handleRoleChange}
                      renderValue={(selected) =>
                        selected
                          .map((roleId) => getRoleDisplayName(roleId))
                          .join(", ")
                      }
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {getRoleDisplayName(role.id)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div className="user-input-group">
                    <label htmlFor="profileImage" style={{ color: "black" }}>
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="profileImage"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleImageChange(e);
                        }
                      }}
                    />
                  </div>

                  <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{
              backgroundColor: "#464747",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
            }}
            
            
          >
            Edit User information
          </Button>
                </form>
              </Box>
            </CardContent>
            <Link
              to={`/reset-password/${user.id}`}
              className="reset-password-link"
              sx ={{ marginBottom: "20px"}}
            >
              Want to reset password?
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserSetting;
