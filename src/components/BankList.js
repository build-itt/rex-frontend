import React, { useState } from 'react';
import "./BankList.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BankList = ({ banks }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingBankId, setLoadingBankId] = useState(null); // State to track the loading bank ID
  const navigate = useNavigate();
  const bankName = banks.length > 0 ? banks[0].name : "Bank Listings";
  const token = localStorage.getItem('token');
  
  const handleBuy = async (bankId, event) => {
    event.preventDefault();
    setLoadingBankId(bankId); // Set the loading bank ID
    // Implement buying bank here
    try {
      const response = await axios.post(`https://matrix-backend-alpha.vercel.app/pay/buy/${bankId}/`, {}, { headers: { Authorization: `Token ${token}` } });
      setSuccessMessage('Purchase successful');
      console.log('Bank purchased', response.data);
      setTimeout(() => {
        navigate('/banks/extraction');
        window.location.reload();
      } ,2000);

    } catch (error) {
      console.error('Failed to buy bank', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoadingBankId(null); // Reset the loading bank ID
    }
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  }

  return (
    <div className="container">
      {/* Display the bank name or default to "Bank Listings" */}
      <h1 className="text-2xl font-bold mb-4">{bankName}</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Info</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">DoB</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank, index) => (
            <tr key={bank.id} className={`typing-row-${index + 1} border-t`}>
              <td className="px-4 py-2"><span className="table-typing">${bank.balance}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.type}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.Info}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.state}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.gender}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.dob}</span></td>
              <td className="px-4 py-2"><span className="table-typing">${bank.price.toFixed(2)}</span></td>
              <td className="px-4 py-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loadingBankId === bank.id}
                  onClick={(event) => handleBuy(bank.id, event)}
                >
                  {loadingBankId === bank.id ? <div className="loader"></div> : 'Buy'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankList;