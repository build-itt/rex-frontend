import React, { useState } from 'react';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';

const SignInPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const navigate = useNavigate();
  const handleSignIn = () => {
    // Add your sign-in logic here
    navigate('/dashboard');
  };

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
            <button type="submit" className="btn btn-submit" onClick={handleSignIn}>Login</button>
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
