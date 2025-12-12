import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Zap, Shield, Users, MapPin, ChevronRight, Megaphone, Check } from 'lucide-react';
import { CURRENT_USER, EVENTS, ANNOUNCEMENTS } from '../constants';
import { PullToRefresh } from '../components/PullToRefresh';

const Tile = ({ icon, title, bg, onClick }: any) => (
  <div onClick={onClick} className={`${bg} h-40 rounded-[36px] flex flex-col items-center justify-center gap-4 shadow-sm active:scale-95 transition-transform cursor-pointer border border-white/50`}>
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
        {icon}
    </div>
    <span className="font-semibold text-slate-900 text-lg tracking-tight">{title}</span>
  </div>
);

// Stunning Quick Action Component
const QuickAction = ({ icon, label, gradient, shadow, onClick }: any) => (
    <div onClick={onClick} className="flex flex-col items-center gap-3 cursor-pointer group active:scale-95 transition-transform">
        <div className={`w-16 h-16 rounded-full ${gradient} flex items-center justify-center text-white shadow-xl ${shadow} ring-4 ring-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl relative overflow-hidden`}>
            {/* Gloss sheen */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
            {icon}
        </div>
        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition-colors uppercase tracking-wider">{label}</span>
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
        
        {/* Header Section (Redesigned Hero) */}
        <div className="relative h-[280px] rounded-b-[20px] overflow-hidden shadow-2xl mb-6 group shrink-0">
            {/* Background & Overlay */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    alt="Dashboard Header" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 pt-16 flex justify-between items-start">
                <div className="flex items-center gap-5">
                    <div className="relative cursor-pointer group/avatar" onClick={() => navigate('/profile')}>
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm group-hover/avatar:bg-white/30 transition-colors"></div>
                        <img 
                            src={CURRENT_USER.avatar} 
                            alt="Profile" 
                            className="relative w-16 h-16 rounded-full border-[3px] border-white shadow-xl object-cover" 
                        />
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-[3px] border-slate-900 rounded-full z-10"></div>
                    </div>
                    <div className="flex flex-col pt-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight leading-none mb-1.5 drop-shadow-md">
                            Hey {CURRENT_USER.name.split(' ')[0]},
                        </h1>
                        <p className="text-blue-100/90 font-medium text-sm tracking-wide flex items-center gap-2">
                             Good morning <span className="animate-pulse">✨</span>
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/notifications')}
                    className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-white/20 transition-all active:scale-95 group/bell"
                >
                    <Bell size={22} className="group-hover/bell:rotate-12 transition-transform" />
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900/50 shadow-sm"></span>
                </button>
            </div>
            
            {/* Decorative Overlay for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </div>

        {/* Feature Tiles & Quick Actions */}
        <div className="px-6 mb-8">
            <div className="grid grid-cols-2 gap-5 mb-8">
                <Tile 
                    icon={<Zap className="text-blue-600 fill-blue-600" size={32} />} 
                    title="Events" 
                    bg="bg-blue-100" 
                    onClick={() => navigate('/events')} 
                />
                <Tile 
                    icon={<Calendar className="text-purple-600" size={32} strokeWidth={2.5} />} 
                    title="Book Hall" 
                    bg="bg-purple-100" 
                    onClick={() => navigate('/book-hall')} 
                />
            </div>
            
            {/* Quick Actions (Redesigned) */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100/50">
                <div className="flex justify-around items-center">
                    <QuickAction 
                        icon={<Megaphone className="fill-white/20 stroke-white" size={28} />} 
                        label="News" 
                        gradient="bg-gradient-to-br from-orange-400 to-orange-600"
                        shadow="shadow-orange-200"
                        onClick={() => navigate('/announcements')}
                    />
                    <QuickAction 
                        icon={<Shield className="fill-white/20 stroke-white" size={28} />} 
                        label="SOS" 
                        gradient="bg-gradient-to-br from-red-500 to-rose-600"
                        shadow="shadow-red-200"
                        onClick={() => navigate('/emergency')}
                    />
                    <QuickAction 
                        icon={<Users className="fill-white/20 stroke-white" size={28} />} 
                        label="Volunteers" 
                        gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
                        shadow="shadow-emerald-200"
                        onClick={() => navigate('/volunteers')}
                    />
                </div>
            </div>
        </div>

        {/* Upcoming Events Carousel (Hero Cards) */}
        <div className="flex flex-col mb-10">
            <div className="flex items-center justify-between px-6 mb-5">
                <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
                <button onClick={() => navigate('/events')} className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full">See All</button>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-8 px-6 gap-5 snap-x snap-mandatory">
                {EVENTS.map((event, index) => (
                    <div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className="relative min-w-[85%] h-72 rounded-[32px] overflow-hidden snap-center shadow-lg group cursor-pointer bg-gray-200">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${event.image}")` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        
                        {/* Date Badge */}
                        <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-wide shadow-lg">
                            {event.date.split(',')[0]}
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <MapPin className="text-white w-3 h-3" />
                                </div>
                                <span className="text-white/90 text-sm font-medium truncate">{event.location}</span>
                            </div>
                            <h4 className="text-white text-2xl font-bold leading-tight mb-3 line-clamp-2">{event.title}</h4>
                            
                            <div className="flex items-center justify-between">
                                {/* Category Tag */}
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-wide">
                                    {event.category}
                                </span>

                                {/* Fake Attendees Stack */}
                                <div className="flex -space-x-2 overflow-hidden pl-2">
                                    <img alt="Attendee" className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 object-cover" src={`https://picsum.photos/seed/${event.id}a/50/50`} />
                                    <img alt="Attendee" className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 object-cover" src={`https://picsum.photos/seed/${event.id}b/50/50`} />
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
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-900">Latest Updates</h3>
                <button onClick={() => navigate('/announcements')} className="text-blue-600 text-xs font-bold flex items-center gap-1">
                    View All <ChevronRight size={14} />
                </button>
            </div>
            <div className="flex flex-col gap-5">
                {ANNOUNCEMENTS.slice(0,2).map(ann => (
                <div key={ann.id} onClick={() => navigate(`/announcement/${ann.id}`)} className="flex bg-white rounded-[28px] shadow-sm border border-slate-100 w-full cursor-pointer active:scale-[0.98] transition-transform overflow-hidden min-h-[128px]">
                    <div className="w-32 shrink-0 bg-cover bg-center self-stretch" style={{ backgroundImage: `url("${ann.image}")` }}></div>
                    <div className="flex flex-col justify-center p-5 flex-1 min-w-0 relative">
                        {ann.isUnread && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm"></div>}
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(ann.category)}`}></span>
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{ann.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-1.5 truncate">{ann.title}</h4>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-auto">{ann.content}</p>
                        <span className="text-slate-400 text-[10px] font-medium mt-3">{ann.date}</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
        </div>
    </PullToRefresh>
  );
};