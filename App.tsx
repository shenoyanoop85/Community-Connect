import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Bell, Users, User, Search, Menu, ChevronLeft, Heart, Share2, MapPin, Clock, ArrowRight, Download, FileText, Phone, Shield, Flame, Activity, HelpCircle, LogOut, Settings, ChevronRight, Zap, Info, RefreshCw } from 'lucide-react';
import { CURRENT_USER, EVENTS, ANNOUNCEMENTS, VOLUNTEERS, HALL_DETAILS } from './constants';
import { User as UserType } from './types';

// --- COMPONENTS ---

// 0. Pull To Refresh Component
// Fixed: Made children optional to resolve TS error about missing children property in JSX usage
const PullToRefresh = ({ children, onRefresh }: { children?: React.ReactNode, onRefresh: () => Promise<void> }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Only allow pulling if we are dragging down and window is at top
    if (diff > 0 && window.scrollY <= 0) {
       // Add resistance to the pull
       setPullDistance(Math.min(diff * 0.45, 120)); 
    } else {
        setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setRefreshing(true);
      setPullDistance(60); // Snap to loading position
      await onRefresh();
      setRefreshing(false);
      setPullDistance(0);
    } else {
      setPullDistance(0);
    }
    setStartY(0);
  };

  return (
    <div 
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
        className="relative"
    >
        {/* Loader Indicator */}
        <div 
            className="absolute left-0 right-0 flex justify-center pointer-events-none z-50 transition-all duration-300"
            style={{ 
                top: refreshing ? '40px' : `${Math.max(10, pullDistance - 30)}px`,
                opacity: pullDistance > 10 || refreshing ? 1 : 0,
            }}
        >
            <div className="bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-xl border border-gray-100 flex items-center justify-center text-blue-600">
                <RefreshCw size={20} className={`${refreshing ? 'animate-spin' : ''} ${!refreshing && pullDistance > 0 ? 'transform rotate-[120deg] transition-transform duration-500' : ''}`} />
            </div>
        </div>

        {/* Content Wrapper */}
        <div style={{ transform: `translateY(${pullDistance}px)`, transition: refreshing ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.1s' }}>
            {children}
        </div>
    </div>
  );
};

// 1. Navigation
const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Don't show nav on detail pages to give full immersion, or keep it. 
  // Per design "Floating bottom navigation", it often stays. 
  // However, for Emergency, Event Details, Announcement Details, let's hide it for "App" feel.
  const hiddenPaths = ['/emergency', '/event/', '/announcement/', '/book-hall'];
  const shouldHide = hiddenPaths.some(path => location.pathname.includes(path) && path !== '/');

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-full p-2 flex justify-between items-center z-50 border border-white/20">
      <NavButton icon={<Home size={22} />} label="Home" active={isActive('/')} onClick={() => navigate('/')} />
      <NavButton icon={<Calendar size={22} />} label="Events" active={isActive('/events')} onClick={() => navigate('/events')} />
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-blue-300 transform active:scale-95 transition-transform" onClick={() => navigate('/book-hall')}>
        <Zap size={24} className="text-white" />
      </div>
      <NavButton icon={<Bell size={22} />} label="News" active={isActive('/announcements')} onClick={() => navigate('/announcements')} />
      <NavButton icon={<User size={22} />} label="Profile" active={isActive('/profile')} onClick={() => navigate('/profile')} />
    </div>
  );
};

