import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BankList from "./BankList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./MainContent.css";

const Table = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('https://rex-backend.vercel.app/pay/balance/', { headers: { Authorization: `Token ${token}` } });
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
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get(`https://rex-backend.vercel.app/store/category/${slug}/`);
      const banks = response.data;
      setBanks(banks);
    } catch (error) {
      console.error('Failed to fetch banks', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
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
        <div className="table-content-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="table-typing">🔍 Loading Banks...</div>
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <BankList banks={banks} />    
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
