import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../../Component/Assets/logo.png";
import "./ResetPassword.css"; 
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); 
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      console.log(`Sending request to /resetPassword/${token} with password: ${password}`);
      const response = await axios.post(
        `http://localhost:5000/api/auth/resetPassword/${token}`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error('Error response:', error.response); // Log the error response
      toast.error(error.response.data.error);
    }
  };

    // Function to handle password confirmation
    const handleConfirmPasswordChange = (e) => {
      const { value } = e.target;
      setConfirmPassword(value);
      setPasswordsMatch(password === value); // Check if passwords match
    };

  return (
    <div className="reset-password-container">
      <div className="ResetPasswordSecondaryDiv">
        <div className="logo-text-container">
          <img src={logo} alt="Logo" className="logo" />
          <span className="trivia-text">Trivia</span>
        </div>
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword} className="reset-password-form">
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input onChange={handleConfirmPasswordChange} type="password" name="confirmPassword" placeholder="Confirm Password" required autoComplete="new-confirm-password" />
          {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match.</p>}
          <button type="submit">Continue</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;