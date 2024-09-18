import React from 'react';
import './Loader.css'; // Make sure you have this file for styling
import octopusImage from '../Assets/polvo-pepe-bando-do-mar.gif';

export const Loader = () => {
  return (
    <div className="loader-container">
      <img src={octopusImage} alt="" className="loader-image"/>
      <p className="loader-text">Hold on, we're tinkering away to bring your page to life...</p>
    </div>
  );
}

export default Loader;
