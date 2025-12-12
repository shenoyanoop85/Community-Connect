
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, Megaphone, CheckSquare, Search } from 'lucide-react';
import { BOOKINGS } from '../../constants';

const AdminTile = ({ icon, title, count, color, onClick }: any) => (
    <div onClick={onClick} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer">
        <div className={`p-3 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
            {count !== undefined && <p className="text-xs text-gray-400 mt-1">{count}</p>}
        </div>
    </div>
);

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const pendingBookings = BOOKINGS.filter(b => b.status === 'Pending').length;

    return (
        <div className="min-h-screen bg-slate-100 pb-10">
            {/* Dark Header */}
            <div className="bg-slate-900 pt-12 pb-10 px-6 rounded-b-[40px] shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                         <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                         <span className="text-white font-medium">All Systems Operational</span>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 grid grid-cols-2 gap-4">
                <AdminTile 
                    icon={<Users size={24} className="text-blue-600" />}
                    title="Manage Residents"
                    count="Search & Edit"
                    color="bg-blue-100"
                    onClick={() => navigate('/admin/residents')}
                />
                <AdminTile 
                    icon={<CheckSquare size={24} className="text-purple-600" />}
                    title="Hall Bookings"
                    count={`${pendingBookings} Pending`}
                    color="bg-purple-100"
                    onClick={() => navigate('/admin/bookings')}
                />
                <AdminTile 
                    icon={<Calendar size={24} className="text-orange-600" />}
                    title="Events"
                    count="Create & Edit"
                    color="bg-orange-100"
                    onClick={() => navigate('/admin/events')}
                />
                <AdminTile 
                    icon={<Megaphone size={24} className="text-emerald-600" />}
                    title="News & Alerts"
                    count="Post Updates"
                    color="bg-emerald-100"
                    onClick={() => navigate('/admin/announcements')}
                />
            </div>

            <div className="px-6 mt-8">
                <h3 className="font-bold text-slate-900 mb-4">Quick Lookup</h3>
                <div onClick={() => navigate('/admin/residents')} className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-200 text-gray-400 cursor-pointer">
                    <Search size={20} />
                    <span>Search resident by name, apt...</span>
                </div>
            </div>
        </div>
    );
};
