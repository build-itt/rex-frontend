import React, { useEffect, useState } from 'react';
import './LiveTransactions.css'; // We'll add custom styles for dark mode

const LiveTransactions = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, user: 'User A', amount: 500, time: '10:30 AM' },
    { id: 2, user: 'User B', amount: 1200, time: '10:35 AM' },
  ]);

  // Simulate live transactions coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = {
        id: transactions.length + 1,
        user: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`, // Random User A-Z
        amount: Math.floor(Math.random() * 10000), // Random amount
        time: new Date().toLocaleTimeString(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [transactions]);

  return (
    <div className="live-transactions">
      <h2>Live Transactions</h2>
      <ul>
        {transactions.slice(0, 10).map((txn) => (
          <li key={txn.id}>
            <span className="user">{txn.user}</span>
            <span className="amount">${txn.amount.toFixed(2)}</span>
            <span className="time">{txn.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveTransactions;
