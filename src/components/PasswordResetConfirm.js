import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SignInPage.css';

const PasswordResetConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://matrix-backend-henna.vercel.app/account/passwordreset/confirm/', {
        token,
        password,
      });
      if (response.status === 200) {
        setMessage('Password has been reset successfully.');
        navigate('/signin'); // Redirect to sign-in page after successful reset
      }
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="form-container">
      <h2>Password Reset</h2>
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
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetConfirm;