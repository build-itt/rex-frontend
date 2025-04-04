import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import swrConfig from './config/swr-config';

// Global error handler for uncaught errors
const globalErrorHandler = (error) => {
  console.error('Uncaught application error:', error);
  // You could also log to an error tracking service here
};

// Set up the error handler
window.addEventListener('error', globalErrorHandler);
window.addEventListener('unhandledrejection', (event) => globalErrorHandler(event.reason));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SWRConfig 
      value={{
        ...swrConfig,
        onError: (error, key) => {
          console.error(`SWR Error fetching ${key}:`, error);
        }
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
