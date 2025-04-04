import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { paymentService } from '../services/api';

// Fetcher function that SWR will use
const balanceFetcher = async () => {
  try {
    const response = await paymentService.getBalance();
    return response.data.balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};

/**
 * Custom hook for fetching and managing user balance
 * @param {Object} options - SWR options
 * @returns {Object} Balance data, loading state, error state, and refresh function
 */
export default function useBalance(options = {}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastManualUpdate, setLastManualUpdate] = useState(null);

  const {
    data: balance,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR('user-balance', balanceFetcher, {
    // Override default SWR config with custom settings for balance
    refreshInterval: 60000, // Only refresh every minute
    revalidateOnFocus: false, // Disable auto revalidation on focus
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    ...options
  });

  // Function to manually refresh the balance
  const refreshBalance = useCallback(() => {
    const now = Date.now();
    
    // Prevent multiple refreshes within 2 seconds
    if (lastManualUpdate && now - lastManualUpdate < 2000) {
      return Promise.resolve(balance);
    }
    
    setLastManualUpdate(now);
    return mutate();
  }, [balance, lastManualUpdate, mutate]);

  // Function to update balance after a transaction
  const updateBalanceAfterTransaction = useCallback((newBalance) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      // Update the balance immediately without triggering a revalidation
      mutate(newBalance, false);
    } finally {
      // Set a timeout to prevent rapid consecutive updates
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    }
  }, [mutate, isUpdating]);

  return {
    balance: balance !== undefined ? balance : 0,
    isLoading,
    isRefreshing: isValidating,
    error,
    refreshBalance,
    updateBalanceAfterTransaction
  };
} 