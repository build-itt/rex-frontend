import React, { useState, useCallback, useEffect } from 'react';
import "./BankList.css";
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import { useBalanceContext } from '../context/BalanceContext';

const CardList = ({ banks }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingBankId, setLoadingBankId] = useState(null); // State to track the loading bank ID
  const navigate = useNavigate();
  const { updateBalanceAfterTransaction } = useBalanceContext();
  const [selectedTag, setSelectedTag] = useState('base');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState(banks);

  // Memoize the filterData function to prevent unnecessary recreations
  const filterData = useCallback((filters) => {
    let filtered = banks;
    filters.forEach(filter => {
      const [tag, value] = filter.split(':');
      filtered = filtered.filter(bank => bank[tag]?.toString().includes(value));
    });
    setFilteredBanks(filtered);
  }, [banks]);

  // Apply filters when they change
  useEffect(() => {
    filterData(selectedFilters);
  }, [selectedFilters, filterData]);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleSearchSelect = (event) => {
    const value = event.target.value;
    if (value) {
      const newFilter = `${selectedTag}:${value}`;
      if (!selectedFilters.includes(newFilter)) {
        const updatedFilters = [...selectedFilters, newFilter];
        setSelectedFilters(updatedFilters);
      }
    }
  };

  const removeFilter = (filterToRemove) => {
    const updatedFilters = selectedFilters.filter(filter => filter !== filterToRemove);
    setSelectedFilters(updatedFilters);
  };

  const handleBuy = async (bankId, event) => {
    event.preventDefault();
    setLoadingBankId(bankId); // Set the loading bank ID
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await paymentService.buyItem(bankId);
      setSuccessMessage('Purchase successful');
      
      // Update balance if returned in response
      if (response.data.balance !== undefined) {
        updateBalanceAfterTransaction(response.data.balance);
      }
      
      // Use a safer approach to navigation
      setTimeout(() => {
        navigate('/banks/extraction');
      }, 2000);
    } catch (error) {
      console.error('Failed to buy bank', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoadingBankId(null); // Reset the loading bank ID
    }
    
    // Clear messages after 5 seconds
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  }

  return (
    <div className="container">
      {/* Display selected filters as tags */}
      <div className="flex flex-row bg-none border-gray-300 rounded-md shadow-sm gap-3">
        {selectedFilters.map(filter => (
          <span key={filter} className="bg-green-700 p-2 border-green-300 rounded-md shadow-sm">
            {filter} <button onClick={() => removeFilter(filter)}>x</button>
          </span>
        ))}
      </div>

      {/* Advanced search */}
      <div className="flex items-center justify-center p-4 bg-none mb-3 shadow rounded-lg">
        <div className="flex items-center">
          <select
            className="form-select block w-full mt-1 bg-gray-700 p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <option value="bin">Bin</option>
            <option value="type">Type</option>
            <option value="exp">Exp</option>
            <option value="zip">Zip</option>
            <option value="Info">Info</option>
            <option value="state">State</option>
            <option value="bank">Bank</option>
            <option value="country">Country</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="ml-4">
          {/* Dropdown for search suggestions */}
          <select
            className="form-select block w-full mt-1 bg-gray-700 p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleSearchSelect}
          >
            <option value="">Search</option>
            {filteredBanks
              .map(bank => bank[selectedTag])
              .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
              .map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Bin</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Exp</th>
            <th className="px-4 py-2">Zip</th>
            <th className="px-4 py-2">Info</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Bank</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredBanks.map((bank, index) => (
            <tr key={bank.id} className={`typing-row-${index + 1} border-t`}>
              <td className="px-4 py-2"><span className="table-typing">{bank.bin}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.type}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.exp}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.zip}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.Info}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.state}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.bank}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.country}</span></td>
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

export default CardList;