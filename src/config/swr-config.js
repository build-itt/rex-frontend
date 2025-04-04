// Default configuration for SWR
const swrConfig = {
  // Revalidate on focus (when the user returns to the browser tab)
  revalidateOnFocus: false,
  
  // Revalidate when the browser regains connection
  revalidateOnReconnect: true,
  
  // Disable suspense mode to avoid React rendering issues
  suspense: false,
  
  // Increase deduplicate interval to prevent multiple identical requests
  dedupingInterval: 5000,
  
  // Explicitly enable revalidation during component mount
  revalidateOnMount: true,
  
  // Error retry settings - limit retries to prevent loops
  shouldRetryOnError: true,
  errorRetryCount: 2,
  errorRetryInterval: 5000,
  
  // Keep stale data when revalidating
  keepPreviousData: true,
  
  // Increase focus throttle interval to reduce frequent updates
  focusThrottleInterval: 10000,
  
  // Set a longer refresh interval
  refreshInterval: 60000,
  
  // Configure proper fallback behavior
  onError: (error, key) => {
    console.error(`SWR Error for ${key}:`, error);
  },
  
  // Prevent unnecessary refetches during loading
  revalidateIfStale: false,
};

export default swrConfig; 