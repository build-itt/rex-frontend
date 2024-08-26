import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MainContent from './MainContent';

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <Sidebar />
      <Topbar />
      <MainContent />
    </div>
  );
};

export default Dashboard;