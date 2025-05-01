import React, { useState, Suspense, lazy } from 'react';
import './Topbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faHistory, faHeadset, faSignOutAlt, faTerminal, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import QRCode from 'qrcode.react';

const BalanceButton = lazy(() => import('./TopBarBalance'));

function Topbar() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // Clear the stored token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('balance'); // Clear balance on logout
    navigate('/signin');
  };

  const handleAddBalance = async () => {
    setIsAddressLoading(true);
    try {
      const response = await axios.get('https://rex-backend.vercel.app/pay/add/', { 
        headers: { Authorization: `Token ${token}` } 
      });
      setBitcoinAddress(response.data.addr);
    } catch (error) {
      console.error('Failed to fetch balance', error);
    } finally {
      setIsAddressLoading(false);
    }
  };

  const toggleModal = () => {
    if (!isModalOpen) {
      handleAddBalance();
    }
    setIsModalOpen(!isModalOpen);
    setCopySuccess(false);
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
      <div className="topbar">
        <div className="topbar-buttons desktop-only">
          <span className="nav-link glassy" onClick={() => navigate('/history')}>
            <FontAwesomeIcon icon={faHistory} className="topbar-icon" /> 
            <span className="nav-text">History</span>
          </span>
          <a href="https://t.me/DarkPasssupport/" target="_blank" rel="noopener noreferrer" className="nav-link glassy">
            <FontAwesomeIcon icon={faHeadset} className="topbar-icon" /> 
            <span className="nav-text">Support</span>
          </a>
          <span className="nav-link glassy" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="topbar-icon" /> 
            <span className="nav-text">Logout</span>
          </span>
        </div>
        <div className="mobile-only">
          <Suspense fallback={<div>Loading...</div>}>
            <BalanceButton toggleModal={toggleModal} />
          </Suspense>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2><FontAwesomeIcon icon={faTerminal} /> Bitcoin Deposit</h2>
            <p>Send Bitcoin only to this address. Any other crypto will result in permanent loss.</p>
            <div className="qr-code">
              {isAddressLoading ? (
                <p>Loading QR Code...</p>
              ) : (
                <QRCode value={bitcoinAddress} size={256} bgColor={"#111"} fgColor={"#1bba1b"} />
              )}
            </div>
            <div className="bitcoin-address">
              {isAddressLoading ? 'Loading address...' : bitcoinAddress}
              <button 
                className="copy-btn" 
                onClick={copyToClipboard}
                disabled={isAddressLoading}
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
}

export default Topbar;