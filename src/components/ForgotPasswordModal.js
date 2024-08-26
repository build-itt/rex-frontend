// components/ForgotPasswordModal.js
import React from 'react';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Forgot Password</h2>
        <div className="input-group">
          <input type="email" placeholder="Enter your email" className="neon-input" />
        </div>
        <button className="btn-submit">Submit</button>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
