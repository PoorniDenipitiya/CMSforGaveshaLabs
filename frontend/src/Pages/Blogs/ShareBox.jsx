import React from 'react';
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import './ShareBox.css';

const SharePopup = ({ postUrl, onClose }) => {
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(postUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying to clipboard: ', err);
        alert('Failed to copy URL.');
      });
  };

  return (
    <div className="share-popup">
      <div className="share-popup-content">
        <button onClick={handleWhatsAppShare}>
          <CIcon icon={icon.cibWhatsapp}  className='ShareBoxIcon'/>
         
        </button>
        <button onClick={handleFacebookShare}>
          <CIcon icon={icon.cibFacebookF} className='ShareBoxIcon' />
         
        </button>
        <button onClick={copyToClipboard}>
          <CIcon icon={icon.cilLink} className='ShareBoxIcon' />
      
        </button>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default SharePopup;