import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignInPage.css';
import { authService } from '../services/api';

const PasswordResetConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }

    if (!token) {
      setIsError(true);
      setMessage('Reset token is missing. Please use the link from your email.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await authService.resetPassword({
        token,
        password,
      });
      
      setMessage('Password has been reset successfully. Redirecting to login...');
      setIsError(false);
      
      // Redirect to sign-in page after successful reset with a small delay
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        if (error.response.data.token) {
          setMessage(`Token error: ${error.response.data.token[0]}`);
        } else if (error.response.data.password) {
          setMessage(`Password error: ${error.response.data.password[0]}`);
        } else if (error.response.data.detail) {
          setMessage(error.response.data.detail);
        } else {
          setMessage('Failed to reset password. Please try again.');
        }
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="form-container">
        <h2>Password Reset</h2>
        {message && (
          <div className={isError ? "error-message" : "success-message"}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter new password"
              className="neon-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm new password"
              className="neon-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : 'Reset Password'}
          </button>
        </form>
        <div className="helper-links">
          <button className="neon-link" onClick={() => navigate('/signin')}>
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;