import React, { useState } from 'react';
import axios from 'axios';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';

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

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      const response = await axios.post('https://matrix-backend-henna.vercel.app/account/register/', {
        email,
        username,
        password,
      });

      if (response.status === 201) {
        const { token, username, email, total_products, id } = response.data;

        // Store user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username, email, total_products, id }));

        try {
          const response = await axios.get('https://matrix-backend-henna.vercel.app/pay/balance/', { headers: { Authorization: `Token ${token}` } });
          const { balance } = response.data;
          localStorage.setItem('balance', balance);
          
        } catch (error) {
          console.error('Failed to fetch balance', error);
        }

        // Navigate to the dashboard or any other page
        navigate('/dashboard');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
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
