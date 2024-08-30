import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DumpsList from "./DumpsList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import faTimes for close icon
import axios from 'axios';

const Dumps = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('https://matrix-backend-alpha.vercel.app/pay/balance/', { headers: { Authorization: `Token ${token}` } });
        const { balance } = response.data;
        localStorage.setItem('balance', balance);
      } catch (error) {
        console.error('Failed to fetch balance', error);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchDumps = async () => {
      try {
        const response = await axios.get('https://matrix-backend-alpha.vercel.app/store/category/dumps/');
        setBanks(response.data);
      } catch (error) {
        console.error('Failed to fetch dumps', error);
      }
    };

    fetchDumps();
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
        <DumpsList banks={banks} />
      </div>
    </div>
  );
};

export default Dumps;