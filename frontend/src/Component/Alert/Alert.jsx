import React from 'react';
import './Alert.css'; // Make sure you have this file for styling

const Alert = ({ message, onClose }) => {
  return (
    <div className="alert-box">
      <div className='alert-up'>
        
      </div>
      <div className="alert-content">
        
        <p>{message}</p> 
        
        <button className="close-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
} 

export default Alert;
