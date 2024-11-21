import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const RouteWrapper = ({ children }) => {
  const location = useLocation(); // Get current route location

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('https://matrix-backend-orcin.vercel.app/pay/balance/', {
          headers: { Authorization: `Token ${token}` }
        });
        const { balance } = response.data;
        localStorage.setItem('balance', balance);
      } catch (error) {
        console.error('Failed to fetch balance', error);
      }
    };

    // Call the balance check every time the route changes
    fetchBalance();
  }, [location]); // Depend on location to trigger when the route changes

  return children;
};

export default RouteWrapper;
