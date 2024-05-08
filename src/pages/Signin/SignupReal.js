import React, { useState } from "react";
import './Login.css'
import { Button, Form, message } from "antd";


import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import DropdownComponent from "../../components/UserDropdown";



const MySwal = withReactContent(Swal)

function Signup() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    username: "",
    imageId: "",
  });
  const signup = async (e) => {

    e.preventDefault()
    try {
      // dispatch(ShowLoading());
      const response = await axios.post("http://localhost:3001/api/auth/register", user);
      // dispatch(HideLoading());
      if (response.data.status === "success") {
        await MySwal.fire({
          title: <strong>{response.data.success}</strong>,
          showConfirmButton: false,
          html: 'Please Keep value to Sign-in',
          icon: 'success',
          timer: 1600
        })
        navigate("/signin");
      } else {
        MySwal.fire({
          title: <strong>{response.data.message}</strong>,
          html: 'Please enter valid value',
          icon: 'error'
        })
      }
    } catch (error) {
      MySwal.fire({
        title: <strong>Please enter Value Form</strong>,
        html: 'form invalid value',
        icon: 'error'
      })
      // dispatch(HideLoading());
      console.log(error);
    }
  };
  return (
    <div className="backgound">
      <div className="bg">
        <div className="signup-holder">
          <form className="signin-form">
            <div className="signup-div">
              <div className="welcome">
                <h4>Sign-Up krab  <i className="fa-solid fa-right-to-bracket" /></h4>
              </div>
             
              <div className="emailinput">
                <div className="emailtext">
                  
                  E-mail
                </div>
                <div className="email">
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
                <div className="passwordtext">
                  Password <small> (must be 6-12 characters)</small>
                </div>
                <div className="password">
                  <input
                    type="password" required
                    className="sigininput"
                    placeholder="Enter password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                </div>
              </div>

              <div class="container">
                <div class="input-group">
                  <label for="firstName" style={{ color: 'black' }}>First Name</label>
                  <input
                    type="text" required
                    className="sigininput"
                    placeholder="Enter your First Name"
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />
                </div>


                <div class="input-group">
                  <label for="lastName" style={{ color: 'black' }}>Last Name</label>
                  <input
                    type="text" required
                    className="sigininput"
                    placeholder="Enter your Last Name"
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                </div>
              </div>

             


             









              <div>
                <button className="back-button" onClick={() => { navigate("/signin") }}>
                  <i className="fa-solid fa-circle-arrow-left"></i> Back
                </button>

                <button type="submit" className="sigup2-button" onClick={signup}>
                  Sign Up
                </button>
              </div>

                         


              

              


            </div>
            
            <br />

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
