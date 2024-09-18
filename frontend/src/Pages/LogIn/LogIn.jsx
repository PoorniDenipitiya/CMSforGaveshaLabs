import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoginImage from "../LogIn/images/loginImage.jpg";
import GoogleIcon from "../LogIn/images/googleIcon.png";
import ShowPassword from "../LogIn/images/showPassword.png";
import hidePassword from "../LogIn/images/hidePassword.png"
import gaveshaLogo from "../LogIn/images/logo.png";
import "./LogIn.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home"; // Default to "/home" if no previous page

  axios.defaults.withCredentials = true;

  const google = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", user);
      console.log("logged in user", res.data);
      const userType = res.data.user.userType;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userType", res.data.user.userType);
      const scrollPosition = location.state?.scrollPosition || 0;
      if (userType === 'admin') {
        navigate("/Admin");
      } else {
        navigate(from, { state: { scrollPosition } });
      }
      window.location.reload();
    } catch (err) {
      if (err.response) {
        alert(err.response.data);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error("Error:", err.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <div className="logindiv">
        <img src={LoginImage} className="LoginImage" alt="login" />
      </div>
      <div className="logindiv">
        <div className="loginTextdiv">
          <form onSubmit={handleLogin}>
            <div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                name="email"
                placeholder="email"
                autoComplete="new-email"
                required
                className="loginInput"
              />
            </div>
            <div className="passwordContainer">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
                className="loginInput"
              />
              <span onClick={togglePasswordVisibility} className="togglePassword">
                {showPassword ? 
                <img src={ShowPassword} className="loginShowPassword" alt="#"/>
                :  <img src={hidePassword} className="loginShowPassword" alt="#"/>}
              </span>
            </div>
            <br />
            <div>
              <button type="submit" className="loginButton">
                Sign In
              </button>
            </div>
          </form>
        </div>
        <div className="loginsubText">
          <Link
            to="/ForgotPassword"
            style={{ textDecoration: "none" }}
            className="loginLink"
          >
            Forgot Password?
          </Link>
        </div>
        <br />
        <div className="loginTextdiv">
          <button onClick={google} className="loginGoogleButton">
            <img src={GoogleIcon} className="LoginGoogleIcon" alt="google icon" />
            Sign in with Google
          </button>
        </div>
        <div className="loginhr">
          <hr className="hrclass" />
        </div>
        <div className="loginTextdiv" style={{ display: "flex" }}>
          <div className="loginText"> Don't Have an Account? </div>
          <Link
            to="/signup"
            style={{ textDecoration: "none" }}
            className="loginLink"
          >
            Signup
          </Link>
        </div>
        <div className="loginText"> Powered By :  <img src={gaveshaLogo} className="loginLogo" alt="Logo of gavesha labs"/> </div>
      </div>
    </div>
  );
}

export default Login;