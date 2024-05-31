import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, message } from 'antd';
import './Login.css';
import Signin from './Signin';
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleForgetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/forget-password', { email });

      if (response.data.status === "success") {
        message.success('A password reset link has been sent to your email.');
      } else {
        message.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="backgroundbob">
      <div className="bgforgot">
        <div className="sigin-holder">
          <form className="signin-form" onSubmit={handleForgetPassword}>
            <div className="sigin-div" >
              <div className="welcome"  style={{ marginTop: '100ฃpx' }}>
                <h4 className="text-3xl ml-2 p-1 font-bold drop-shadow-lg">
                  <b className="text-primary">Forgot Password?</b>
                </h4>
                
              </div>
              <p>Enter your email below to receive a password reset link.</p>
              <div className="emailinputsignin">
                <div className="emailtext">Email</div>
                <div className="email">
                  <input
                    type="email"
                    required
                    className="sigininput"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
               
              </div>
              <div></div>
              <div></div>
              
              <div>
              <button className="back-button" onClick={() => { navigate("/signin") }}>
                   Back
                </button>
                <button type="submit" className="sigin-button">
                  Submit
                </button>
               
              </div>
            </div>
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
