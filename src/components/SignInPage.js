import React, { useState } from 'react';
import axios from 'axios';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';

const SignInPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post('https://www.erblan-api.xyz/account/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
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
          <button className="neon-link" onClick={openModal}>Forgot Password?</button>
          <button className="neon-link" onClick={() => navigate('/signup')}>
            Click here to Sign Up
          </button>
        </div>
      </div>
      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default SignInPage;
