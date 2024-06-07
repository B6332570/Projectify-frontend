import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import projectifyLogo from '../../img/logopink.png';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

function Signin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const validateEmail = (email) => {
    // Regex pattern for validating email
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const signin = async (e) => {
    e.preventDefault();

    if (!validateEmail(user.username)) {
      MySwal.fire({
        title: <strong>Error</strong>,
        html: "Please enter a valid email address",
        icon: "error",
      });
      return;
    }

    if (user.password.length < 6) {
      MySwal.fire({
        title: <strong>Error</strong>,
        html: "Password must be at least 6 characters",
        icon: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        user
      );
      console.log(response)

      if (response.data.status === "success") {
        await MySwal.fire({
          title: <strong >{response.data.message}</strong>,
          showConfirmButton: false,
          html: "Login Successfully",
          icon: "success",
          timer: 1500,
        });
        const accessToken = response.data.result[0].accessToken;
        const role = response.data.result[0].roles;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userRole", role);

        navigate("/project");
      } else {
        MySwal.fire({
          title: <strong>{response.data.message}</strong>,
          html: "Please enter valid value",
          icon: "error",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: <strong>Something went wrong</strong>,
        html: "Please enter valid value",
        icon: "error",
      });

      console.log(error);
    }
  };

  return (
    <div className="backgroundbob">
      <div className="bg">
        <div className="sigin-holder">
          <form className="signin-form">
            <div className="sigin-div">
              <div className="welcome">
              <h4 className="text-3xl ml-2 p-1 font-bold drop-shadow-lg" style={{ display: 'flex', alignItems: 'center' }}>
  <img src={projectifyLogo} alt="Projectify Logo" style={{ height: '50px', marginRight: '10px' }} />
  <b className="text-primary">Projectify</b>
</h4>
              </div>

              <div className="emailinputsignin">
                <div className="emailtext">Email</div>
                <div className="email">
                  <input
                    type="text"
                    required
                    className="sigininput"
                    placeholder="Enter email"
                    value={user.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="passwordinputsignin">
                <div className="passwordtext">
                  Password <small> (must be at least 6 characters)</small>
                </div>
                <div className="password">
                  <input
                    type="password"
                    required
                    className="sigininput"
                    placeholder="Enter password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="sigin-button" onClick={signin}>
                  Sign in
                </button>
              </div>

              <span
                className="signupspan"
                onClick={() => navigate("/forget-password")}
              >
                Forgot Your Password ?
              </span>
              <span className="signup">
                Don't have an account ?
                <span
                  className="signupspan"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </span>
              </span>
            </div>
            <br />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
