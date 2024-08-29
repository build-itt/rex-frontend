import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToDashboard = ({ element: Component }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return token ? null : <Component />;
};

export default RedirectToDashboard;