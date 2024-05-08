import React, { useState, useEffect } from 'react';
import axios from 'axios'; // นำเข้า Axios
import './Navbar.css';
import ProfileCard from './ProfileCard'; // นำเข้า ProfileCard component

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

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false); // state เพื่อแสดง/ซ่อน Profile Card
  const [userProfile, setUserProfile] = useState(null); // state เพื่อเก็บข้อมูลผู้ใช้
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get("/user/profile");
        const userResponse = response.data.result[0].imageId
        console.log("นี่คือ userResponse จาก Navbar", userResponse)
        

        setUserProfile(userResponse); // เซ็ตข้อมูลผู้ใช้ใน state

        // ดึงข้อมูลรูปภาพโปรไฟล์จาก media-object
        const mediaResponse = await api.get(`/media-object/${userResponse}`);
        console.log("นี่คือ mediaResponse จาก Navbar", mediaResponse)

        setUserProfile(prevState => ({
          ...prevState,
          image: mediaResponse.data.result[0].filePath // เพิ่ม URL ของรูปโปรไฟล์เข้าไปในข้อมูลผู้ใช้
        }));
      } catch (error) {
        console.error("Error fetching data งุ:", error);
      }
    };

    fetchData();
  }, []);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="/" className="nav-link">Home</a>
        </li>
        <li className="nav-item">
          <a href="/about" className="nav-link">About</a>
        </li>
        <li className="nav-item">
          <a href="/contact" className="nav-link">Contact</a>
        </li>
        <li className="nav-item profile" onClick={toggleProfile}>
          {userProfile && userProfile.image && (
            <img src={userProfile.image} alt="Profile" className="profile-icon" />
          )}
          {showProfile && <ProfileCard />}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
