import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, MapPin, Activity, Settings, FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { HALL_DETAILS } from '../constants';

export const BookHall = () => {
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