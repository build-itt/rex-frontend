import React from 'react';
import useBalance from '../hooks/useBalance';

const BalanceButton = () => {
  const { balance, isLoading } = useBalance();

  return (
    <span className="nav-link glassy-m">
      {isLoading ? 'Loading...' : `Balance: $${parseFloat(balance).toFixed(2)}`}
    </span>
  );
};

export default BalanceButton;