const NavButton = ({ icon, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full transition-all duration-300 ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
  </button>
);

// --- PAGES ---

// 1. DASHBOARD
const Dashboard = () => {
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

        {/* Search */}
        <div className="px-6 mt-2 mb-6">
            <div className="relative shadow-sm">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search community..." 
                className="w-full bg-white py-4 pl-12 pr-4 rounded-full text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
            </div>
        </div>

        {/* Feature Tiles */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-8">
            <Tile 
                icon={<Calendar className="text-blue-600" size={24} />} 
                title="Events" 
                color="bg-blue-50" 
                onClick={() => navigate('/events')} 
            />
            <Tile 
                icon={<Zap className="text-purple-600" size={24} />} 
                title="Book Hall" 
                color="bg-purple-50" 
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
)

// 2. EVENTS LIST
const EventsList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const filters = ['All', 'This Week', 'This Month', 'Upcoming'];

    const handleRefresh = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="min-h-screen bg-white pb-28">
                <div className="pt-12 px-6 pb-4 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Building Activities</h1>
                        <Search className="text-gray-400" />
                    </div>
                    <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                        {filters.map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 space-y-6 mt-2">
                    {EVENTS.map(event => (
                        <div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className="group relative w-full h-[400px] rounded-[32px] overflow-hidden shadow-xl cursor-pointer">
                            <img src={event.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt={event.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold">
                                    {event.category}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors">
                                    <Heart size={18} />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <p className="text-blue-400 font-bold text-sm mb-1 uppercase tracking-wider">{event.date} • {event.time.split('-')[0]}</p>
                                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{event.title}</h2>
                                <div className="flex items-center text-gray-300">
                                    <MapPin size={16} className="mr-2" />
                                    <span className="text-sm">{event.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PullToRefresh>
    )
}

// 3. EVENT DETAILS
const EventDetails = () => {
    const navigate = useNavigate();
    // In a real app we would fetch by ID
    const event = EVENTS[0]; 

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Hero Image */}
            <div className="h-[50vh] w-full relative">
                <img src={event.image} className="w-full h-full object-cover" alt="Hero" />
                <div className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-center z-10">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20">
                        <ChevronLeft />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20">
                        <Share2 size={20} />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                <div className="absolute bottom-12 left-6 right-6">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3 inline-block">TRENDING</span>
                    <h1 className="text-4xl font-bold text-white mb-2 leading-tight shadow-sm">{event.title}</h1>
                    <div className="flex items-center text-white/90 text-sm font-medium">
                        <MapPin size={16} className="mr-2" /> {event.location}
                    </div>
                </div>
            </div>

            {/* Floating Content */}
            <div className="relative -mt-6 bg-white rounded-t-[32px] px-6 pt-8 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[50vh]">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/organizer/100/100" className="w-12 h-12 rounded-full" alt="org" />
                        <div>
                            <p className="text-xs text-gray-400 font-bold tracking-wider">ORGANIZER</p>
                            <p className="font-semibold text-gray-800">SoundWave Events</p>
                        </div>
                    </div>
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-full">Follow</button>
                </div>

                <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar">
                     <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl flex-shrink-0">
                        <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm"><Calendar size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold">DATE</p>
                            <p className="text-sm font-bold text-gray-800">{event.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl flex-shrink-0">
                        <div className="p-2 bg-white rounded-full text-orange-500 shadow-sm"><Clock size={18} /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold">TIME</p>
                            <p className="text-sm font-bold text-gray-800">{event.time.split('-')[0]}</p>
                        </div>
                     </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">About Event</h3>
                <p className="text-gray-500 leading-relaxed mb-8">
                    {event.description} <br/><br/>
                    Enjoy food trucks, art installations, and a vibrant community atmosphere at the historic Brooklyn Navy Yard. Don't miss out on the event of the season!
                </p>

                <h3 className="text-xl font-bold text-gray-800 mb-3">Location</h3>
                <div className="h-48 w-full rounded-2xl bg-gray-200 mb-8 overflow-hidden relative">
                    <img src="https://picsum.photos/seed/map/600/300" className="w-full h-full object-cover opacity-80" alt="map" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 animate-bounce">
                            <MapPin size={24} fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex items-center justify-between z-20">
                <div>
                    <p className="text-xs text-gray-400 font-medium">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900">{event.price}<span className="text-sm text-gray-400 font-normal">/person</span></p>
                </div>
                <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center gap-2">
                    Register Now <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )
}

// 4. ANNOUNCEMENTS LIST
const AnnouncementsList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');

    const handleRefresh = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="min-h-screen bg-slate-50 pb-28">
                <div className="bg-white pt-12 pb-4 px-6 sticky top-0 z-10 shadow-sm rounded-b-[32px]">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search updates..." className="w-full bg-slate-50 py-3 pl-10 pr-4 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {['All', 'Unread', 'Important', 'Events', 'Policy'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 mt-6 space-y-6">
                    {ANNOUNCEMENTS.map(item => (
                        <div key={item.id} onClick={() => navigate(`/announcement/${item.id}`)} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
                            <div className="h-40 overflow-hidden relative">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                                {item.isUnread && (
                                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-500 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> UNREAD
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={12} className="text-blue-500" />
                                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">{item.category}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">{item.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{item.content}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <img src="https://picsum.photos/seed/admin/50/50" className="w-6 h-6 rounded-full" alt="admin" />
                                        <span className="text-xs text-gray-500 font-medium">Posted by {item.author}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{item.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 text-center text-gray-300">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-white">✓</div>
                    <p className="text-xs">You're all caught up!</p>
                </div>
            </div>
        </PullToRefresh>
    )
}

// 5. ANNOUNCEMENT DETAILS
const AnnouncementDetails = () => {
    const navigate = useNavigate();
    const item = ANNOUNCEMENTS[0];

    return (
        <div className="min-h-screen bg-white">
            <div className="relative h-[45vh]">
                <img src={item.image} className="w-full h-full object-cover" alt="detail" />
                <div className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-center z-10">
                     <button onClick={() => navigate(-1)} className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors">
                        <ChevronLeft />
                    </button>
                     <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="relative -mt-10 bg-white rounded-t-[40px] px-8 pt-10 min-h-[60vh] shadow-inner">
                 <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
                 
                 <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                        <Settings size={12} /> {item.category}
                    </span>
                    <span className="text-gray-400 text-sm">{item.date}</span>
                 </div>

                 <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{item.title}</h1>
                 
                 <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                    <img src="https://picsum.photos/seed/manager/100/100" className="w-12 h-12 rounded-full ring-2 ring-white shadow-md" alt="author" />
                    <div>
                        <p className="font-bold text-gray-900">{item.author}</p>
                        <p className="text-xs text-gray-500">Community Manager</p>
                    </div>
                    <div className="ml-auto flex items-center text-gray-400 text-xs">
                         <Activity size={14} className="mr-1" /> 1.2k views
                    </div>
                 </div>

                 <div className="prose prose-blue text-gray-600 mb-8 leading-relaxed">
                    <p>{item.content}</p>
                    <p className="mt-4">Starting next Monday, the pool will reopen with extended summer hours. Residents can enjoy the facilities from <span className="font-bold text-blue-600">6:00 AM to 10:00 PM</span> daily. We are also introducing morning aqua-aerobics classes every Tuesday and Thursday, free for all registered residents.</p>
                    
                    <blockquote className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl my-6 italic text-blue-800 font-medium text-sm">
                        "The new heated section will be available starting November 1st, perfect for evening swims."
                    </blockquote>

                    <p>Please review the attached schedule for specific maintenance blocks where the pool might be temporarily unavailable for cleaning.</p>
                 </div>

                 <div className="mb-12">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Attached Files <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">2</span>
                    </h3>
                    <div className="space-y-3">
                        {item.attachments?.map((file, idx) => (
                            <div key={idx} className="flex items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${file.type === 'pdf' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-800">{file.name}</p>
                                    <p className="text-xs text-gray-400">{file.size} • {file.type === 'pdf' ? 'PDF Document' : 'Image'}</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Download size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Action Button - Sticky if needed, but here inline */}
                 <div className="pb-10">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex justify-center items-center gap-2">
                        <Calendar size={20} /> Add to Calendar
                    </button>
                 </div>
            </div>
        </div>
    )
}

// 6. EMERGENCY PAGE
const Emergency = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Red Section */}
            <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white pt-12 pb-12 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"><ChevronLeft /></button>
                    <h1 className="font-bold tracking-widest text-sm opacity-80">EMERGENCY</h1>
                    <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"><Settings size={18} /></button>
                </div>

                <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Shield className="text-red-500 fill-red-500" size={32} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Do you need help?</h2>
                    <p className="text-white/80 text-sm max-w-xs leading-relaxed">Press the button below to contact emergency services immediately.</p>
                </div>

                {/* Slider Button Simulation */}
                <div className="mt-10 mx-auto max-w-sm bg-white rounded-full p-2 pr-6 shadow-2xl flex items-center gap-4 cursor-pointer active:scale-95 transition-transform relative z-10">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                        <Phone className="text-white animate-bounce" />
                    </div>
                    <span className="text-red-500 font-bold text-lg flex-1 text-center tracking-wide">SLIDE TO CALL 911</span>
                    <ChevronRight className="text-gray-300" />
                </div>
            </div>

            {/* Location */}
            <div className="px-6 -mt-6 relative z-10 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-50 flex flex-col gap-3">
                     <div className="h-24 bg-gray-200 rounded-xl w-full relative overflow-hidden">
                        <img src="https://picsum.photos/seed/maploc/600/200" className="w-full h-full object-cover opacity-60" alt="map" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                <MapPin size={10} /> San Francisco, CA
                            </span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center px-2">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Current Location</p>
                            <p className="font-bold text-gray-800">123 Maple Ave, Apt 4B</p>
                        </div>
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Share2 size={18} /></button>
                     </div>
                </div>
            </div>

            {/* Categories */}
            <div className="px-6 flex-1">
                <div className="flex justify-between items-end mb-4">
                     <h3 className="font-bold text-lg text-gray-800">What's the emergency?</h3>
                     <span className="text-xs text-gray-400">Select one</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <EmergencyTile icon={<Flame size={28} />} label="Fire" color="text-orange-500" bg="bg-orange-50" />
                    <EmergencyTile icon={<Activity size={28} />} label="Medical" color="text-blue-500" bg="bg-blue-50" />
                    <EmergencyTile icon={<Shield size={28} />} label="Security" color="text-purple-500" bg="bg-purple-50" />
                    <EmergencyTile icon={<HelpCircle size={28} />} label="Other" color="text-gray-600" bg="bg-gray-100" />
                </div>
            </div>
            
            {/* Contacts */}
            <div className="p-6 mt-auto">
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Emergency Contacts</h3>
                    <button className="text-blue-500 text-sm font-medium">Manage</button>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <Settings size={20} /> {/* Using Settings icon as placeholder for Plus/Add */}
                        </div>
                        <span className="text-xs text-gray-500">Add New</span>
                    </div>
                    {['Mom', 'John', 'Sarah'].map((name, i) => (
                         <div key={name} className="flex flex-col items-center gap-2">
                            <img src={`https://picsum.photos/seed/contact${i}/100/100`} className="w-14 h-14 rounded-full object-cover border border-gray-100" alt={name} />
                            <span className="text-xs text-gray-600 font-medium">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const EmergencyTile = ({ icon, label, color, bg }: any) => (
    <div className={`h-36 ${bg} rounded-[28px] flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform cursor-pointer shadow-sm border border-transparent hover:border-black/5`}>
        <div className={`p-4 bg-white rounded-full shadow-sm ${color}`}>{icon}</div>
        <span className="font-bold text-gray-800">{label}</span>
    </div>
)


// 7. BOOK HALL PAGE
const BookHall = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white pb-24">
             <div className="h-[40vh] relative">
                <img src={HALL_DETAILS.image} className="w-full h-full object-cover" alt="hall" />
                <button onClick={() => navigate(-1)} className="absolute top-12 left-6 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50"><ChevronLeft /></button>
                <div className="absolute top-12 right-6 flex gap-2">
                    <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white"><Share2 size={18} /></button>
                    <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white"><Heart size={18} /></button>
                </div>
             </div>
             
             <div className="px-6 pt-6 -mt-8 bg-white rounded-t-[32px] relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{HALL_DETAILS.name}</h1>
                    <div className="text-right">
                        <p className="text-blue-600 font-bold text-xl">${HALL_DETAILS.pricePerHour}</p>
                        <p className="text-xs text-gray-400">per hour</p>
                    </div>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" /> Downtown Center, San Francisco
                </div>

                <div className="flex gap-2 mb-6">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1">4.8 ★</span>
                    <span className="text-xs text-gray-400 underline py-1">120 reviews</span>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-2">About this hall</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{HALL_DETAILS.description}</p>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4">Amenities</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                        {HALL_DETAILS.amenities.map(a => (
                            <div key={a} className="flex flex-col items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 text-gray-600 gap-2">
                                <div className="text-blue-500">
                                    {a.includes('Wifi') ? <Activity /> : a.includes('Cooling') ? <Settings /> : <FileText />}
                                </div>
                                <span className="text-[10px] font-bold">{a}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-24">
                    <h3 className="font-bold text-gray-900 mb-4">Select Date</h3>
                    {/* Simulated Calendar Widget */}
                    <div className="bg-white border border-gray-100 shadow-lg rounded-3xl p-4">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="font-bold text-gray-800">August 2024</span>
                            <div className="flex gap-2">
                                <ChevronLeft size={16} className="text-gray-400" />
                                <ChevronRight size={16} className="text-gray-800" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-gray-400 text-xs font-bold mb-2">{d}</span>)}
                            {Array.from({length: 31}).map((_, i) => (
                                <div key={i} className={`h-8 w-8 flex items-center justify-center rounded-full text-sm cursor-pointer ${i === 23 ? 'bg-blue-600 text-white shadow-lg shadow-blue-300' : 'text-gray-700 hover:bg-gray-100'}`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>

             <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex items-center justify-between z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div>
                    <p className="text-xs text-gray-400 font-medium">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900">$150<span className="text-sm text-gray-400 font-normal"> for 3 hrs</span></p>
                </div>
                <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center gap-2">
                    Book Now <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )
}

// 8. VOLUNTEERS
const Volunteers = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');

    return (
        <div className="min-h-screen bg-slate-50 pb-28">
            <div className="bg-white pt-12 pb-4 px-6 sticky top-0 z-10 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                        <h1 className="text-xl font-bold">Volunteers</h1>
                    </div>
                    <Search className="text-gray-400" />
                </div>
                <div className="flex gap-2">
                    {['All', 'Committee', 'Helpers'].map(f => (
                         <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 rounded-full text-xs font-bold transition-colors ${filter === f ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border border-gray-200 text-gray-500'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Core Team</p>
                <div className="space-y-4">
                    {VOLUNTEERS.map(v => (
                        <div key={v.id} className="bg-white p-4 rounded-[24px] shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={v.image} className="w-14 h-14 rounded-full object-cover" alt={v.name} />
                                    {v.isActive && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900">{v.name}</h3>
                                        {v.isActive && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Active</span>}
                                    </div>
                                    <p className="text-blue-500 text-sm font-medium">{v.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Settings size={16} /> Message
                                </button>
                                <button className="w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <Phone size={18} />
                                </button>
                                <button className="w-12 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <FileText size={18} /> {/* Email icon placeholder */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4">Community Helpers</p>
                <div className="bg-white p-6 rounded-[24px] shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                        <Users size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">Join the Team</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-4">Become a volunteer and help your community thrive.</p>
                    <button className="text-blue-600 font-bold text-sm">Apply Now &rarr;</button>
                </div>
            </div>
        </div>
    )
}

// 9. PROFILE
const Profile = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white pb-28">
            <div className="pt-12 px-6 flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                <h1 className="font-bold text-lg">Profile</h1>
                <button><Settings size={20} /></button>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                    <img src={CURRENT_USER.avatar} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl" alt="profile" />
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 transition-colors">
                        <Settings size={14} /> {/* Edit icon */}
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{CURRENT_USER.name}</h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4">Community Lead</span>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-full text-sm">Edit Profile</button>
            </div>

            <div className="px-6 flex justify-between mb-8 text-center divide-x divide-gray-100">
                <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">124</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Posts</p>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">1.5k</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Followers</p>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">340</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Following</p>
                </div>
            </div>

            <div className="px-4 space-y-6">
                <div className="space-y-2">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase">Account</p>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <ProfileItem icon={<User size={18} />} label="Personal Information" />
                        <div className="h-px bg-gray-50 mx-4"></div>
                        <ProfileItem icon={<Bell size={18} />} label="Notifications" />
                        <div className="h-px bg-gray-50 mx-4"></div>
                        <ProfileItem icon={<Shield size={18} />} label="Privacy & Security" />
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase">Preferences</p>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Settings size={18} /></div>
                                <span className="font-medium text-gray-700">Dark Mode</span>
                            </div>
                            <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                    <LogOut size={18} /> Log Out
                </button>
            </div>
        </div>
    )
}

const ProfileItem = ({ icon, label }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">{icon}</div>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
    </div>
)

// --- APP ---

const App = () => {
  return (
    <HashRouter>
      <div className="font-sans antialiased text-gray-900 bg-slate-50 min-h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden sm:rounded-[40px] sm:my-10 sm:h-[90vh] sm:overflow-y-auto no-scrollbar sm:border-[8px] sm:border-gray-800">
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
    </HashRouter>
  );
};

export default App;