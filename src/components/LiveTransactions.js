import React, { useEffect, useState, useRef } from 'react';
import './LiveTransactions.css';

// Function to generate a random six-letter username
const generateRandomUsername = (existingUsernames) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let username = '';

  // Keep generating until we get a unique one
  do {
    username = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      username += letters[randomIndex];
    }
  } while (existingUsernames.has(username)); // Ensure no immediate repetition

  return username;
};

// Function to generate a random time within the last 100 seconds
const generateRandomTime = () => {
  return new Date(new Date().getTime() - Math.random() * 100000).toLocaleTimeString();
};

// Function to generate a random amount between min and max values
const generateRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const LiveTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const existingUsernames = useRef(new Set()); // Use useRef to track usernames

  // Generate two random initial transactions with random usernames and times
  useEffect(() => {
    const initialTransactions = Array.from({ length: 2 }).map((_, index) => {
      const username = generateRandomUsername(existingUsernames.current); // Use the ref
      const time = generateRandomTime();
      return {
        id: index + 1,
        user: username,
        amount: generateRandomAmount(267, 517), // Use the new range
        time,
      };
    });

    setTransactions(initialTransactions);

    // Add the initial usernames to the set of existing usernames
    initialTransactions.forEach((txn) => {
      existingUsernames.current.add(txn.user); // Update the ref directly
    });
  }, []); // Empty dependency array so this runs only once

  // Simulate live transactions coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = {
        id: transactions.length + 1,
        user: generateRandomUsername(existingUsernames.current), // Use the ref
        amount: generateRandomAmount(267, 517), // Use the new range
        time: generateRandomTime(), // Random time
      };

      // Add the new username to the set of existing ones
      existingUsernames.current.add(newTransaction.user); // Update the ref

      // Add the new transaction to the list
      setTransactions((prev) => [newTransaction, ...prev]);

    }, Math.random() * 4000 + 3000); // Random interval between 3 to 7 seconds

    return () => clearInterval(interval);
  }, [transactions]); // Track transactions as a dependency

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
