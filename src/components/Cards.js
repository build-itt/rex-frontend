import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CardList from "./CardList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Cards = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  // Use useCallback to memoize handleBankData function
  const handleBankData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get(`https://matrix-backend-henna.vercel.app/store/category/cards/`);
      const banks = response.data;
      setBanks(banks);
    } catch (error) {
      console.error('Failed to fetch banks', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }, []); // Depend on slug

  useEffect(() => {
    handleBankData(); // Fetch the bank data when the component mounts or slug changes
  }, [handleBankData]); // Add handleBankData to the dependency array

  return (
    <div>
      <Sidebar ref={sidebarRef} sidebarOpen={sidebarOpen} handleCloseClick={() => setSidebarOpen(false)} />
      <div 
        className={sidebarOpen ? 'menuclose' : 'MenuIcon'} 
        onClick={handleMenuClick}
      >
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
      </div>
      <Topbar />
      <div className="main-content">
        {loading ? (
          <div className="table-typing">Loading...</div> // Display loading indicator
        ) : (
          <CardList banks={banks} /> // Pass banks data to CardList component
        )}
      </div>
    </div>
  );
}

export default Cards;
