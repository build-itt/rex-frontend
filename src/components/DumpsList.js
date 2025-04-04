import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService, paymentService } from '../services/api';
import { useBalanceContext } from '../context/BalanceContext';

const DumpsList = ({ banks }) => {
  const [selectedTag, setSelectedTag] = useState('balance');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredDumps, setFilteredDumps] = useState(banks);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingDumpId, setLoadingDumpId] = useState(null);
  const navigate = useNavigate();
  const { updateBalanceAfterTransaction } = useBalanceContext();

  // Memoize the filterData function to prevent unnecessary recreations
  const filterData = useCallback((filters) => {
    let filtered = banks;
    filters.forEach(filter => {
      const [tag, value] = filter.split(':');
      filtered = filtered.filter(dump => dump[tag]?.toString().includes(value));
    });
    setFilteredDumps(filtered);
  }, [banks]);

  // Fix the dependency array to include filterData
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

  const handleBuy = async (dumpId, event) => {
    event.preventDefault();
    setLoadingDumpId(dumpId);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await paymentService.buyItem(dumpId);
      setSuccessMessage('Purchase successful');
      
      // Update balance if returned in response
      if (response.data.balance !== undefined) {
        updateBalanceAfterTransaction(response.data.balance);
      }
      
      // Use a safer approach for navigation without full page reload
      setTimeout(() => {
        navigate('/dumps/extraction');
      }, 2000);
    } catch (error) {
      console.error('Failed to buy dump', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoadingDumpId(null);
    }
    
    // Clear messages after 5 seconds
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Dumps Listings</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="flex flex-row bg-none border-gray-300 rounded-md shadow-sm gap-3">
        {selectedFilters.map(filter => (
          <span key={filter} className="bg-green-700 p-2 border-green-300 rounded-md shadow-sm">
            {filter} <button onClick={() => removeFilter(filter)}>x</button>
          </span>
        ))}
      </div>
      

      <div className="flex items-center justify-center p-4 bg-none mb-3 shadow rounded-lg">
        <div className="flex items-center">
          <select
            className="form-select block w-full mt-1 bg-gray-700 p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <option value="balance">Balance</option>
            <option value="Info">Info</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="ml-4">
          <select
            className="form-select block w-full mt-1 bg-gray-700 p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleSearchSelect}
          >
            <option value="">Search</option>
            {filteredDumps
              .map(dump => dump[selectedTag])
              .filter((value, index, self) => self.indexOf(value) === index)
              .map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      </div>

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
          {filteredDumps.map((dump, index) => (
            <tr key={dump.id} className={`typing-row-${index + 1} border-t`}>
              <td className="px-4 py-2"><span className="table-typing">${dump.balance}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{dump.Info}</span></td>
              <td className="px-4 py-2"><span className="table-typing">${dump.price}</span></td>
              <td className="px-4 py-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loadingDumpId === dump.id}
                  onClick={(event) => handleBuy(dump.id, event)}
                >
                  {loadingDumpId === dump.id ? <div className="loader"></div> : 'Buy'}
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
