// ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetForgetPassword.css';
import './Login.css';

const ResetForgetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }
    try {
        const response = await axios.post(`http://localhost:3001/api/auth/reset-forget-password/${token}`, { password });
        console.log("response:", response)
      if (response.data.status === "success") {
        message.success('Password has been reset successfully.');
        navigate('/signin');
      } else {
        message.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      
      <form className="reset-password-form" onSubmit={handleResetPassword}>
        <h2>Reset Password</h2>
        <div className="form-group">
          <label>New Password</label>
          <input
           
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetForgetPassword;
