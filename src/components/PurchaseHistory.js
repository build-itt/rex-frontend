import React, { useState, useEffect } from 'react';
import './PurchaseHistory.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decryptedPurchases, setDecryptedPurchases] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    // Fetch the data from the server
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get('https://rex-backend.vercel.app/account/history/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Pass token in headers
          },
        });

        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = response.data;

        // Map data to expected format for rendering
        const mappedPurchases = data.invoices.map(invoice => ({
          id: invoice.id,
          amount: invoice.received,
          details: `${invoice.product.name} - ${invoice.product.type} ($${invoice.product.balance})`,
          total: invoice.product.price,
          balance: invoice.product.balance,
          decrypted: invoice.decrypted,
        }));

        setPurchases(mappedPurchases);

        // Initialize decryptedPurchases state based on invoices data
        const initialDecryptedState = {};
        mappedPurchases.forEach(purchase => {
          initialDecryptedState[purchase.id] = purchase.decrypted;
        });
        setDecryptedPurchases(initialDecryptedState);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-state">
          <div>🔍 Loading Purchase History...</div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <div className="error-state">
          <div>❌ Error Loading History</div>
          <div style={{marginTop: '10px', fontSize: '1rem', opacity: 0.8}}>{error}</div>
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user'));

  const handleDecrypt = async (purchaseId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`https://rex-backend.vercel.app/pay/decrypt/${purchaseId}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`, // Pass token in headers
        },
      });
       if (response.status === 200) {
        setSuccessMessage('Decryption successful');
        setDecryptedPurchases((prev) => ({ ...prev, [purchaseId]: true }));
        setTimeout(() => {
          console.log('Refreshing the page');
          window.location.reload();
        }, 2000); 
      }
    } catch (error) {
      console.error('Failed to decrypt purchase', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      setTimeout(() => {
        navigate('/banks/extraction');
      }, 2000); // 2000 milliseconds = 2 seconds delay
    }
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <div className="history-container">
      <h1 className="title">Purchase History</h1>
      <div className="user-info">
        <p><strong>User:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Total Purchases:</strong> {purchases.length}</p>
      </div>
      {successMessage && <div className="success-message">✅ {successMessage}</div>}
      {errorMessage && <div className="error-message">⚠️ {errorMessage}</div>}
      {purchases.length === 0 ? (
        <div className="loading-state">
          <div>📋 No Purchase History Found</div>
          <div style={{marginTop: '10px', fontSize: '1rem', opacity: 0.8}}>You haven't made any purchases yet.</div>
        </div>
      ) : (
        purchases.map((purchase, index) => (
        <div key={index} className="purchase-card">
          <div className="price">
            <span className="amount">${purchase.amount}</span>
          </div>
          <div className="details">
            <p>{purchase.details}</p>
          </div>
          <div className="actions">
            <button className="btn-paid">💳 Paid</button>
            <button
              className="btn-decrypt"
              onClick={() => handleDecrypt(purchase.id)}
              disabled={decryptedPurchases[purchase.id]}
            >
              {decryptedPurchases[purchase.id] ? '🔓 Decrypted' : '🔒 Decrypt'}
            </button>
          </div>
        </div>
      ))
      )}
    </div>
  );
};

export default PurchaseHistory;