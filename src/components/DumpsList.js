import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import { useBalanceContext } from '../context/BalanceContext';
import "./BankList.css";

const DumpsList = ({ banks }) => {
  const [selectedTag, setSelectedTag] = useState('balance');
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredDumps, setFilteredDumps] = useState(banks);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingDumpId, setLoadingDumpId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const navigate = useNavigate();
  const { updateBalanceAfterTransaction } = useBalanceContext();

  const updateDropdownOptions = useCallback(() => {
    if (!banks || !banks.length) return;
    
    // Get unique values for the selected tag
    const options = [...new Set(banks
      .map(dump => dump[selectedTag])
      .filter(Boolean)
    )];
    
    setDropdownOptions(options);
  }, [banks, selectedTag]);

  // Initialize filtered banks when component mounts or banks changes
  useEffect(() => {
    setFilteredDumps(banks);
    // Update dropdown options when selected tag changes
    updateDropdownOptions();
  }, [banks, selectedTag, updateDropdownOptions]);

  // Memoize the filterData function to prevent unnecessary recreations
  const filterData = useCallback((filters) => {
    let filtered = banks;
    filters.forEach(filter => {
      const [tag, value] = filter.split(':');
      filtered = filtered.filter(dump => {
        const dumpValue = dump[tag];
        return dumpValue && dumpValue.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredDumps(filtered);
  }, [banks]);

  // Fix the dependency array to include filterData
  useEffect(() => {
    filterData(selectedFilters);
  }, [selectedFilters, filterData]);

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

  const removeFilter = (filterToRemove) => {
    const updatedFilters = selectedFilters.filter(filter => filter !== filterToRemove);
    setSelectedFilters(updatedFilters);
    filterData(updatedFilters);
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

  // Function to render column with possible abbreviation
  const renderColumn = (value) => {
    if (!value) return <span className="table-typing">-</span>;
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

  // Function to render mobile card for each dump
  const renderMobileCard = (dump, index) => {
    const cardClass = `mobile-card ${loadingDumpId === dump.id ? 'loading' : ''}`;
    
    return (
      <div key={dump.id} className={cardClass}>
        <div className="mobile-card-header">
          <div className="mobile-card-title">
            Dump #{dump.id}
          </div>
          <div className="mobile-card-price">
            {renderCurrency(dump.price)}
          </div>
        </div>
        
        <div className="mobile-card-content">
          <div className="mobile-card-row">
            <span className="mobile-card-label">Balance:</span>
            <span className="mobile-card-value">{renderCurrency(dump.balance)}</span>
          </div>
          
          {dump.Info && (
            <div className="mobile-card-info">
              {dump.Info}
            </div>
          )}
        </div>
        
        <div className="mobile-card-footer">
          <button
            type="submit"
            className="btn-primary"
            disabled={loadingDumpId === dump.id}
            onClick={(event) => handleBuy(dump.id, event)}
          >
            {loadingDumpId === dump.id ? <div className="loader"></div> : 'Buy'}
          </button>
        </div>
      </div>
    );
  };

  // Determine which columns to show based on screen width
  const priorityColumns = [
    { name: 'Balance', field: 'balance', show: true, isCurrency: true },
    { name: 'Description', field: 'Info', show: true, className: 'info-col' },
    { name: 'Price', field: 'price', show: true, isCurrency: true }
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

      {/* Responsive table with fixed Buy column - Desktop */}
      <div className="bank-table-container">
        <table className="bank-table">
          <thead>
            <tr>
              {priorityColumns.map(column => (
                <th 
                  key={column.field} 
                  className={column.className ? column.className : ''}
                >
                  {column.name}
                </th>
              ))}
              <th className="action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDumps.length === 0 ? (
              <tr>
                <td colSpan={priorityColumns.length + 1} className="no-results">No dumps found matching your search criteria</td>
              </tr>
            ) : (
              filteredDumps.map((dump, index) => (
                <tr key={dump.id} className={`typing-row-${index % 3 + 1} border-t`}>
                  {priorityColumns.map(column => (
                    <td 
                      key={column.field} 
                      className={column.className ? column.className : ''}
                    >
                      {column.isCurrency ? 
                        renderCurrency(dump[column.field]) : 
                        renderColumn(dump[column.field])}
                    </td>
                  ))}
                  <td className="action-col">
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Layout */}
      <div className="mobile-cards-container">
        {filteredDumps.length === 0 ? (
          <div className="mobile-card">
            <div className="mobile-card-content">
              <div style={{ textAlign: 'center', color: '#6c6c6c', fontStyle: 'italic', padding: '20px' }}>
                No dumps found matching your search criteria
              </div>
            </div>
          </div>
        ) : (
          filteredDumps.map((dump, index) => renderMobileCard(dump, index))
        )}
      </div>
    </div>
  );
};

export default DumpsList;
