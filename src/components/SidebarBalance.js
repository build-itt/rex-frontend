import React from 'react';
import useBalance from '../hooks/useBalance';

const SidebarBalance = ({ toggleModal }) => {
  const { balance, isLoading } = useBalance();

  return (
    <button className='btn-s' onClick={toggleModal}>
      {isLoading ? 'Loading...' : `Balance: $${parseFloat(balance).toFixed(2)}`}
    </button>
  );
};

export default SidebarBalance;