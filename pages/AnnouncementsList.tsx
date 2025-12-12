import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, AlertCircle, FileText, Wrench } from 'lucide-react';
import { ANNOUNCEMENTS } from '../constants';
import { PullToRefresh } from '../components/PullToRefresh';

export const AnnouncementsList = () => {
    const navigate = useNavigate();

    const handleRefresh = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'Maintenance':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    border: 'border-emerald-100',
                    icon: <Wrench size={12} />
                };
            case 'Alert':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    border: 'border-red-100',
                    icon: <AlertCircle size={12} />
                };
            case 'Policy':
                return {
                    bg: 'bg-orange-50',
                    text: 'text-orange-600',
                    border: 'border-orange-100',
                    icon: <FileText size={12} />
                };
            default:
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                    border: 'border-blue-100',
                    icon: <Calendar size={12} />
                };
        }
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="min-h-screen bg-slate-50 pb-28">
                {/* Header */}
                <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-10 shadow-sm flex items-center gap-4">
                     <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition-colors active:scale-95">
                        <ChevronLeft size={20} className="text-slate-700"/>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                </div>

                <div className="px-4 mt-6 space-y-6">
                    {ANNOUNCEMENTS.map(item => {
                        const style = getCategoryStyles(item.category);
                        return (
                            <div key={item.id} onClick={() => navigate(`/announcement/${item.id}`)} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer active:scale-[0.98] transition-transform">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                                    {item.isUnread && (
                                        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-500 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> UNREAD
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    {/* Updated Category Badge */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${style.bg} ${style.text} ${style.border}`}>
                                            {style.icon}
                                            {item.category}
                                        </span>
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
                        );
                    })}
                </div>
                
                <div className="mt-8 text-center text-gray-300">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-white">✓</div>
                    <p className="text-xs">You're all caught up!</p>
                </div>
            </div>
        </PullToRefresh>
    )
}