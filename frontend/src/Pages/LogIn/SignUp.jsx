
import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../LogIn/images/loginImage.jpg";
import GoogleIcon from "../LogIn/images/googleIcon.png";
import gaveshaLogo from "../LogIn/images/logo.png";
import Alert from "../../Component/Alert/Alert";  // Import the Alert component

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Flag to track if passwords match
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  // Function to handle Google signup
  const google = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  }

  // Function to handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    let userType = 'user';
    if (email === 'triviatechnology2024@gmail.com') {
      userType = 'admin';
    }

    // Check if passwords match before submitting
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    const user = {
      username,
      email,
      password,
      userType // include userType in the user object
    };

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", user);
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
      setShowAlert(true);
    }
  };

  // Function to handle password confirmation
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordsMatch(password === value); // Check if passwords match
  };

  return (
    <div className="login"> 
      <div className="logindiv"> 
        <img src={LoginImage} className="LoginImage" alt="login" />
      </div>
      <div className="logindiv"> 
        <div className="loginTextdiv">
          {showAlert && <Alert message={error} onClose={() => setShowAlert(false)} />} {/* Conditionally render the Alert component */}
          <form onSubmit={handleSignup}>
            <div>
              <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" required autoComplete="new-username" className="loginInput" />
            </div>
            <div>
              <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="Email" required autoComplete="new-email" className="loginInput"/>
            </div>
            <div>
              <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" required autoComplete="new-password" className="loginInput"/>
            </div>
            <div>
              <input onChange={handleConfirmPasswordChange} type="password" name="confirmPassword" placeholder="Confirm Password" required autoComplete="new-confirm-password" className="loginInput"/>
              {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match.</p>}
            </div>
            <div>
              <br/>
              <button type="submit" className="loginButton">Sign Up</button>
            </div>
          </form>
        </div>
        <br/>
        <div className="loginTextdiv">
          <button onClick={google} className="loginGoogleButton"> 
          <img src={GoogleIcon} className="LoginGoogleIcon"/> 
          Signup with Google </button>
        </div>
        <div className="loginhr">
          <hr className="hrclass" />
        </div>
        <div className="loginTextdiv" style={{display:"flex"}}> 
          <div className="loginText">  Have an Account? </div>
          <Link to="/login" style={{textDecoration: 'none'}} className="loginLink"> Signin </Link>
        </div>
        <div className="loginText"> Powered By :  <img src={gaveshaLogo} className="loginLogo" alt="Logo of gavesha labs"/> </div>
      </div>
    </div>
  );
}

export default Signup;
