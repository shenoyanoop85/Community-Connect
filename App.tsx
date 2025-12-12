import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EventsList } from './pages/EventsList';
import { EventDetails } from './pages/EventDetails';
import { AnnouncementsList } from './pages/AnnouncementsList';
import { AnnouncementDetails } from './pages/AnnouncementDetails';
import { Emergency } from './pages/Emergency';
import { BookHall } from './pages/BookHall';
import { Volunteers } from './pages/Volunteers';
import { Profile } from './pages/Profile';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';

// Wrapper component to handle routing logic that requires Router context
const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Force redirect to Login page when the app (re)starts
    navigate('/');
  }, []);

  return (
    <div className="font-sans antialiased text-gray-900 bg-slate-50 min-h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden sm:rounded-[40px] sm:my-10 sm:h-[90vh] sm:overflow-y-auto no-scrollbar sm:border-[8px] sm:border-gray-800">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/announcements" element={<AnnouncementsList />} />
        <Route path="/announcement/:id" element={<AnnouncementDetails />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/book-hall" element={<BookHall />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;