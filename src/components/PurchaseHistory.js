import React from 'react';
import "./PurchaseHistory.css";

const PurchaseHistory = ({ purchases }) => {
  return (
    <div className="history-container">
      <h1 className="title">Purchase History</h1>
      <div className="user-info">
        <p><strong>User:</strong> Python_God</p>
        <p><strong>Email:</strong> deagusco@gmail.com</p>
        <p><strong>Total Purchases:</strong> 18</p>
      </div>
      {purchases.map((purchase, index) => (
        <div key={index} className="purchase-card">
          <div className="price">
            <span className="amount">${purchase.amount}</span>
          </div>
          <div className="details">
            <p>{purchase.details}</p>
          </div>
          <div className="actions">
            <span className="total">${purchase.total}</span>
            <button className="btn-paid">Paid</button>
            <button className="btn-decrypt">Decrypt</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseHistory;
