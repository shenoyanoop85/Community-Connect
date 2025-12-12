import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Zap, Shield, Users, MapPin, ChevronRight, Megaphone } from 'lucide-react';
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

  const getCategoryColor = (category: string) => {
      switch(category) {
          case 'Policy': return 'bg-emerald-500';
          case 'Alert': return 'bg-orange-500';
          case 'Maintenance': return 'bg-blue-500';
          default: return 'bg-gray-500';
      }
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
                <SmallTile icon={<Megaphone className="text-orange-500" size={20} />} label="News" onClick={() => navigate('/announcements')} />
                <SmallTile icon={<Shield className="text-red-500" size={20} />} label="SOS" onClick={() => navigate('/emergency')} />
                <SmallTile icon={<Users className="text-green-500" size={20} />} label="Volunteers" onClick={() => navigate('/volunteers')} />
            </div>
        </div>

        {/* Upcoming Events Carousel (Updated Style) */}
        <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between px-6 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
                <button onClick={() => navigate('/events')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">See All</button>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-6 px-6 gap-4 snap-x snap-mandatory">
                {EVENTS.map((event, index) => (
                    <div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className="relative min-w-[85%] h-72 rounded-3xl overflow-hidden snap-center shadow-lg group cursor-pointer bg-gray-200">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${event.image}")` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            {event.date.split(',')[0]}
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="text-white w-4 h-4" />
                                <span className="text-white/90 text-sm font-medium truncate">{event.location}</span>
                            </div>
                            <h4 className="text-white text-2xl font-bold leading-tight mb-3 line-clamp-2">{event.title}</h4>
                            
                            <div className="flex items-center justify-between">
                                {/* Category Tag */}
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-wide">
                                    {event.category}
                                </span>

                                {/* Fake Attendees Stack for Visual Appeal */}
                                <div className="flex -space-x-2 overflow-hidden">
                                    <img alt="Attendee" className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 object-cover" src={`https://picsum.photos/seed/${event.id}a/50/50`} />
                                    <img alt="Attendee" className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 object-cover" src={`https://picsum.photos/seed/${event.id}b/50/50`} />
                                    <img alt="Attendee" className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 object-cover" src={`https://picsum.photos/seed/${event.id}c/50/50`} />
                                    <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/20 flex items-center justify-center text-[8px] font-bold text-white">+12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Latest Updates */}
        <div className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Latest Updates</h3>
                <button onClick={() => navigate('/announcements')} className="text-blue-600 text-xs font-bold flex items-center gap-1">
                    View All <ChevronRight size={14} />
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {ANNOUNCEMENTS.slice(0,2).map(ann => (
                <div key={ann.id} onClick={() => navigate(`/announcement/${ann.id}`)} className="flex overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 h-36 w-full cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="w-28 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url("${ann.image}")` }}></div>
                    <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(ann.category)}`}></span>
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{ann.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-1 truncate">{ann.title}</h4>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{ann.content}</p>
                        <span className="text-slate-400 text-[10px] font-medium mt-auto pt-2">{ann.date}</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
        </div>
    </PullToRefresh>
  );
};