import React, { useState } from 'react';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';
import { authService, paymentService } from '../services/api';

const SignInPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Use the centralized API service for login
      const response = await authService.login({
        email,
        password,
      });

      const { token, username, email: userEmail, total_products, id } = response.data;

      // Store user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, email: userEmail, total_products, id }));

      try {
        // Fetch balance using the centralized API service
        const balanceResponse = await paymentService.getBalance();
        const { balance } = balanceResponse.data;
        localStorage.setItem('balance', balance);
      } catch (error) {
        console.error('Failed to fetch balance', error);
        // Continue even if balance fetch fails
      }

      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Better error handling
      if (error.response) {
        // Server responded with an error
        if (error.response.data && error.response.data.non_field_errors) {
          setErrorMessage(error.response.data.non_field_errors[0]);
        } else if (error.response.data && error.response.data.detail) {
          setErrorMessage(error.response.data.detail);
        } else {
          setErrorMessage('Invalid credentials. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage('Server not responding. Please try again later.');
      } else {
        // Other errors
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }

    // Clear error message after 5 seconds
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="signin-container">
      <div className="form-container">
        <h1 className="signin-title">Sign In</h1>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <input
              type="email"
              className="neon-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="neon-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container-login">
            <button type="submit" className="btn btn-submit" disabled={isLoading}>
              {isLoading ? <div className="loader"></div> : 'Login'}
            </button>
          </div>
        </form>

        <div className="helper-links">
          <button className="neon-link" onClick={openModal}>Reset Password</button>
          <button className="neon-link" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>
      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default SignInPage;
