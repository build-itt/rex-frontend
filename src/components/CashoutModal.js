// CashoutModal.js
import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/api';
import { useBalanceContext } from '../context/BalanceContext';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our balance context to access and update balance
  const { updateBalanceAfterTransaction } = useBalanceContext();

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
      // Validate inputs before proceeding
      if (!senderAddress || !recipientAddress || !amount) {
        setError('Please fill in all fields');
        return;
      }
      
      setIsSubmitting(true);
      setError(null);
      
      try {
        // Use our API service
        const response = await paymentService.getBtcPreview({
          amount: parseFloat(amount),
          address: recipientAddress,
          senderAddress,
        });

        setDeduction(response.data.deduction); // Get deduction from response
        setStep(step + 1);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching payment details.');
      } finally {
        setIsSubmitting(false);
      }
    } else if (step < 5) {
      // Validate current step inputs
      if (step === 1 && !senderAddress) {
        setError('Please enter sender address');
        return;
      }
      if (step === 2 && !recipientAddress) {
        setError('Please enter recipient address');
        return;
      }
      
      setError(null);
      setStep(step + 1);
    }
  };

  const handlePay = async () => {
    // Handle payment confirmation
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use our API service for the payment
      const response = await paymentService.buyBtc({
        amount: parseFloat(amount),
        address: recipientAddress,
        senderAddress,
      });
      
      if (response.data.balance !== undefined) {
        // Update the balance using our context
        updateBalanceAfterTransaction(response.data.balance);
      }
      
      setStep(step + 1); // Proceed to progress bar step
    } catch (error) {
      console.error('Error during payment:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cashout BTC</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        {step === 1 && (
          <div className="input-group">
            <p>Step 1: Enter the address you want to receive from:</p>
            <input
              type="text"
              className="neon-input"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              placeholder="Sender Address"
              disabled={isSubmitting}
            />
            <button 
              className="next" 
              onClick={handleNextStep}
              disabled={isSubmitting || !senderAddress}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
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
              disabled={isSubmitting}
            />
            <button 
              className="next" 
              onClick={handleNextStep}
              disabled={isSubmitting || !recipientAddress}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
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
              disabled={isSubmitting}
            />
            <button 
              className="next" 
              onClick={handleNextStep}
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </div>
        )}
        
        {step === 4 && (
          <div className="input-group">
            <p>Amount to be paid: {deduction}</p>
            <button 
              className="next" 
              onClick={handlePay}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Pay'}
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
  );
};

export default CashoutModal;
