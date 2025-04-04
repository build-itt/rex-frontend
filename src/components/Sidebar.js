import React, { useState, useEffect, forwardRef, Suspense, lazy } from 'react';
import axios from 'axios'; // If you plan to make additional API calls
import './Sidebar.css';
import CashoutModal from './CashoutModal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faMoneyBillWave, faBank, faCashRegister, faHistory, faHeadset, faSignOutAlt, faChevronDown, faChevronUp, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';

const Sidebar = forwardRef(({ sidebarOpen, handleCloseClick }, ref) => {
  const [bitcoinAddress, setBitcoinAddress] = useState(''); // Initialize bitcoin address state
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state
  const token = localStorage.getItem('token');
  const [banksByLocation, setBanksByLocation] = useState({});
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://matrix-backend-henna.vercel.app/store/categories/');
        const banks = response.data;

        // Group banks by location
        const groupedBanks = banks.reduce((acc, bank) => {
          const { location } = bank;
          if (!acc[location]) {
            acc[location] = [];
          }
          acc[location].push(bank);
          return acc;
        }, {});

        setBanksByLocation(groupedBanks);
      } catch (error) {
        console.error('Failed to fetch banks', error);
      }
    };

    fetchBanks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('balance'); // Clear balance on logout
    navigate('/signin');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleCashoutModal = () => {
    setIsCashoutModalOpen(!isCashoutModalOpen);
  };
  
  const handleAddBalance = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.get('https://matrix-backend-henna.vercel.app/pay/add/', { headers: { Authorization: `Token ${token}` } });
      const bitcoinAddress = response.data.addr;
      setBitcoinAddress(bitcoinAddress);
    } catch (error) {
      console.error('Failed to fetch balance', error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleClick = () => {
    handleAddBalance();
    toggleModal();
  };

  // Define the lazy-loaded button component inline
  const LazyBalanceButton = lazy(() => import('./SidebarBalance'));

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownClick = (location) => {
    setActiveDropdown(activeDropdown === location ? null : location);
  };

  return (
    <>
      <div ref={ref} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h1 className="sidebar-title">DarkPass</h1>
        <ul className="menu-items">
          <li className="menu-item active" onClick={() => navigate('/dashboard')}>
            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
          </li>
          <li className="menu-item" onClick={handleClick}>
            <FontAwesomeIcon icon={faMoneyBillWave} /> Add Balance
          </li>
          <li className="menu-item" onClick={() => navigate('/dumps')}>
            <FontAwesomeIcon icon={faCashRegister} /> Dumps with Pins
          </li>
          <li className="menu-item" onClick={() => navigate('/cards')}>
            <FontAwesomeIcon icon={faCreditCard} /> Cards
          </li>
          {/* Add Cashout BTC menu item 
          <li className="menu-item" onClick={toggleCashoutModal}>
            <FontAwesomeIcon icon={faBitcoinSign} /> Cashout BTC
          </li>
          */}
          {/* Render Banks by Location */}
          {Object.keys(banksByLocation).map(location => (
            <li
              key={location}
              className={`menu-item dropdown ${activeDropdown === location ? 'active' : ''}`}
              onClick={() => handleDropdownClick(location)}
            >
              <FontAwesomeIcon icon={faBank} /> {location} Banks <FontAwesomeIcon icon={activeDropdown === location ? faChevronUp : faChevronDown} />
              <ul className="dropdown-content">
                {banksByLocation[location].map(bank => (
                  <li key={bank.id} onClick={() => navigate(`/banks/${bank.slug}`)}>{bank.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className='topbar-element'>
          <ul className="menu-items">
            <li className="menu-item" onClick={() => navigate('/history')}>
              <FontAwesomeIcon icon={faHistory} /> History
            </li>
            <li className="menu-item">
              <a href="https://t.me/darkpasssupport/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faHeadset} /> Support
              </a>
            </li>
            <li className="menu-item" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </div>
        <div className='sidebar-footer'>
          <Suspense fallback={<button className='btn-s' onClick={handleClick}>
                loading...
              </button>}>
            <LazyBalanceButton toggleModal={handleClick} />
          </Suspense>
        </div>
      </div>
      <CashoutModal isOpen={isCashoutModalOpen} onClose={toggleCashoutModal} />
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Bitcoin Deposit Address</h2>
            <p>This is your Bitcoin deposit address, send only Bitcoin to this address. Sending any other token will result in loss of assets.</p>
            <div className="qr-code">
              {isLoading ? (
                <p>Loading QR Code...</p>
              ) : (
                <QRCode value={bitcoinAddress} size={256} bgColor={"#1f1f1f"} fgColor={"#ffffff"} />
              )}
            </div>
            <p className="bitcoin-address">{isLoading ? 'Loading address...' : bitcoinAddress}</p>
            <p>Payments can take hours to confirm, do not panic when such happens. If after 24 hours of payment there is no reflection, contact support.</p>
            <div className="modal-actions">
              <button className="btn-close" onClick={toggleModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Sidebar;