import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, AlertTriangle, CheckCircle, Calendar, ArrowRight, X } from 'lucide-react';
import { ANNOUNCEMENTS, EVENTS } from '../constants';

export const Notifications = () => {
    const navigate = useNavigate();
    
    // 1. Get Emergency Alerts (Category 'Alert')
    const emergencyAlerts = ANNOUNCEMENTS.filter(a => a.category === 'Alert' && a.isUnread);

    // 2. Get Unread Announcements (Non-Alerts)
    const unreadNews = ANNOUNCEMENTS.filter(a => a.category !== 'Alert' && a.isUnread);

    // 3. Get "Unregistered" Events (Mock logic: All upcoming events not full)
    // In a real app, we would filter out events the user ID is already associated with.
    const upcomingEvents = EVENTS.filter(e => {
        const eventDate = new Date(e.date);
        const now = new Date();
        const isFuture = eventDate >= now;
        const isNotFull = (e.registeredCount || 0) < (e.capacity || 0);
        return isFuture && isNotFull;
    });

    const [dismissed, setDismissed] = useState<string[]>([]);

    const handleDismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDismissed([...dismissed, id]);
    };

    const isAllCaughtUp = emergencyAlerts.length === 0 && unreadNews.filter(n => !dismissed.includes(n.id)).length === 0 && upcomingEvents.length === 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            {/* Header */}
            <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-20 shadow-sm border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ChevronLeft className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                </div>
                <div className="relative">
                    <Bell className="text-gray-400" size={20} />
                    {!isAllCaughtUp && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
                </div>
            </div>

            <div className="px-6 py-6 space-y-8">
                
                {/* 1. EMERGENCY SECTION */}
                {emergencyAlerts.length > 0 && (
                    <div className="space-y-3">
                         <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={14} /> Critical Alerts
                        </h3>
                        {emergencyAlerts.map(alert => (
                            <div key={alert.id} onClick={() => navigate(`/announcement/${alert.id}`)} className="bg-red-50 border border-red-100 p-5 rounded-[24px] relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
                                <div className="absolute top-0 right-0 p-8 bg-red-500/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-700 text-lg leading-tight mb-1">{alert.title}</h4>
                                        <p className="text-red-600/80 text-sm line-clamp-2">{alert.content}</p>
                                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wide">
                                            View Details <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. ACTION REQUIRED (Unread Announcements) */}
                {unreadNews.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Action Required</h3>
                        </div>
                        {unreadNews.filter(n => !dismissed.includes(n.id)).map(news => (
                            <div key={news.id} onClick={() => navigate(`/announcement/${news.id}`)} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 relative group cursor-pointer active:scale-[0.98] transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                        news.category === 'Policy' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {news.category}
                                    </span>
                                    <button onClick={(e) => handleDismiss(news.id, e)} className="text-gray-300 hover:text-gray-500 p-1">
                                        <X size={14} />
                                    </button>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{news.title}</h4>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{news.content}</p>
                                <div className="flex items-center gap-2 text-xs text-blue-600 font-bold">
                                    Read & Acknowledge <ArrowRight size={12} />
                                </div>
                            </div>
                        ))}
                         {unreadNews.filter(n => !dismissed.includes(n.id)).length === 0 && unreadNews.length > 0 && (
                             <div className="text-center py-4 text-gray-400 text-sm italic">All items dismissed</div>
                         )}
                    </div>
                )}

                {/* 3. OPEN INVITATIONS (Unregistered Events) */}
                {upcomingEvents.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Open Invitations</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {upcomingEvents.map(event => (
                                <div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="w-20 h-20 rounded-2xl bg-gray-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${event.image}")` }}></div>
                                    <div className="flex-1 py-1">
                                        <p className="text-xs font-bold text-blue-500 mb-0.5 uppercase tracking-wide">{event.date}</p>
                                        <h4 className="font-bold text-gray-900 leading-tight mb-2">{event.title}</h4>
                                        <div className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full gap-1">
                                            RSVP <ArrowRight size={10} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* EMPTY STATE */}
                {isAllCaughtUp && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h2>
                        <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">
                            No new alerts, unread announcements, or pending event registrations.
                        </p>
                        <button onClick={() => navigate('/dashboard')} className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200">
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
