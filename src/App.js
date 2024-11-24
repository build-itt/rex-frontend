import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignInPage';
import SignUp from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import Cards from './components/Cards';
import Table from './components/Table';
import Dumps from './components/Dumps';
import History from './components/History';
import PasswordResetConfirm from './components/PasswordResetConfirm'; // Import the PasswordResetConfirm component
import RouteWrapper from './components/RouteWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectToDashboard from './components/RedirectToDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <RouteWrapper>
        <Routes>
          <Route exact path="/" element={<RedirectToDashboard element={LandingPage} />} />
          <Route path="/signin" element={<RedirectToDashboard element={SignIn} />} />
          <Route path="/signup" element={<RedirectToDashboard element={SignUp} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/banks/:slug" element={<ProtectedRoute element={Table} />} />
          <Route path="/dumps" element={<ProtectedRoute element={Dumps} />} />
          <Route path="/cards" element={<ProtectedRoute element={Cards} />} />
          <Route path="/history" element={<ProtectedRoute element={History} />} />
          <Route path="/password/reset" element={<PasswordResetConfirm />} /> {/* Update the route */}
        </Routes>
      </RouteWrapper>
    </Router>
  );
}

export default App;