// CashoutModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CashoutModal.css'; // Import the CSS for styling

const CashoutModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [cashoutMessage, setCashoutMessage] = useState('');
  const [deduction, setDeduction] = useState(null);
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  useEffect(() => {
    if (step === 5) {
      // Progress bar logic when step reaches the final stage 
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 10) + 1; // Increment progress randomly
          if (next >= 100) {
            clearInterval(interval);
            setProgress(100);
            setCashoutMessage('Cashout processed, money can take up to 3 business days to arrive.');
          } else if (next > 65 && Math.random() > 0.8) { // Randomly fail between 65% and 98%
            clearInterval(interval);
            setError('Security error occurred. Please try again later.');
          }
          return next;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleNextStep = async () => {
    if (step === 3) {
      // Call the API when proceeding from amount step
      try {
        const response = await axios.get('https://matrix-backend-orcin.vercel.app/pay/buy-btc/', {
          headers: {
            'Authorization': `Token ${token}`
          },
          params: {
            amount: parseFloat(amount),
            address:recipientAddress,
            senderAddress,
          },
        });

        console.log('GET request sent to /pay/buy-btc/', response.data);

        if (response.status === 200) {
          setDeduction(response.data.deduction); // Assuming 'deduction' is the key in the response
          setStep(step + 1);
        } else {
          setError('Failed to fetch payment details. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('An error occurred while fetching payment details.');
      }
    } else if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePay = async () => {
    // Handle payment confirmation
        try {
      // Debugging: Log the token to ensure it's set
      console.log('Token:', token);
    
      const response = await axios.post('https://matrix-backend-orcin.vercel.app/pay/buy-btc/', {
        amount: parseFloat(amount),
        address: recipientAddress,
        senderAddress,
      }, {
        headers: {
          'Authorization': `Token ${token}`
        },
      });
    
      // Debugging: Log the headers to ensure the token is included
      console.log('Request Headers:', response.config.headers);
    
      console.log('POST request sent to /pay/buy-btc/', response.data);
    
      if (response.status === 200) {
        setStep(step + 1); // Proceed to progress bar step
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during POST request:', error);
      setError('Payment failed. Please try again.');
    } 
  };

  const handleRestart = () => {
    setStep(1);
    setProgress(0);
    setError(null);
    setSenderAddress('');
    setRecipientAddress('');
    setAmount('');
    setCashoutMessage('');
    setDeduction(null);
  };

  return isOpen ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cashout BTC</h2>
        {step === 1 && (
          <div className="input-group">
            <p>Step 1: Enter the address you want to receive from:</p>
            <input
              type="text"
              className="neon-input"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              placeholder="Sender Address"
            />
            <button className="next" onClick={handleNextStep}>
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="input-group">
            <p>Step 2: Enter your recipient address:</p>
            <input
              type="text"
              className="neon-input"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Recipient Address"
            />
            <button className="next" onClick={handleNextStep}>
              Next
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="input-group">
            <p>Step 3: Enter the amount you want to cash out:</p>
            <input
              type="number"
              className="neon-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button className="next" onClick={handleNextStep}>
              Next
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="input-group">
            <p>Amount to be paid: {deduction}</p>
            <button className="next" onClick={handlePay}>
              Pay
            </button>
          </div>
        )}
        {step === 5 && (
          <div>
            <p>Processing Cashout...</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            {cashoutMessage && <p className="success-message">{cashoutMessage}</p>}
            {error && <p className="error">{error}</p>}
          </div>
        )}
        {error && (
          <button className="next-r" onClick={handleRestart}>
            Restart
          </button>
        )}
        <button className="btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default CashoutModal;
