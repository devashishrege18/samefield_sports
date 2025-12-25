import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Fandom from './pages/Fandom';
import Forum from './pages/Forum';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Copyright from './pages/Copyright';
import Contact from './pages/Contact';
import Help from './pages/Help';
import { PointsProvider } from './context/PointsContext';
import { VoiceProvider } from './context/VoiceContext';
import PurposeModal from './components/PurposeModal';

const App = () => {
  return (
    <PointsProvider>
      <VoiceProvider>
        <Router>
          <PurposeModal />
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Home />} />
              <Route path="watch" element={<Watch />} />
              <Route path="fandom" element={<Fandom />} />
              <Route path="fandom/:id" element={<Fandom />} />
              <Route path="forum" element={<Forum />} />
              <Route path="discover" element={<Discover />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            {/* Legal Pages - Outside Dashboard Layout */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/copyright" element={<Copyright />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </VoiceProvider>
    </PointsProvider>
  );
};

export default App;
