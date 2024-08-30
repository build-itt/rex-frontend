import React, {useState} from 'react';
import "./BankList.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DumpsList = ({ banks }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingBankId, setLoadingBankId] = useState(null); // State to track the loading bank ID
  const navigate = useNavigate();
  const handleBuy = async (bankId, event) => {
    const token = localStorage.getItem('token');
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
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Dumps Listings</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank, index) => (
            <tr key={bank.id} className={`typing-row-${index + 1} border-t`}>
              <td className="px-4 py-2"><span className="table-typing">${bank.balance}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.Info}</span></td>
              <td className="px-4 py-2"><span className="table-typing">${bank.price}</span></td>
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

export default DumpsList;
