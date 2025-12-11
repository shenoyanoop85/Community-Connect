import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, LogOut, User, Bell, Shield, ChevronRight } from 'lucide-react';
import { CURRENT_USER } from '../constants';

const ProfileItem = ({ icon, label }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">{icon}</div>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
    </div>
);

export const Profile = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white pb-28">
            <div className="pt-12 px-6 flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                <h1 className="font-bold text-lg">Profile</h1>
                <button><Settings size={20} /></button>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                    <img src={CURRENT_USER.avatar} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl" alt="profile" />
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 transition-colors">
                        <Settings size={14} /> {/* Edit icon */}
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{CURRENT_USER.name}</h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4">Community Lead</span>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-full text-sm">Edit Profile</button>
            </div>

            <div className="px-6 flex justify-between mb-8 text-center divide-x divide-gray-100">
                <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">124</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Posts</p>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">1.5k</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Followers</p>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">340</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Following</p>
                </div>
            </div>

            <div className="px-4 space-y-6">
                <div className="space-y-2">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase">Account</p>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <ProfileItem icon={<User size={18} />} label="Personal Information" />
                        <div className="h-px bg-gray-50 mx-4"></div>
                        <ProfileItem icon={<Bell size={18} />} label="Notifications" />
                        <div className="h-px bg-gray-50 mx-4"></div>
                        <ProfileItem icon={<Shield size={18} />} label="Privacy & Security" />
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase">Preferences</p>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Settings size={18} /></div>
                                <span className="font-medium text-gray-700">Dark Mode</span>
                            </div>
                            <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                    <LogOut size={18} /> Log Out
                </button>
            </div>
        </div>
    )
}