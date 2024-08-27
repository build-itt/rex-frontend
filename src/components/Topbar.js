import React from 'react';
import './Topbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faHistory, faHeadset, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Topbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Add your sign-up logic here
    navigate('/signin');
  };
  return (
    <div className="topbar">
        <span className="nav-link glassy" onClick={() => navigate('/history')}>
          <FontAwesomeIcon icon={faHistory} /> History
        </span>
        <span className="nav-link glassy">
          <FontAwesomeIcon icon={faHeadset} /> Support
        </span>
        <span className="nav-link glassy" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </span>
        <span className="nav-link glassy-m">
          Balance: $40000000.00
        </span>
    </div>
  );
}

export default Topbar;
