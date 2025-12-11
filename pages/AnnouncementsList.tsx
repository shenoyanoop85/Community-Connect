import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { ANNOUNCEMENTS } from '../constants';
import { PullToRefresh } from '../components/PullToRefresh';

export const AnnouncementsList = () => {
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