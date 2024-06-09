import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./Login.css";

const ResetForgetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (password.trim() === "" || confirmPassword.trim() === "") {
      message.error("Password fields cannot be empty.");
      return;
    }

    if (password.length < 6) {
      message.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/auth/reset-forget-password/${token}`,
        { password }
      );
      if (response.data.status === "success") {
        message.success("Password has been reset successfully.");
        navigate("/signin");
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="background">
      <div className="bgforgot">
        <div className="sigin-holder">
          <form className="signin-form" onSubmit={handleResetPassword}>
            <div className="sigin-div">
              <div className="welcome">
                <h4 className="text-3xl ml-2 p-1 font-bold drop-shadow-lg">
                  <b className="text-primary ">Reset Password</b>
                </h4>
              </div>

              <div className="passwordinputsignin">
                <div className="passwordtext">
                  New Password <small> (must be at least 6 characters)</small>
                </div>
                <div className="password">
                  <input
                    className="sigininput"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="passwordinputsignin">
                <div className="passwordtext">
                  Confirm New Password
                </div>
                <div className="password">
                  <input
                    className="sigininput"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <br />
              </div>

              <div>
                <button
                  type="submit"
                  className="sigin-button"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetForgetPassword;
