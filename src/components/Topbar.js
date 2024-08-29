import React, { Suspense, lazy } from 'react';
import './Topbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faHistory, faHeadset, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const BalanceButton = lazy(() => import('./TopBarBalance'));

function Topbar() {
  const navigate = useNavigate();


  const handleLogout = () => {
    // Clear the stored token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('balance'); // Clear balance on logout
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
      <Suspense fallback={<span className="nav-link glassy-m">Loading...</span>}>
        <BalanceButton />
      </Suspense>
    </div>
  );
}

export default Topbar;