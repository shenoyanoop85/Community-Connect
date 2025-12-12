import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin, ChevronLeft } from 'lucide-react';
import { EVENTS } from '../constants';
import { PullToRefresh } from '../components/PullToRefresh';

export const EventsList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const filters = ['All', 'This Week', 'This Month', 'Upcoming'];

    const handleRefresh = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const getFilteredEvents = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return EVENTS.filter(event => {
            const eventDate = new Date(event.date);
            
            // Handle invalid date parsing gracefully
            if (isNaN(eventDate.getTime())) return true;

            switch (filter) {
                case 'Upcoming':
                    // Events happening today or in the future
                    return eventDate >= today;
                
                case 'This Month':
                    return eventDate.getMonth() === now.getMonth() && 
                           eventDate.getFullYear() === now.getFullYear();
                
                case 'This Week': {
                    // Calculate start (Sunday) and end (Saturday) of current week
                    const currentDay = today.getDay(); // 0 is Sunday
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - currentDay);
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(today);
                    endOfWeek.setDate(today.getDate() + (6 - currentDay));
                    endOfWeek.setHours(23, 59, 59, 999);
                    
                    return eventDate >= startOfWeek && eventDate <= endOfWeek;
                }
                
                case 'All':
                default:
                    return true;
            }
        });
    };

    const filteredEvents = getFilteredEvents();

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="min-h-screen bg-white pb-28">
                <div className="pt-12 px-6 pb-4 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition-colors active:scale-95">
                            <ChevronLeft size={20} className="text-slate-700"/>
                        </button>
                        <h1 className="text-2xl font-bold">Rajsri Events</h1>
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
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
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
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <p className="text-lg font-medium">No events found</p>
                            <p className="text-sm">Try changing the filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </PullToRefresh>
    )
}