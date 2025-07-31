import React, { useState, useEffect, forwardRef, Suspense, lazy } from 'react';
import axios from 'axios'; // If you plan to make additional API calls
import './Sidebar.css';
import CashoutModal from './CashoutModal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faMoneyBillWave, faBank, faCashRegister, faHistory, faHeadset, faSignOutAlt, faChevronDown, faCreditCard, faTerminal, faCopy, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';

const Sidebar = forwardRef(({ sidebarOpen, handleCloseClick }, ref) => {
  const [bitcoinAddress, setBitcoinAddress] = useState(''); // Initialize bitcoin address state
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state
  const token = localStorage.getItem('token');
  const [banksByLocation, setBanksByLocation] = useState({});
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://rex-backend.vercel.app/store/categories/');
        const banks = response.data;

        // Group banks by location
        const groupedBanks = banks.reduce((acc, bank) => {
          const { location } = bank;
          console.log('Processing bank:', bank.name, 'with location:', location); // Debug log
          
          // Handle empty, null, or undefined locations
          const normalizedLocation = location && location.trim() ? location.trim() : 'Other';
          
          if (!acc[normalizedLocation]) {
            acc[normalizedLocation] = [];
          }
          acc[normalizedLocation].push(bank);
          return acc;
        }, {});
        
        console.log('Final grouped banks:', groupedBanks); // Debug log

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
    if (copySuccess) setCopySuccess(false);
  };
  const toggleCashoutModal = () => {
    setIsCashoutModalOpen(!isCashoutModalOpen);
  };
  
  const handleAddBalance = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.get('https://rex-backend.vercel.app/pay/add/', { headers: { Authorization: `Token ${token}` } });
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


  const [liquidGlassOpen, setLiquidGlassOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleDropdownClick = (location) => {
    setSelectedLocation(location);
    setLiquidGlassOpen(true);
  };

  const closeLiquidGlass = () => {
    setLiquidGlassOpen(false);
    setTimeout(() => setSelectedLocation(null), 400); // Delay to allow animation
  };

  const handleBankSelect = (bankSlug) => {
    closeLiquidGlass();
    navigate(`/banks/${bankSlug}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy address: ', err);
      });
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
            <FontAwesomeIcon icon={faCreditCard} /> Clone Cards
          </li>
          {/* Add Cashout BTC menu item 
          <li className="menu-item" onClick={toggleCashoutModal}>
            <FontAwesomeIcon icon={faBitcoinSign} /> Cashout BTC
          </li>
          */}
          {/* Render Banks by Location, filtering out 'Other' */}
          {Object.keys(banksByLocation)
            .filter(location => {
              console.log('Checking location for filtering:', location, 'lowercase:', location.toLowerCase()); // Debug log
              const lowercaseLocation = location.toLowerCase().trim();
              return lowercaseLocation !== 'other' && lowercaseLocation !== '';
            }) // Filter out 'other' and empty locations case-insensitively
            .map(location => {
              console.log('Rendering location:', location); // Debug log
              return (
              <li
                key={location}
                className="menu-item dropdown"
                onClick={() => handleDropdownClick(location)}
              >
                <FontAwesomeIcon icon={faBank} /> {location} Banks <FontAwesomeIcon icon={faChevronDown} />
              </li>
            );
          })}
        </ul>

        <div className='topbar-element'>
          <ul className="menu-items">
            <li className="menu-item" onClick={() => navigate('/history')}>
              <FontAwesomeIcon icon={faHistory} /> History
            </li>
            <li className="menu-item">
              <a href="https://t.me/DarkPasssupport/" target="_blank" rel="noopener noreferrer">
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
      
      {/* Liquid Glass Popup for Bank Selection */}
      {liquidGlassOpen && selectedLocation && (
        <div className={`liquid-glass-overlay ${liquidGlassOpen ? 'active' : ''}`} onClick={closeLiquidGlass}>
          <div className="liquid-glass-popup" onClick={e => e.stopPropagation()}>
            <button className="liquid-glass-close" onClick={closeLiquidGlass}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className="liquid-glass-header">
              <h3 className="liquid-glass-title">{selectedLocation} Banks</h3>
              <p className="liquid-glass-subtitle">Select a Bank to Access</p>
            </div>
            
            <div className="liquid-glass-content">
              {console.log('Modal rendering for location:', selectedLocation, 'banks:', banksByLocation[selectedLocation])} {/* Debug log */}
              {banksByLocation[selectedLocation] && banksByLocation[selectedLocation].length > 0 ? (
                banksByLocation[selectedLocation].map(bank => (
                <div
                  key={bank.id}
                  className="liquid-glass-item"
                  onClick={() => handleBankSelect(bank.slug)}
                >
                  {bank.name}
                </div>
              ))
              ) : (
                <div className="liquid-glass-item">
                  No banks available for {selectedLocation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2><FontAwesomeIcon icon={faTerminal} /> Bitcoin Deposit</h2>
            <p>Send Bitcoin only to this address. Any other crypto will result in permanent loss.</p>
            <div className="qr-code">
              {isLoading ? (
                <p>Loading QR Code...</p>
              ) : (
                <QRCode value={bitcoinAddress} size={256} bgColor={"#111"} fgColor={"#1bba1b"} />
              )}
            </div>
            <div className="bitcoin-address">
              {isLoading ? 'Loading address...' : bitcoinAddress}
              <button 
                className="copy-btn" 
                onClick={copyToClipboard}
                disabled={isLoading}
              >
                {copySuccess ? <><FontAwesomeIcon icon={faCheck} /> Copied</> : <><FontAwesomeIcon icon={faCopy} /> Copy</>}
              </button>
            </div>
            <p>Payments typically confirm within 1-3 hours. Allow up to 24 hours before contacting support.</p>
            <div className="modal-actions">
              <button className="btn-close" onClick={toggleModal}>Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Sidebar;