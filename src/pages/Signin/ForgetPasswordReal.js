import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, message } from 'antd';
import './Login.css';
import Signin from './Signin';

import { useNavigate } from "react-router-dom";




const ForgetPassword = () => {
    const navigate = useNavigate();
    return ( 
        
        <div className="backgound">
        <div className="bg">
          <div className="sigin-holder">
            <form className="signin-form">
              <div className="sigin-div">
                <div className="welcome">
                  <h4 className="text-3xl ml-2 p-1 font-bold drop-shadow-lg">
                    <b className="text-primary hover:text-[#ff983d]">Projectify</b>
                  </h4>
                </div>
  
                <div className="emailinput">
                  <div className="emailtext">Email</div>
                  <div className="email">
                    <input
                      type="text"
                      required
                      className="sigininput"
                      placeholder="Enter email"
               
                     
                    />
                  </div>
                </div>
  
            
                <div>
                  <button className="back-button" onClick={() => { navigate("/signin") }}>
                    <i className="fa-solid fa-circle-arrow-left"></i> Back
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
