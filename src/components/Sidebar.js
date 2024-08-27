import React, { useState, forwardRef } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faMoneyBillWave, faBank, faCashRegister, faHistory, faHeadset, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';

const Sidebar = forwardRef(({ sidebarOpen, handleCloseClick }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const bitcoinAddress = "bc1qzzuuqkczq8n7u0kmvv6pwgqfv9s2ufhnffydxt";

  return (
    <>
      <div ref={ref} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h1 className="sidebar-title">DarkPass</h1>
        <ul className="menu-items">
          <li className="menu-item active" onClick={() =>navigate('/dashboard')}>
            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
          </li>
          <li className="menu-item" onClick={toggleModal}>
            <FontAwesomeIcon icon={faMoneyBillWave} /> Add Balance
          </li>
          <li className="menu-item" onClick={() => navigate('/dumps')}>
            <FontAwesomeIcon icon={faCashRegister} /> Dumps with Pins
          </li>
          <li className="menu-item dropdown">
            <FontAwesomeIcon icon={faBank} /> US Banks
            <ul className="dropdown-content">
              <li onClick={() => navigate('/table')}>Bank of America</li>
              <li>Chase</li>
            </ul>
          </li>
          <li className="menu-item dropdown">
            <FontAwesomeIcon icon={faBank} /> UK Banks
            <ul className="dropdown-content">
              <li>HSBC</li>
              <li>Barclays</li>
            </ul>
          </li>
        </ul>
        <div className='topbar-element'>
          <ul className="menu-items">
            <li className="menu-item" onClick={() => navigate('/history')}>
              <FontAwesomeIcon icon={faHistory} /> History
            </li>
            <li className="menu-item">
              <FontAwesomeIcon icon={faHeadset} /> Support
            </li>
            <li className="menu-item" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </div>
        <div className='sidebar-footer'>
          <button className='btn-s' onClick={toggleModal}>Balance: $40000000.00</button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Bitcoin Deposit Address</h2>
            <p>This is your Bitcoin deposit address, send only Bitcoin to this address. Sending any other token will result in loss of assets.</p>
            <div className="qr-code">
              <QRCode value={bitcoinAddress} size={256} bgColor={"#1f1f1f"} fgColor={"#ffffff"} />
            </div>
            <p className="bitcoin-address">{bitcoinAddress}</p>
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
