import React, { useState, useEffect } from 'react';
import axios from 'axios'; // นำเข้า Axios
import './ProfileCard.css';

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

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = axiosWithAuth();
        const responseKrub = await api.get("/user/profile");
        const userData = responseKrub.data.result[0];
        console.log("userData จาก profileCard จ้า:", userData)
        setUser(userData);

        const mediaResponse = await api.get(`/media-object/${userData.data.result[0].imageId}`);
        console.log("นี่คือ mediaResponse", mediaResponse)
        setUser(prevState => ({
          ...prevState,
          image: mediaResponse.data.result[0].filePath // เพิ่ม URL ของรูปโปรไฟล์เข้าไปในข้อมูลผู้ใช้
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    // Redirect to login page
    window.location.href = "/signin";
  };

  return (
    <div className="profile-card">
      {user && (
        <>
          <div className="profile-header">
            <img src={user.image} alt="Profile" className="profile-image" />
            <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
          </div>
          <div className="profile-details">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Location:</strong> {user.location}</p>
            {/* Add more details as needed */}
            <button onClick={handleLogout}>Logout</button> {/* or <a href="#" onClick={handleLogout}>Logout</a> */}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileCard;
