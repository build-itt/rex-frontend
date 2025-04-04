import useSWR from 'swr';
import { useState } from 'react';
import api from '../services/api';

/**
 * General-purpose hook for fetching data from API endpoints
 * @param {string} url - API endpoint URL
 * @param {Object} options - SWR options and axios config
 * @returns {Object} Data, loading state, error state, and utility functions
 */
export default function useApi(url, options = {}) {
  const {
    axiosConfig = {},
    swr = {},
    initialData,
  } = options;

  // Fetcher function that will be used by SWR
  const fetcher = async (url) => {
    try {
      const response = await api.get(url, axiosConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(url, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...swr
  });

  // Function to manually refresh the data
  const refresh = () => {
    return mutate();
  };

  // Function to manually update the data without triggering a revalidation
  const update = (newData, shouldRevalidate = false) => {
    return mutate(newData, shouldRevalidate);
  };

  return {
    data,
    isLoading,
    isRefreshing: isValidating,
    error,
    refresh,
    update
  };
}

/**
 * Hook for posting data to API endpoints
 * @returns {Object} postData function and loading state
 */
export function useApiMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to post data to an API endpoint
  const mutate = async (url, data, config = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(url, data, config);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setError(error);
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading, error };
} 