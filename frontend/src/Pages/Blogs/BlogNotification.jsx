
import React from 'react';
import './BlogNotification.css';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">X</button>
    </div>
  );
};

export default Notification;
