import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, Shield, Phone, ChevronRight, MapPin, Share2, Flame, Activity, HelpCircle } from 'lucide-react';

const EmergencyTile = ({ icon, label, color, bg }: any) => (
    <div className={`h-36 ${bg} rounded-[28px] flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform cursor-pointer shadow-sm border border-transparent hover:border-black/5`}>
        <div className={`p-4 bg-white rounded-full shadow-sm ${color}`}>{icon}</div>
        <span className="font-bold text-gray-800">{label}</span>
    </div>
);

export const Emergency = () => {
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