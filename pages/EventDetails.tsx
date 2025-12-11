import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { EVENTS } from '../constants';

export const EventDetails = () => {
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