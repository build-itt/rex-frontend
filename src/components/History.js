import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PurchaseHistory from "./PurchaseHistory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import faTimes for close icon


const History =() => {
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
        { id: '1', amount: '$7,913.00', details: 'Personal', info: 'Info A', state: 'NY', gender: 'Male', dob: '01/01/1980', total: '$302.00' },
        { id: '2', amount: '$8,016.00', details: 'Business', info: 'Info B', state: 'CA', gender: 'Female', dob: '02/02/1985', total: '$304.00' },
        { id: '3', amount: '$8,119.00', details: 'Personal', info: 'Info C', state: 'TX', gender: 'Male', dob: '03/03/1990', total: '$306.00' },
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
          <PurchaseHistory purchases={banks} />
        </div>
      </div>
    )
}

export default History;