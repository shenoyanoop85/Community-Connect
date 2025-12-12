
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Share2, MapPin, Calendar, Clock, ArrowRight, Bell, CheckCircle, Star, BellRing } from 'lucide-react';
import { EVENTS } from '../constants';

export const EventDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const event = EVENTS.find(e => e.id === id) || EVENTS[0];
    
    // State for local interactions
    const [isRegistered, setIsRegistered] = useState(false);
    const [reminderSet, setReminderSet] = useState(false);
    const [currentRegisteredCount, setCurrentRegisteredCount] = useState(event.registeredCount || 0);
    
    const capacity = event.capacity || 100;
    const attendees = event.attendees || [];
    
    // Derived state
    const percentFull = Math.min(100, Math.round((currentRegisteredCount / capacity) * 100));
    const isSoldOut = currentRegisteredCount >= capacity;
    const spotsLeft = Math.max(0, capacity - currentRegisteredCount);

    const handleShare = () => {
        const text = `Check out this event: *${event.title}*\n\n📅 ${event.date} @ ${event.time}\n📍 ${event.location}\n\n${event.description}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleReminder = () => {
        const newState = !reminderSet;
        setReminderSet(newState);
        if (newState) {
            alert(`Reminder set! We'll notify you 1 hour before ${event.title}.`);
        }
    };

    const handleRegister = () => {
        if (!isRegistered && !isSoldOut) {
            setIsRegistered(true);
            setCurrentRegisteredCount(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Hero Image */}
            <div className="h-[50vh] w-full relative group">
                <img src={event.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hero" />
                <div className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-center z-10">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-95 transition-transform hover:bg-black/30">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-95 transition-transform hover:bg-black/30">
                        <Share2 size={18} />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>
                <div className="absolute bottom-12 left-6 right-6">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-bold uppercase tracking-wide mb-3 inline-block">
                        {event.category}
                    </span>
                    <h1 className="text-3xl font-bold text-white mb-2 leading-tight shadow-sm">{event.title}</h1>
                    <div className="flex items-center text-white/90 text-sm font-medium">
                        <MapPin size={16} className="mr-2" /> {event.location}
                    </div>
                </div>
            </div>

            {/* Floating Content */}
            <div className="relative -mt-8 bg-white rounded-t-[40px] px-6 pt-8 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[60vh]">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 opacity-50"></div>
                
                {/* Organizer Row */}
                <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${event.organizer || 'Admin'}&background=random`} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" alt="org" />
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Organizer</p>
                            <p className="font-bold text-gray-800 text-sm">{event.organizer || 'Community Committee'}</p>
                        </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white text-blue-600 border border-blue-100 text-xs font-bold rounded-full hover:bg-blue-50 transition-colors">Follow</button>
                </div>

                <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
                     <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex-1 min-w-[140px]">
                        <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm"><Calendar size={18} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                            <p className="text-sm font-bold text-gray-900">{event.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 px-4 py-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex-1 min-w-[140px]">
                        <div className="p-2 bg-white rounded-full text-orange-500 shadow-sm"><Clock size={18} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Time</p>
                            <p className="text-sm font-bold text-gray-900">{event.time.split('-')[0]}</p>
                        </div>
                     </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">About Event</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {event.description}
                    </p>
                </div>

                {/* Requirements & Benefits */}
                {(event.requirements?.length || event.benefits?.length) ? (
                    <div className="mb-8 grid grid-cols-1 gap-6">
                        {event.requirements && event.requirements.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-slate-400" /> Requirements
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.requirements.map((req, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {event.benefits && event.benefits.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Star size={16} className="text-amber-400 fill-amber-400" /> Member Benefits
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.benefits.map((ben, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl text-xs font-bold">
                                            {ben}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}

                {/* Attendees & Capacity */}
                <div className="mb-8 p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm">
                   <div className="flex justify-between items-center mb-3">
                       <div>
                           <p className="font-bold text-gray-900 text-sm">Who's Coming</p>
                           <p className="text-xs text-gray-400 mt-0.5">{currentRegisteredCount} people registered</p>
                       </div>
                       <div className="flex -space-x-3">
                           {attendees.slice(0, 3).map((img, i) => (
                               <img key={i} src={img} className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" alt="attendee" />
                           ))}
                           {currentRegisteredCount > 3 && (
                               <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                   +{currentRegisteredCount - 3}
                               </div>
                           )}
                       </div>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="mt-4">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide mb-1.5">
                           <span className={isSoldOut ? "text-red-500" : "text-emerald-600"}>
                               {isSoldOut ? "Sold Out" : "Available Spots"}
                           </span>
                           <span className="text-gray-400">{spotsLeft} left</span>
                       </div>
                       <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                           <div 
                                className={`h-full rounded-full transition-all duration-1000 ${isSoldOut ? 'bg-red-400' : 'bg-emerald-500'}`} 
                                style={{width: `${percentFull}%`}}
                           ></div>
                       </div>
                   </div>
                </div>

                <div className="mb-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Location</h3>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                        <div className="p-3 bg-white rounded-2xl text-red-500 shadow-sm shrink-0">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg mb-1">{event.location}</p>
                            <p className="text-gray-500 text-sm whitespace-pre-wrap">{event.address || `${event.location}, City Center`}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 flex items-center gap-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={handleReminder}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                        reminderSet 
                        ? 'bg-orange-100 text-orange-600 border border-orange-200' 
                        : 'bg-orange-50 border border-orange-100 text-orange-600 hover:bg-orange-100 active:scale-95'
                    }`}
                >
                    {reminderSet ? <BellRing size={20} className="fill-orange-600" /> : <Bell size={20} />} 
                    {reminderSet ? 'Set' : 'Reminder'}
                </button>
                <button 
                    onClick={handleRegister}
                    disabled={isSoldOut || isRegistered}
                    className={`flex-[2] py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2
                        ${isRegistered
                            ? 'bg-gray-200 text-gray-500 shadow-none cursor-default'
                            : isSoldOut 
                                ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed' 
                                : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 active:scale-95'
                        }`}
                >
                    {isRegistered ? (
                        <>Registered <CheckCircle size={18} /></>
                    ) : isSoldOut ? (
                        <span>Sold Out</span>
                    ) : (
                        <>Register Now <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
    )
}
