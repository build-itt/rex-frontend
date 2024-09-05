import React, {useEffect} from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MainContent from './MainContent';
import axios from 'axios';

const Dashboard = () => {
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://avyjg4i5avov7sikuxeskxm4wjgkuxtzr6tcd4zxmsblf5rcsdp763id.onion/pay/balance/', { headers: { Authorization: `Token ${token}` } });
        const { balance } = response.data;
        localStorage.setItem('balance', balance);
      } catch (error) {
        console.error('Failed to fetch balance', error);
      }
    };

    fetchBalance();
  }, []);
  return (
    <div className="Dashboard">
      <Sidebar />
      <Topbar />
      <MainContent />
    </div>
  );
};

export default Dashboard;