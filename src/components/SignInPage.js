import React from 'react';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <div className="form-container">
        <h1 className="signin-title">Sign In</h1>
        <form>
          <div className="input-group">
            <input type="email" className="neon-input" placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="password" className="neon-input" placeholder="Password" />
          </div>
          <div className="button-container-login">
            <button type="submit" className="btn btn-submit">Login</button>
          </div>
        </form>

        <div className="helper-links">
          <button className="neon-link" onClick={() => alert('Forgot Password functionality coming soon!')}>
            Forgot Password?
          </button>
          <button className="neon-link" onClick={() => navigate('/signup')}>
            Click here to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
