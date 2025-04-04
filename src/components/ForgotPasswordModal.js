// components/ForgotPasswordModal.js
import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://matrix-backend-henna.vercel.app/account/password/reset/', { email });
      if (response.status === 200) {
        setMessage('Password reset link sent to your email.');
      }
    } catch (error) {
      setMessage('Failed to send password reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              className="neon-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : 'Submit'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;