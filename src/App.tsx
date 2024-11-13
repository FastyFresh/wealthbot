import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FundingPage from './pages/FundingPage';
import ProgressDashboard from './pages/ProgressDashboard';

import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/fund" element={<FundingPage />} />
      <Route path="/dashboard" element={<ProgressDashboard />} />
    </Routes>
  );
};

export default App;
