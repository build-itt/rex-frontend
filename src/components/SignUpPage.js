import React, { useState } from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { authService, paymentService } from '../services/api';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      // Use the centralized API service for registration
      const response = await authService.register({
        email,
        username,
        password,
      });

      const { token, username: responseUsername, email: userEmail, total_products, id } = response.data;

      // Store user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ 
        username: responseUsername, 
        email: userEmail, 
        total_products, 
        id 
      }));

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
      console.error('Registration error:', error);
      
      // Better error handling
      if (error.response) {
        // Server responded with an error
        if (error.response.data) {
          // Check for specific field errors
          if (error.response.data.email) {
            setErrorMessage(`Email error: ${error.response.data.email[0]}`);
          } else if (error.response.data.username) {
            setErrorMessage(`Username error: ${error.response.data.username[0]}`);
          } else if (error.response.data.password) {
            setErrorMessage(`Password error: ${error.response.data.password[0]}`);
          } else if (error.response.data.non_field_errors) {
            setErrorMessage(error.response.data.non_field_errors[0]);
          } else {
            setErrorMessage('Registration failed. Please try again.');
          }
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage('Server not responding. Please try again later.');
      } else {
        // Other errors
        setErrorMessage('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }

    // Only set timeout if there's an error message
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="signin-container">
      <div className="form-container-signup">
        <h1 className="signin-title">Join Us</h1>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSignUp}>
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
              type="text"
              className="neon-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="input-group">
            <input
              type="password"
              className="neon-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container-login">
            <button type="submit" className="btn btn-submit" disabled={isLoading}>
              {isLoading ? <div className="loader"></div> : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="helper-links">
          <button className="neon-link" onClick={() => navigate('/signin')}>
            Click here to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
