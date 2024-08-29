import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BankList from "./BankList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Table = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [banks, setBanks] = useState([]);
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('https://www.erblan-api.xyz/pay/balance/', { headers: { Authorization: `Token ${token}` } });
        const { balance } = response.data;
        localStorage.setItem('balance', balance);
      } catch (error) {
        console.error('Failed to fetch balance', error);
      }
    };

    fetchBalance();
  }, []);
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
    try {
      const response = await axios.get(`https://www.erblan-api.xyz/store/category/${slug}/`);
      const banks = response.data;
      setBanks(banks);
    } catch (error) {
      console.error('Failed to fetch banks', error);
    }
  }, [slug]); // Depend on slug

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
        <BankList banks={banks} /> {/* Pass banks data to BankList component */}
      </div>
    </div>
  );
}

export default Table;
