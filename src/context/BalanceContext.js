import React, { createContext, useContext } from 'react';
import useBalance from '../hooks/useBalance';

// Create a context for the balance
const BalanceContext = createContext();

/**
 * Provider component for balance data
 * This makes balance data and methods available to all child components
 */
export function BalanceProvider({ children }) {
  const balanceData = useBalance();

  return (
    <BalanceContext.Provider value={balanceData}>
      {children}
    </BalanceContext.Provider>
  );
}

/**
 * Custom hook to use the balance context
 * @returns {Object} Balance data and methods
 */
export function useBalanceContext() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
}

export default BalanceContext; 