import React, { useEffect, useState, useRef, useCallback } from 'react';
import { userService } from '../services/api';
import './LiveTransactions.css';

// Function to generate a random username
const generateRandomUsername = (existingUsernames) => {
  // Expanded lists for more username variety
  const prefixes = ['Cool', 'Super', 'Mega', 'Ultra', 'Epic', 'Pro', 'Ninja', 'Cyber', 'Star', 'Cosmic', 
    'Alpha', 'Tech', 'Elite', 'Fast', 'Genius', 'Top', 'Prime', 'Magic', 'Power', 'Retro', 'Dark', 'Neon', 'Hyper'];
  
  const suffixes = ['Gamer', 'Player', 'Master', 'Legend', 'Hero', 'Warrior', 'Knight', 'Wizard', 'Phoenix', 'Dragon', 
    'Hunter', 'King', 'Queen', 'Coder', 'Trader', 'Boss', 'Ghost', 'Titan', 'Sage', 'Ninja', 'Explorer', 'Hacker'];
  
  // List of adjectives for middle parts
  const adjectives = ['Happy', 'Brave', 'Swift', 'Clever', 'Mighty', 'Noble', 'Royal', 'Wild', 'Silent', 'Shadow', 
    'Mystic', 'Fierce', 'Flying', 'Radiant', 'Golden', 'Silver', 'Crystal', 'Frozen', 'Burning', 'Digital', 'Ancient', 
    'Eternal', 'Savage', 'Lone', 'Storm', 'Jade', 'Iron', 'Steel', 'Ruby', 'Emerald'];
  
  // List of nouns for middle parts
  const nouns = ['Wolf', 'Eagle', 'Tiger', 'Lion', 'Hawk', 'Bear', 'Fox', 'Deer', 'Horse', 'Falcon', 
    'Panther', 'Raven', 'Viper', 'Shark', 'Cobra', 'Dragon', 'Phoenix', 'Griffin', 'Pegasus', 'Titan', 
    'Jaguar', 'Lynx', 'Badger', 'Kestrel', 'Osprey', 'Serpent', 'Raptor', 'Wyvern', 'Chimera', 'Basilisk'];
  
  let username = '';
  
  // Keep generating until we get a unique one
  do {
    // Randomly choose a pattern (1-5) for even more variety
    const pattern = Math.floor(Math.random() * 5) + 1;
    
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
    } else if (pattern === 3) {
      // Pattern 3: Noun + Suffix (e.g., "WolfMaster")
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      username = noun + suffix;
    } else if (pattern === 4) {
      // Pattern 4: Prefix + Noun + Suffix (e.g., "MegaWolfLegend")
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      // Don't always add the suffix to avoid overly long names
      if (Math.random() > 0.5) {
        username = prefix + noun;
      } else {
        username = prefix + noun + suffix;
      }
    } else {
      // Pattern 5: Double Adjective + Noun (e.g., "SilentSwiftEagle")
      const adjective1 = adjectives[Math.floor(Math.random() * adjectives.length)];
      const adjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      
      // Avoid duplicate adjectives
      if (adjective1 !== adjective2) {
        username = adjective1 + adjective2 + noun;
      } else {
        username = adjective1 + noun;
      }
    }
    
    // Add a random number (0-999) with 80% probability
    if (Math.random() < 0.8) {
      const randomNum = Math.floor(Math.random() * 1000);
      username += randomNum;
    }
    
  } while (existingUsernames.has(username)); // Ensure no immediate repetition
  
  return username;
};

// Function to generate a random amount between min and max values
const generateRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to format time as "X minutes ago" or "just now"
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 1000); // seconds
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// Function to generate avatar text from username
const getAvatarText = (username) => {
  if (!username) return '';
  
  // Try to extract first letter of each word (e.g., "SW" for "SwiftWolf123")
  const letters = username.match(/[A-Z]/g);
  if (letters && letters.length > 1) {
    return letters.slice(0, 2).join('');
  }
  
  // Fallback to first two characters
  return username.slice(0, 2).toUpperCase();
};

// Function to check if a product is recent (within last 24 hours)
const isRecentPurchase = (timestamp) => {
  if (!timestamp) return false;
  const now = new Date();
  const purchaseDate = new Date(timestamp);
  const diffMs = now - purchaseDate;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < 24; // Less than 24 hours old
};

const LiveTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTransactionId, setNewTransactionId] = useState(null);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const existingUsernames = useRef(new Set());
  const containerRef = useRef(null);

  // Media query detector
  const handleScreenSizeChange = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Set up screen size detection
  useEffect(() => {
    handleScreenSizeChange();
    
    window.addEventListener('resize', handleScreenSizeChange);
    return () => {
      window.removeEventListener('resize', handleScreenSizeChange);
    };
  }, [handleScreenSizeChange]);

  // Fetch user's purchase history
  useEffect(() => {
    const fetchUserPurchases = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) return;

        // Try to fetch user's purchase history
        const response = await userService.getPurchaseHistory();
        if (response.data && Array.isArray(response.data)) {
          const purchases = response.data.map(purchase => ({
            id: purchase.id || `purchase-${Date.now()}-${Math.random()}`,
            productId: purchase.product_id,
            productName: purchase.product_name || 'Unknown Product',
            amount: purchase.amount || purchase.price,
            time: new Date(purchase.purchase_date || purchase.created_at),
            isUserPurchase: true,
            type: purchase.product_type || 'purchase'
          }));
          
          // Filter recent purchases (last 24 hours)
          const recent = purchases.filter(p => isRecentPurchase(p.time));
          setRecentPurchases(recent);
          
          // Set notification count for new purchases
          if (recent.length > 0 && !isExpanded) {
            setNotificationCount(recent.length);
          }
        }
      } catch (error) {
        console.error('Error fetching user purchase history:', error);
        // Fallback to mock data if API fails
        const mockPurchases = [
          {
            id: 'purchase-1',
            productId: 'card-123',
            productName: 'Premium Card',
            amount: 350,
            time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            isUserPurchase: true,
            type: 'card'
          },
          {
            id: 'purchase-2',
            productId: 'dump-456',
            productName: 'Bank Dump',
            amount: 450,
            time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            isUserPurchase: true,
            type: 'dump'
          }
        ];
        
        setRecentPurchases(mockPurchases.filter(p => isRecentPurchase(p.time)));
        
        if (mockPurchases.length > 0 && !isExpanded) {
          setNotificationCount(mockPurchases.length);
        }
      }
    };

    fetchUserPurchases();
    
    // Refresh purchase history every 5 minutes
    const interval = setInterval(fetchUserPurchases, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isExpanded]); // Added isExpanded as a dependency

  // Generate initial transactions
  useEffect(() => {
    // Generate more initial transactions for more variety
    const initialTransactions = Array.from({ length: 6 }).map((_, index) => {
      const username = generateRandomUsername(existingUsernames.current);
      existingUsernames.current.add(username);
      
      return {
        id: index + 1,
        user: username,
        amount: generateRandomAmount(200, 700), // Wider range for more variety
        time: new Date(Date.now() - Math.random() * 3600000 * 3), // Random time within last 3 hours
        avatar: getAvatarText(username)
      };
    });

    // Combine user's recent purchases with random transactions
    const combinedTransactions = [...recentPurchases, ...initialTransactions]
      .sort((a, b) => b.time - a.time); // Sort by newest first
    
    setTransactions(combinedTransactions);
  }, [recentPurchases]);

  // Simulate new transactions periodically (at a slower tempo)
  useEffect(() => {
    const interval = setInterval(() => {
      const newUser = generateRandomUsername(existingUsernames.current);
      existingUsernames.current.add(newUser);
      
      const newTransaction = {
        id: Date.now(), // Use timestamp as ID for uniqueness
        user: newUser,
        amount: generateRandomAmount(200, 700),
        time: new Date(),
        avatar: getAvatarText(newUser),
        isNew: true
      };

      setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]); // Keep up to 10 items
      setNewTransactionId(newTransaction.id);
      
      // Increment notification count if panel is collapsed
      if (!isExpanded) {
        setNotificationCount(prev => prev + 1);
      }
      
      // Auto-expand mobile view when new transaction arrives
      if (isMobile && !isExpanded) {
        setIsExpanded(true);
        // Auto-collapse after 3 seconds on mobile
        setTimeout(() => {
          setIsExpanded(false);
        }, 3000);
      }
      
    }, Math.random() * 15000 + 15000); // Random interval between 15-30 seconds (lower tempo)

    return () => clearInterval(interval);
  }, [isMobile, isExpanded]); // Fixed the dependency array

  // Clear "new" highlight after 2 seconds
  useEffect(() => {
    if (newTransactionId) {
      const timer = setTimeout(() => {
        setNewTransactionId(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [newTransactionId]);

  // Toggle expansion
  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
    // Clear notification count when expanded
    if (!isExpanded) {
      setNotificationCount(0);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button className="live-transactions-trigger" onClick={toggleExpansion}>
        <i>💸</i>
        <span className="live-pulse"></span>
        {notificationCount > 0 && (
          <span className="notification-badge">{notificationCount}</span>
        )}
      </button>
      
      {/* Main container */}
      <div 
        className={`live-transactions-container ${isExpanded ? 'expanded' : ''}`}
        ref={containerRef}
      >
        <div className="live-transactions-header" onClick={isMobile ? toggleExpansion : undefined}>
          <h3 className="live-transactions-title">
            <span className="live-pulse"></span>
            Live Transactions
          </h3>
          <button className="minimize-button" onClick={toggleExpansion}>
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {isExpanded && (
          <ul className="live-transactions-body">
            {transactions.map(transaction => (
              <li 
                key={transaction.id} 
                className={`transaction-item 
                  ${transaction.id === newTransactionId ? 'new' : ''} 
                  ${transaction.isUserPurchase ? 'your-product' : ''}`}
              >
                <div className="transaction-user">
                  <div className="user-avatar">
                    {transaction.isUserPurchase ? 'YOU' : transaction.avatar}
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {transaction.isUserPurchase ? 'You purchased' : transaction.user}
                    </span>
                    <span className="transaction-time">
                      {formatTimeAgo(transaction.time)}
                    </span>
                    {transaction.isUserPurchase && transaction.productName && (
                      <span className="product-info">{transaction.productName}</span>
                    )}
                  </div>
                </div>
                <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default LiveTransactions;
