
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Phone, X, CheckCircle, Briefcase, User, Shield, Info, Clock, Check } from 'lucide-react';
import { ALL_USERS, GLOBAL_CATEGORIES, CURRENT_USER, updateUserProfile } from '../constants';

export const Volunteers = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    
    // Application Modal State
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    // Changed to array for multi-select
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    // Determine Active Roles (Approved)
    const activeRoles = CURRENT_USER.directory?.isEnabled && CURRENT_USER.directory?.categories 
        ? CURRENT_USER.directory.categories 
        : [];

    // Determine Pending Roles
    const pendingRoles = CURRENT_USER.directoryRequest?.status === 'Pending' 
        ? CURRENT_USER.directoryRequest.categories 
        : [];
    
    const hasPendingRequest = pendingRoles.length > 0;

    const toggleRole = (role: string) => {
        // Prevent toggling if user already has this role actively
        if (activeRoles.includes(role)) return;

        if (selectedRoles.includes(role)) {
            setSelectedRoles(prev => prev.filter(r => r !== role));
        } else {
            setSelectedRoles(prev => [...prev, role]);
        }
    };

    const handleApply = () => {
        if (selectedRoles.length === 0) return;

        // Create a Directory Request
        updateUserProfile(CURRENT_USER.id, {
            directoryRequest: {
                categories: selectedRoles,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            }
        });

        setIsApplyModalOpen(false);
        alert(`Application submitted successfully! Your request for ${selectedRoles.length} roles is pending Admin approval.`);
        setSelectedRoles([]);
    };

    const getFilteredMembers = () => {
        return ALL_USERS.filter(u => {
            // Only show users enabled in directory
            if (!u.directory?.isEnabled) return false;
            
            const isAssoc = u.directory.primaryCategory === 'Association Member';
            
            if (filter === 'All') return true;
            if (filter === 'Association Member') return isAssoc;
            if (filter === 'Volunteer') return !isAssoc; // Anyone not Association Member is considered Volunteer here
            return true;
        });
    };

    const members = getFilteredMembers();

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
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['All', 'Association Member', 'Volunteer'].map(f => (
                         <button 
                            key={f} 
                            onClick={() => setFilter(f)} 
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                filter === f 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                : 'bg-white border border-gray-200 text-gray-500'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-6 space-y-6">
                
                {/* YOUR ROLES CARD (Active or Pending) */}
                {(activeRoles.length > 0 || hasPendingRequest) && (
                    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <User size={18} className="text-blue-500" /> Your Roles
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded">
                                {activeRoles.length} Active • {pendingRoles.length} Pending
                            </span>
                        </div>
                        
                        {/* Active Roles List */}
                        {activeRoles.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Active Assignments</p>
                                <div className="flex flex-wrap gap-2">
                                    {activeRoles.map(role => (
                                        <span key={role} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1.5 shadow-sm">
                                            <CheckCircle size={12} className="fill-green-600/20"/> {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Roles List */}
                        {hasPendingRequest && (
                            <div className={activeRoles.length > 0 ? "pt-4 border-t border-gray-50" : ""}>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Approval</p>
                                    <span className="text-[9px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md animate-pulse">In Review</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {pendingRoles.map(role => (
                                        <span key={role} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold border border-orange-100 flex items-center gap-1.5">
                                            <Clock size={12} /> {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Call to Action for Volunteers */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-[24px] shadow-lg text-center text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none group-hover:bg-white/20 transition-colors duration-500"></div>
                    <h3 className="font-bold text-lg mb-2 relative z-10">
                        {activeRoles.length > 0 ? "Expand your contribution" : "Want to help?"}
                    </h3>
                    <p className="text-blue-100 text-sm mb-4 leading-relaxed relative z-10">
                        {hasPendingRequest 
                            ? "We have received your application. You can apply for more roles once current ones are processed."
                            : "Join the community volunteer team and make a difference."}
                    </p>
                    <button 
                        onClick={() => setIsApplyModalOpen(true)}
                        disabled={hasPendingRequest}
                        className={`font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-colors w-full relative z-10 ${
                            hasPendingRequest 
                            ? 'bg-white/20 text-white/50 cursor-not-allowed'
                            : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-xl active:scale-95'
                        }`}
                    >
                        {hasPendingRequest ? 'Application In Progress' : (activeRoles.length > 0 ? 'Apply for More Roles' : 'Apply Now')}
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <h3 className="font-bold text-gray-900">Community Team</h3>
                        <span className="text-xs text-gray-400">{members.length} members</span>
                    </div>

                    {members.length > 0 ? (
                        members.map(member => (
                            <div key={member.id} className="bg-white p-4 rounded-[24px] shadow-sm flex items-center gap-4 border border-gray-100">
                                <div className="relative">
                                    <img src={member.avatar} className="w-14 h-14 rounded-full object-cover bg-gray-100" alt={member.name} />
                                    {member.directory?.primaryCategory === 'Association Member' && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                                            <Shield size={10} />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate text-base">{member.name}</h3>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs text-blue-600 font-bold flex items-center gap-1.5">
                                            <Briefcase size={12} />
                                            {member.directory?.title}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">
                                            {member.directory?.primaryCategory}
                                            {member.directory?.categories && member.directory.categories.length > 1 && ` +${member.directory.categories.length - 1}`}
                                        </p>
                                    </div>
                                </div>

                                <a 
                                    href={`tel:${member.phone}`}
                                    className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors shadow-sm active:scale-95"
                                >
                                    <Phone size={18} className="fill-green-600/20" />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <User size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No members found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
                    {/* Added mb-20 to ensure it's above bottom nav on mobile */}
                    <div className="bg-white w-full sm:max-w-md rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 mb-20 sm:mb-0">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Join the Team</h2>
                                <p className="text-xs text-gray-400">Select one or more categories</p>
                            </div>
                            <button onClick={() => setIsApplyModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl mb-4 flex gap-3">
                            <Info className="text-blue-600 shrink-0" size={20} />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Your application will be reviewed by the Admin.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-8 max-h-[30vh] overflow-y-auto pr-2">
                            {GLOBAL_CATEGORIES.map(category => {
                                const isSelected = selectedRoles.includes(category);
                                const isAlreadyActive = activeRoles.includes(category);

                                return (
                                    <button 
                                        key={category}
                                        onClick={() => !isAlreadyActive && toggleRole(category)}
                                        disabled={isAlreadyActive}
                                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between group ${
                                            isAlreadyActive
                                            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                                            : isSelected 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                                                : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                                        }`}
                                    >
                                        <span className="truncate">{category}</span>
                                        {isAlreadyActive ? (
                                            <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Active</span>
                                        ) : isSelected && (
                                            <CheckCircle size={14} className="text-white flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button 
                            onClick={handleApply}
                            disabled={selectedRoles.length === 0}
                            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
                                selectedRoles.length > 0 
                                ? 'bg-slate-900 shadow-xl hover:bg-black active:scale-95' 
                                : 'bg-gray-200 cursor-not-allowed text-gray-400'
                            }`}
                        >
                            Submit Application ({selectedRoles.length})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
