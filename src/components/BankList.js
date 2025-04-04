import React, { useState, useEffect } from 'react';
import "./BankList.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BankList = ({ banks }) => {
  const [selectedTag, setSelectedTag] = useState('balance');
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState(banks);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingBankId, setLoadingBankId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Initialize filtered banks when component mounts or banks changes
  useEffect(() => {
    setFilteredBanks(banks);
    // Update dropdown options when selected tag changes
    updateDropdownOptions();
  }, [banks, selectedTag]);

  const updateDropdownOptions = () => {
    if (!banks || !banks.length) return;
    
    // Get unique values for the selected tag
    const options = [...new Set(banks
      .map(bank => bank[selectedTag])
      .filter(Boolean)
    )];
    
    setDropdownOptions(options);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    setSearchInput('');
    setShowDropdown(false);
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    
    if (value.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleOptionSelect = (value) => {
    if (value) {
      const newFilter = `${selectedTag}:${value}`;
      if (!selectedFilters.includes(newFilter)) {
        const updatedFilters = [...selectedFilters, newFilter];
        setSelectedFilters(updatedFilters);
        filterData(updatedFilters);
      }
    }
    setSearchInput('');
    setShowDropdown(false);
  };

  const filterData = (filters) => {
    let filtered = banks;
    filters.forEach(filter => {
      const [tag, value] = filter.split(':');
      filtered = filtered.filter(bank => {
        const bankValue = bank[tag];
        return bankValue && bankValue.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredBanks(filtered);
  };

  const removeFilter = (filterToRemove) => {
    const updatedFilters = selectedFilters.filter(filter => filter !== filterToRemove);
    setSelectedFilters(updatedFilters);
    filterData(updatedFilters);
  };

  const handleBuy = async (bankId, event) => {
    event.preventDefault();
    setLoadingBankId(bankId);
    try {
      const response = await axios.post(`https://matrix-backend-henna.vercel.app/pay/buy/${bankId}/`, {}, { headers: { Authorization: `Token ${token}` } });
      setSuccessMessage('Purchase successful');
      console.log('Bank purchased', response.data);
      setTimeout(() => {
        navigate('/banks/extraction');
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to buy bank', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoadingBankId(null);
    }
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  };

  // Function to render column with possible abbreviation
  const renderColumn = (value, width, isInfo = false) => {
    if (!value) return <span className="table-typing">-</span>;
    // No text truncation - show full text
    return <span className="table-typing">{value}</span>;
  };

  // Function to render price/balance with inline dollar sign
  const renderCurrency = (value) => {
    if (!value) return <span className="table-typing">-</span>;
    
    // Make sure the value is a number before using toFixed
    const numValue = typeof value === 'number' 
      ? value.toFixed(2) 
      : parseFloat(value) ? parseFloat(value).toFixed(2) : value;
    
    return <span className="table-typing currency-value">${numValue}</span>;
  };

  // Determine which columns to show based on screen width
  const priorityColumns = [
    { name: 'Balance', field: 'balance', show: true, isCurrency: true },
    { name: 'Price', field: 'price', show: true, isCurrency: true },
    { name: 'State', field: 'state', show: true },
    { name: 'DoB', field: 'dob', show: true },
    { name: 'Gender', field: 'gender', show: true },
    { name: 'Type', field: 'type', show: true },
    { name: 'Info', field: 'Info', show: true, className: 'info-col', isInfo: true }
  ];

  return (
    <div className="bank-list-container">
      {/* Notification messages */}
      {(successMessage || errorMessage) && (
        <div className="notification-container">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      )}
      
      {/* Modern search UI */}
      <div className="search-container">
        <div className="search-filter-tags">
          {selectedFilters.map(filter => (
            <div key={filter} className="filter-tag">
              <span>{filter}</span>
              <button onClick={() => removeFilter(filter)} className="remove-filter">×</button>
            </div>
          ))}
        </div>
        
        <div className="search-inputs">
          <div className="search-field">
            <select
              className="category-select"
              value={selectedTag}
              onChange={handleTagChange}
            >
              {priorityColumns.map(column => (
                <option key={column.field} value={column.field}>
                  {column.name}
                </option>
              ))}
            </select>
            
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder={`Search by ${selectedTag}...`}
                value={searchInput}
                onChange={handleSearchInputChange}
                onFocus={() => searchInput.length > 0 && setShowDropdown(true)}
              />
              
              {showDropdown && dropdownOptions.length > 0 && (
                <div className="search-dropdown">
                  {dropdownOptions
                    .filter(option => option && option.toString().toLowerCase().includes(searchInput.toLowerCase()))
                    .slice(0, 10) // Limit to 10 options for better UX
                    .map((option, index) => (
                      <div 
                        key={index} 
                        className="dropdown-option"
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive table with fixed Buy column */}
      <div className="bank-table-container">
        <table className="bank-table">
          <thead>
            <tr>
              {priorityColumns.map(column => (
                ((column.show === true) || (column.show === 'desktop')) && (
                  <th 
                    key={column.field} 
                    className={(column.show === 'desktop' ? 'hide-mobile' : '') + 
                      (column.className ? ' ' + column.className : '')}
                  >
                    {column.name}
                  </th>
                )
              ))}
              <th className="action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanks.length === 0 ? (
              <tr>
                <td colSpan={priorityColumns.length + 1} className="no-results">No banks found matching your search criteria</td>
              </tr>
            ) : (
              filteredBanks.map((bank, index) => (
                <tr key={bank.id} className={`typing-row-${index % 3 + 1} border-t`}>
                  {priorityColumns.map(column => (
                    ((column.show === true) || (column.show === 'desktop')) && (
                      <td 
                        key={column.field} 
                        className={(column.show === 'desktop' ? 'hide-mobile' : '') + 
                          (column.className ? ' ' + column.className : '')}
                      >
                        {column.isCurrency ? 
                          renderCurrency(bank[column.field]) : 
                          renderColumn(bank[column.field], 10, column.isInfo)}
                      </td>
                    )
                  ))}
                  <td className="action-col">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankList;