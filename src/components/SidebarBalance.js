import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SidebarBalance = ({ toggleModal }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('https://matrix-backend-orcin.vercel.app/pay/balance/', {
          headers: { Authorization: `Token ${token}` },
        });
        setBalance(response.data.balance);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch balance', error);
        setLoading(false);
      }
    };

    fetchBalance();
  }, [token]);

  return (
    <button className='btn-s' onClick={toggleModal}>
      {loading ? 'Loading...' : `Balance: $${parseFloat(balance).toFixed(2)}`}
    </button>
  );
};

export default SidebarBalance;