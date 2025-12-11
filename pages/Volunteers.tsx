import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Settings, Phone, FileText, Users } from 'lucide-react';
import { VOLUNTEERS } from '../constants';

export const Volunteers = () => {
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