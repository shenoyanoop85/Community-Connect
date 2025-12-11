import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Zap, Bell, User } from 'lucide-react';

const NavButton = ({ icon, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full transition-all duration-300 ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
  </button>
);

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Don't show nav on detail pages to give full immersion
  const hiddenPaths = ['/emergency', '/event/', '/announcement/', '/book-hall'];
  const shouldHide = hiddenPaths.some(path => location.pathname.includes(path) && path !== '/');

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-full p-2 flex justify-between items-center z-50 border border-white/20">
      <NavButton icon={<Home size={22} />} label="Home" active={isActive('/')} onClick={() => navigate('/')} />
      <NavButton icon={<Zap size={22} />} label="Events" active={isActive('/events')} onClick={() => navigate('/events')} />
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-blue-300 transform active:scale-95 transition-transform" onClick={() => navigate('/book-hall')}>
        <Calendar size={24} className="text-white" />
      </div>
      <NavButton icon={<Bell size={22} />} label="News" active={isActive('/announcements')} onClick={() => navigate('/announcements')} />
      <NavButton icon={<User size={22} />} label="Profile" active={isActive('/profile')} onClick={() => navigate('/profile')} />
    </div>
  );
};