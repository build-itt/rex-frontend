import React, { useState, useEffect, useRef } from 'react';
import Section from './Section';
import Sidebar from './Sidebar'; // Import Sidebar component
import LiveTransactions from './LiveTransactions'; // Import LiveTransactions component
import CommentSection from './CommentSection'; // Import CommentSection component
import './MainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import faTimes for close icon

function MainContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <div>
      <Sidebar ref={sidebarRef} sidebarOpen={sidebarOpen} handleCloseClick={() => setSidebarOpen(false)} />
      <div 
      className={sidebarOpen ? 'menuclose' : 'MenuIcon'} 
      onClick={handleMenuClick}
      >
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
      </div>
      <div className="main-content">
        <div className="main-sections">
          <Section 
            title="Welcome to DarkPass!" 
            content={"The most secretive log brokers on the internet.\nБольшинство людей спрашивают нас о банковских выписках, так что мы расскажем вам, что у нас есть. Если у вас его еще нет, вы можете запросить сопутствующий метод при покупке банковских документов у нас, но имейте в виду, что мы не сможем предоставить вам его, если вы еще этого не сделали. Многие клиенты обращались к нам с просьбой о помощи в обналичивании банковских записей, которые они приобрели в даркнете, но которые либо приостановлены, либо недействительны. Сожалеем, но мы можем помочь вам только с банковскими документами, которые вы приобрели у нас. Крайне важно понимать, что мы являемся надежным источником для покупки банковских логинов. Таким образом, вы можете забыть о покупке логинов на фальшивых хакерских сайтах." }
          />
          <Section 
            title="Terms & Conditions" 
            content={"1. No sharing of accounts.\n2. All inactive accounts will be deleted after 6 months of inactivity\n3. We assume no responsibility for any further activities you take with the purchased log in your possession.\n4. All account left inactive for six months will be deactivated.\n5. Funds sent through Bitcoin will be credited to your account after server confirmation.\n6. All logs bought by users will be sent to you via the email you registered with and will be deleted immediately after.\n⚠️ Do not hesitate to contact customer service when you encounter any issue."} 
          />
          <CommentSection />
        </div>
        <div className="section-live">
          <LiveTransactions />
        </div>
      </div>
    </div>
  );
}

export default MainContent;