import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignInPage';
import SignUp from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import Table from './components/Table';
import Dumps from './components/Dumps';
import History from './components/History';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/table" element={<Table />} />
          <Route path="/dumps" element={<Dumps />} />
          <Route path="/history" element={<History />} />
        </Routes>
    </Router>
  );
}

export default App;