import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Zap, Shield, Users, MapPin } from 'lucide-react';
import { CURRENT_USER, EVENTS, ANNOUNCEMENTS } from '../constants';
import { PullToRefresh } from '../components/PullToRefresh';

const Tile = ({ icon, title, color, onClick }: any) => (
  <div onClick={onClick} className={`${color} h-32 rounded-3xl p-5 flex flex-col justify-between items-start shadow-sm active:scale-95 transition-transform cursor-pointer`}>
    <div className="p-2 bg-white rounded-full shadow-sm">{icon}</div>
    <span className="font-semibold text-gray-800">{title}</span>
  </div>
);

const SmallTile = ({ icon, label, onClick }: any) => (
    <div onClick={onClick} className="bg-white rounded-full h-24 flex flex-col items-center justify-center shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer gap-2">
        <div className={`p-2 rounded-full bg-gray-50`}>{icon}</div>
        <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleRefresh = async () => {
    // Simulate data fetching
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen bg-slate-50 pb-28">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
            <div>
            <p className="text-gray-500 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Hi, {CURRENT_USER.name} <span className="text-2xl">👋</span>
            </h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 bg-gray-100 rounded-full relative" onClick={() => navigate('/announcements')}>
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <img src={CURRENT_USER.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" onClick={() => navigate('/profile')} />
            </div>
        </div>

        {/* Feature Tiles */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-8 mt-6">
            <Tile 
                icon={<Zap className="text-blue-600" size={24} />} 
                title="Events" 
                color="bg-blue-50" 
                onClick={() => navigate('/events')} 
            />
            <Tile 
                icon={<Calendar className="text-blue-600" size={24} />} 
                title="Book Hall" 
                color="bg-blue-50" 
                onClick={() => navigate('/book-hall')} 
            />
            <div className="col-span-2 grid grid-cols-3 gap-4">
                <SmallTile icon={<Bell className="text-orange-500" size={20} />} label="News" onClick={() => navigate('/announcements')} />
                <SmallTile icon={<Shield className="text-red-500" size={20} />} label="SOS" onClick={() => navigate('/emergency')} />
                <SmallTile icon={<Users className="text-green-500" size={20} />} label="Helpers" onClick={() => navigate('/volunteers')} />
            </div>
        </div>

        {/* Carousel */}
        <div className="pl-6 mb-8">
            <div className="flex justify-between items-center pr-6 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Happening Now</h2>
            <button className="text-blue-600 text-sm font-medium" onClick={() => navigate('/events')}>See All</button>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 pr-6 no-scrollbar snap-x">
                {EVENTS.map(event => (
                    <div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className="min-w-[280px] h-[320px] relative rounded-3xl overflow-hidden shadow-lg snap-center flex-shrink-0">
                        <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-5 w-full">
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md mb-2 inline-block border border-white/10">{event.category}</span>
                            <h3 className="text-white text-xl font-bold mb-1 leading-tight">{event.title}</h3>
                            <div className="flex items-center text-gray-300 text-sm">
                                <MapPin size={14} className="mr-1" /> {event.location}
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
                            {event.date.split(',')[0]}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Latest Updates */}
        <div className="px-6 pb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Latest Updates</h2>
            <div className="space-y-4">
                {ANNOUNCEMENTS.slice(0,2).map(ann => (
                <div key={ann.id} onClick={() => navigate(`/announcement/${ann.id}`)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                    <img src={ann.image} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" alt="news" />
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${ann.category === 'Alert' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                            <span className="text-xs text-gray-400 uppercase font-semibold">{ann.category}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{ann.title}</h4>
                        <span className="text-xs text-gray-400 mt-2">{ann.date}</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
        </div>
    </PullToRefresh>
  );
};