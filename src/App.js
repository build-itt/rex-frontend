import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignInPage';
import SignUp from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import Table from './components/Table';
import Dumps from './components/Dumps';
import History from './components/History';
import RouteWrapper from './components/RouteWrapper'; // Import the new wrapper
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import RedirectToDashboard from './components/RedirectToDashboard'; // Import the RedirectToDashboard component
import './App.css';

function App() {
  return (
    <Router>
      {/* Wrap routes in RouteWrapper to ensure balance check */}
      <RouteWrapper>
        <Routes>
          <Route exact path="/" element={<RedirectToDashboard element={LandingPage} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/banks/:slug" element={<ProtectedRoute element={Table} />} />
          <Route path="/dumps" element={<ProtectedRoute element={Dumps} />} />
          <Route path="/history" element={<ProtectedRoute element={History} />} />
        </Routes>
      </RouteWrapper>
    </Router>
  );
}

export default App;