// components/ForgotPasswordModal.js
import React, { useState } from 'react';
import './ForgotPasswordModal.css';
import { authService } from '../services/api';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await authService.forgotPassword(email);
      setMessage('Password reset link sent to your email.');
      setIsError(false);
      
      // Auto-close the modal after success (optional)
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setMessage(`Email error: ${error.response.data.email[0]}`);
        } else if (error.response.data.detail) {
          setMessage(error.response.data.detail);
        } else {
          setMessage('Failed to send password reset link. Please try again.');
        }
      } else {
        setMessage('Failed to send password reset link. Please try again.');
      }
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
        {message && (
          <p className={`message ${isError ? 'error-message' : 'success-message'}`}>
            {message}
          </p>
        )}
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;