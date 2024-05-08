import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

import "./resetpasswordpage.css"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function ResetPasswordPage() {
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [password, setPassword] = React.useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const params = useParams();
  const { token } = params;

  const restPassword = async () => {
    try {
      toast.loading("Resetting password...");
      const response = await axios.post(`/api/users/reset-password`, {
        password,
        token,
      });
      toast.remove();
      if (response.data.success) {
        setPasswordResetSuccess(true);
        await MySwal.fire({
          title: <strong>Password reset successfully</strong>,
          showConfirmButton: false,
          icon: 'success',
          timer: 1200
        })
      } else {
        MySwal.fire({
          title: <strong>{response.data.message}</strong>,
          html: 'Please enter valid value',
          icon: 'error'
        })
      }
    } catch (error) {
      MySwal.fire({
        title: <strong>{error.response.data.message}</strong>,
        html: 'Please enter valid value',
        icon: 'error'
      })
    }
  };

  const verifyForgotPasswordToken = async () => {
    try {
      const response = await axios.post(
        `/api/users/verify-forgot-password-token`,
        { token }
      );
      if (!response.data.success) {
        setIsTokenValid(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyForgotPasswordToken();
  }, []);

  return (
    <div className="resetbg">
      <div className="reset-bg">
        <div className="sigin-holder">
          {isTokenValid ? (
            <>
              {!passwordResetSuccess ? (
                <div className="reset-div">
                  <div className="welcome">
                    <h4><i className="fa-solid fa-key"></i>  Reset Password |</h4>
                  </div>
                  <div className="passwordinput">
                    <div className="passwordtext">
                      Password <small> (must be 6-12 characters)</small>
                    </div>
                    <input
                      type="password"
                      className="sigininput"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      className="sigin-button"
                      onClick={restPassword}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-5">
                  <h1 className="text-md font-bold drop-shadow-lg text-[#3d3d3df1]">
                    <b>Your password has been changed</b> <big className="text-[#40a729] hover:text-[#5cc836]">successfully</big> 
                  </h1>
                  <Link to="/signin" className="text-[#bb4408f1] hover:underline">Click Here To Sign-in</Link>
                </div>
              )}
            </>
          ) : (
            <h1>Password Reset Link Is Invalid or Expired</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
