import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DumpsList from "./DumpsList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import faTimes for close icon
import axios from 'axios';


const Dumps =() => {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

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
    const banks = [
        { id: '1', balance: '$7,913.00', description: 'Personal', info: 'Info A', state: 'NY', gender: 'Male', dob: '01/01/1980', price: '$302.00' },
        { id: '2', balance: '$8,016.00', description: 'Business', info: 'Info B', state: 'CA', gender: 'Female', dob: '02/02/1985', price: '$304.00' },
        { id: '3', balance: '$8,119.00', description: 'Personal', info: 'Info C', state: 'TX', gender: 'Male', dob: '03/03/1990', price: '$306.00' },
      ];
    return(
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
    )
}

export default Dumps;