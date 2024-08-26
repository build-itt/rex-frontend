import React from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <div className="form-container-signup">
        <h1 className="signin-title">Join Us</h1>
        <form>
          <div className="input-group">
            <input type="email" className="neon-input" placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="text" className="neon-input" placeholder="Username" />
          </div>
          <div className="input-group">
            <input type="password" className="neon-input" placeholder="Password" />
          </div>
            <div className="input-group">
                <input type="password" className="neon-input" placeholder="Confirm Password" />
            </div>
          <div className="button-container-login">
            <button type="submit" className="btn btn-submit">Sign Up</button>
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
