import React, { useEffect, useState, useRef } from 'react';
import './LiveTransactions.css';

// Function to generate a random username
const generateRandomUsername = (existingUsernames) => {
  // List of prefixes and suffixes for more interesting usernames
  const prefixes = ['Cool', 'Super', 'Mega', 'Ultra', 'Epic', 'Pro', 'Ninja', 'Cyber', 'Star', 'Cosmic'];
  const suffixes = ['Gamer', 'Player', 'Master', 'Legend', 'Hero', 'Warrior', 'Knight', 'Wizard', 'Phoenix', 'Dragon'];
  
  // List of adjectives for middle parts
  const adjectives = ['Happy', 'Brave', 'Swift', 'Clever', 'Mighty', 'Noble', 'Royal', 'Wild', 'Silent', 'Shadow'];
  
  // List of nouns for middle parts
  const nouns = ['Wolf', 'Eagle', 'Tiger', 'Lion', 'Hawk', 'Bear', 'Fox', 'Deer', 'Horse', 'Falcon'];
  
  let username = '';
  
  // Keep generating until we get a unique one
  do {
    // Randomly choose a pattern (1-3)
    const pattern = Math.floor(Math.random() * 3) + 1;
    
    if (pattern === 1) {
      // Pattern 1: Prefix + Adjective (e.g., "CoolBrave")
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      username = prefix + adjective;
    } else if (pattern === 2) {
      // Pattern 2: Adjective + Noun (e.g., "SwiftWolf")
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      username = adjective + noun;
    } else {
      // Pattern 3: Noun + Suffix (e.g., "WolfMaster")
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      username = noun + suffix;
    }
    
    // Add a random number (0-999) to ensure uniqueness
    const randomNum = Math.floor(Math.random() * 1000);
    username += randomNum;
    
  } while (existingUsernames.has(username)); // Ensure no immediate repetition
  
  return username;
};

// Function to generate a random amount between min and max values
const generateRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const LiveTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const existingUsernames = useRef(new Set()); // Use useRef to track usernames
  const tickerRef = useRef(null);

  // Generate three random initial transactions with random usernames
  useEffect(() => {
    const initialTransactions = Array.from({ length: 3 }).map((_, index) => {
      const username = generateRandomUsername(existingUsernames.current); // Use the ref
      return {
        id: index + 1,
        user: username,
        amount: generateRandomAmount(267, 517), // Use the new range
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
      };

      // Add the new username to the set of existing ones
      existingUsernames.current.add(newTransaction.user); // Update the ref

      // Add the new transaction to the list and limit to 5 transactions
      setTransactions((prev) => {
        const updated = [newTransaction, ...prev];
        return updated.slice(0, 5); // Keep only the 5 most recent transactions
      });

    }, Math.random() * 3000 + 2000); // Random interval between 2 to 5 seconds

    return () => clearInterval(interval);
  }, [transactions]); // Track transactions as a dependency

  // Create a continuous ticker effect by duplicating transactions
  const tickerTransactions = [...transactions, ...transactions];

  return (
    <ul className="live-transactions" ref={tickerRef}>
      {tickerTransactions.map((txn, index) => (
        <li key={`${txn.id}-${index}`}>
          <span className="user">{txn.user}</span>
          <span className="amount">${txn.amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
};

export default LiveTransactions;
