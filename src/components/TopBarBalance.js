import React from 'react';
import useBalance from '../hooks/useBalance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const BalanceButton = ({ toggleModal }) => {
  const { balance, isLoading } = useBalance();

  // Format balance with commas for thousands and fixed 2 decimal places
  const formattedBalance = isLoading 
    ? 'Loading...' 
    : parseFloat(balance).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

  return (
    <span className="nav-link glassy-m balance-display" onClick={toggleModal}>
      <FontAwesomeIcon icon={faDollarSign} className="balance-icon" />
      <span className="balance-text">
        {isLoading ? 'Loading...' : formattedBalance}
      </span>
    </span>
  );
};

export default BalanceButton;