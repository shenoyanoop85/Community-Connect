
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, LogOut, User, Bell, Shield, ChevronRight, Mail, Phone, MapPin, Droplet, FileText, Upload, Download, Check, X, Camera, Lock, Smartphone, AlertCircle, Building, DoorOpen } from 'lucide-react';
import { CURRENT_USER, switchUserRole } from '../constants';

const ProfileItem = ({ icon, label, onClick }: any) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">{icon}</div>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
    </div>
);

const DetailRow = ({ icon, label, value, isEditing, onChange, field, type = "text" }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-3 text-gray-500 min-w-[100px]">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        {isEditing ? (
            <input 
                type={type}
                value={value}
                disabled={field === 'phone'} // Phone number usually immutable or needs OTP
                onChange={(e) => onChange(field, e.target.value)}
                className={`text-sm font-bold text-gray-800 text-right w-full bg-gray-50 border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100 transition-all ${field === 'phone' ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'border-gray-200 focus:border-blue-400'}`}
                placeholder={`Enter ${label}`}
            />
        ) : (
            <span className="text-sm font-bold text-gray-800 text-right truncate max-w-[180px]">{value}</span>
        )}
    </div>
);

const Toggle = ({ label, subLabel, checked, onChange, disabled = false }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
        <div className="pr-4">
            <p className={`font-medium text-sm ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>{label}</p>
            {subLabel && <p className="text-xs text-gray-400 mt-1">{subLabel}</p>}
        </div>
        <button 
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`w-11 h-6 rounded-full p-1 transition-colors relative flex-shrink-0 ${checked ? (disabled ? 'bg-blue-300' : 'bg-blue-600') : 'bg-gray-200'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

export const Profile = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState<'main' | 'notifications' | 'privacy'>('main');
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(CURRENT_USER);
    
    // Settings State
    const [notifSettings, setNotifSettings] = useState({
        emergency: true,
        announcements: true,
        events: false,
        volunteers: true
    });
    const [privacySettings, setPrivacySettings] = useState({
        publicProfile: false,
        showEmail: true,
        biometric: true
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    const handleInputChange = (field: string, value: string) => {
        setUserData(prev => {
            const newState = { ...prev, [field]: value };
            
            // Auto-update full address string if block or apartment changes
            if (field === 'block' || field === 'apartment') {
                const b = field === 'block' ? value : (prev.block || '');
                const a = field === 'apartment' ? value : (prev.apartment || '');
                newState.address = `${b}-${a}`.toUpperCase(); // Force Format "Block-Apt"
            }
            return newState;
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUserData(prev => ({ ...prev, avatar: imageUrl }));
        }
    };

    const handleSave = () => {
        // Here you would typically save to backend
        // Update CURRENT_USER ref for demo persistence
        Object.assign(CURRENT_USER, userData);
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setUserData(CURRENT_USER);
        setIsEditing(false);
    };

    const handleDeleteDocument = (index: number) => {
        setUserData(prev => ({
            ...prev,
            documents: prev.documents?.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if ((userData.documents?.length || 0) >= 3) {
            alert('You can only upload a maximum of 3 documents.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('File size exceeds the 2MB limit.');
            return;
        }

        const newDoc = {
            name: file.name,
            type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
        };

        setUserData(prev => ({
            ...prev,
            documents: [...(prev.documents || []), newDoc]
        }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            // Reset to default role for security/clean state simulation
            switchUserRole('Resident');
            navigate('/');
        }
    };

    // --- Sub-Pages Renderers ---

    if (currentView === 'notifications') {
        return (
            <div className="min-h-screen bg-white">
                 <div className="pt-12 px-6 pb-6 flex items-center gap-4 border-b border-gray-50">
                    <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft />
                    </button>
                    <h1 className="font-bold text-lg">Notifications</h1>
                </div>
                <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-2xl mb-6 flex gap-3 items-start">
                        <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-blue-700">Emergency alerts are enabled by default to ensure your safety during critical incidents.</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alerts</h3>
                        <Toggle 
                            label="Emergency Alerts" 
                            subLabel="Fire, Security, and Medical SOS" 
                            checked={notifSettings.emergency} 
                            onChange={() => {}} 
                            disabled={true} 
                        />
                        <Toggle 
                            label="Announcements" 
                            subLabel="Community news and maintenance updates" 
                            checked={notifSettings.announcements} 
                            onChange={(v: boolean) => setNotifSettings(p => ({...p, announcements: v}))} 
                        />
                    </div>

                    <div className="space-y-2 mt-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Activity</h3>
                        <Toggle 
                            label="Event Reminders" 
                            subLabel="Notify me 1 hour before events" 
                            checked={notifSettings.events} 
                            onChange={(v: boolean) => setNotifSettings(p => ({...p, events: v}))} 
                        />
                        <Toggle 
                            label="Volunteer Requests" 
                            subLabel="New opportunities to help" 
                            checked={notifSettings.volunteers} 
                            onChange={(v: boolean) => setNotifSettings(p => ({...p, volunteers: v}))} 
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'privacy') {
        return (
            <div className="min-h-screen bg-white">
                 <div className="pt-12 px-6 pb-6 flex items-center gap-4 border-b border-gray-50">
                    <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft />
                    </button>
                    <h1 className="font-bold text-lg">Privacy & Security</h1>
                </div>
                <div className="p-6">
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Visibility</h3>
                        <Toggle 
                            label="Public Profile" 
                            subLabel="Allow neighbors to see your details" 
                            checked={privacySettings.publicProfile} 
                            onChange={(v: boolean) => setPrivacySettings(p => ({...p, publicProfile: v}))} 
                        />
                        <Toggle 
                            label="Show Email Address" 
                            subLabel="Display email on your public profile" 
                            checked={privacySettings.showEmail} 
                            onChange={(v: boolean) => setPrivacySettings(p => ({...p, showEmail: v}))} 
                        />
                    </div>

                    <div className="space-y-2 mt-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Security</h3>
                        <Toggle 
                            label="Biometric Login" 
                            subLabel="Use FaceID / TouchID to log in" 
                            checked={privacySettings.biometric} 
                            onChange={(v: boolean) => setPrivacySettings(p => ({...p, biometric: v}))} 
                        />
                    </div>

                    <div className="mt-8">
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <Lock className="text-gray-500" size={20} />
                                <span className="font-medium text-gray-700">Change Password</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                    </div>
                    
                    <div className="mt-4">
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <Smartphone className="text-gray-500" size={20} />
                                <span className="font-medium text-gray-700">Active Sessions</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Profile View ---

    return (
        <div className="min-h-screen bg-white pb-28">
            <div className="pt-12 px-6 flex justify-between items-center mb-6">
                <button onClick={() => isEditing ? handleCancel() : navigate(-1)}>
                    {isEditing ? <X className="text-gray-500" /> : <ChevronLeft />}
                </button>
                <h1 className="font-bold text-lg">{isEditing ? 'Edit Profile' : 'My Profile'}</h1>
                <button>
                    {isEditing ? null : <Settings size={20} />}
                </button>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4 group">
                    <img src={userData.avatar} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl transition-transform" alt="profile" />
                    
                    {/* Avatar Upload Input */}
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />

                    {isEditing ? (
                        <button 
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white opacity-100 transition-opacity backdrop-blur-[2px]"
                        >
                            <Camera size={24} />
                        </button>
                    ) : (
                         <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 transition-colors">
                            <Settings size={14} />
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                    <input 
                        type="text" 
                        value={userData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold text-gray-900 mb-1 text-center bg-transparent border-b-2 border-blue-500 outline-none w-2/3 pb-1"
                    />
                ) : (
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{userData.name}</h2>
                )}

                <span className={`px-3 py-1 text-xs font-bold rounded-full mb-4 mt-2 ${userData.role === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {userData.role}
                </span>

                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="px-6 space-y-6">
                
                {/* Personal Information */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User size={18} className="text-blue-500 fill-blue-500/20"/> Personal Details
                    </h3>
                    <div className="space-y-1">
                        <DetailRow 
                            icon={<Mail size={16} />} 
                            label="Email" 
                            value={userData.email} 
                            isEditing={isEditing} 
                            field="email" 
                            onChange={handleInputChange} 
                        />
                        <DetailRow 
                            icon={<Phone size={16} />} 
                            label="Mobile" 
                            value={userData.phone} 
                            isEditing={isEditing} 
                            field="phone" 
                            onChange={handleInputChange} 
                        />
                        
                        {/* Address Block - Split into Block & Apt when editing */}
                        {isEditing ? (
                            <>
                                <DetailRow 
                                    icon={<Building size={16} />} 
                                    label="Block" 
                                    value={userData.block || ''} 
                                    isEditing={true} 
                                    field="block" 
                                    onChange={handleInputChange} 
                                />
                                <DetailRow 
                                    icon={<DoorOpen size={16} />} 
                                    label="Apartment No" 
                                    value={userData.apartment || ''} 
                                    isEditing={true} 
                                    field="apartment" 
                                    onChange={handleInputChange} 
                                />
                            </>
                        ) : (
                            <DetailRow 
                                icon={<MapPin size={16} />} 
                                label="Unit" 
                                value={userData.address} 
                                isEditing={false} 
                                field="address" 
                                onChange={handleInputChange} 
                            />
                        )}

                        <DetailRow 
                            icon={<Droplet size={16} />} 
                            label="Blood Group" 
                            value={userData.bloodGroup || ''} 
                            isEditing={isEditing} 
                            field="bloodGroup" 
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-blue-500 fill-blue-500/20"/> My Documents
                        <span className="text-xs font-normal text-gray-400 ml-auto">
                            {userData.documents?.length || 0}/3
                        </span>
                    </h3>
                    <div className="space-y-3">
                        {userData.documents?.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-[10px] uppercase shadow-sm border border-gray-100">
                                        {doc.type.slice(0, 4)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{doc.name}</span>
                                </div>
                                {isEditing ? (
                                    <button 
                                        onClick={() => handleDeleteDocument(i)}
                                        className="text-red-400 hover:text-red-600 p-2 bg-white rounded-full shadow-sm"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <button className="text-gray-400 hover:text-gray-600 p-2"><Download size={18} /></button>
                                )}
                            </div>
                        ))}
                        
                        {isEditing && (userData.documents?.length || 0) < 3 && (
                            <>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <Upload size={18} /> Upload Document
                                </button>
                                <p className="text-[10px] text-gray-400 text-center">Max 3 files, 2MB each (PDF, JPG, PNG)</p>
                            </>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex gap-4 mb-4">
                         <button 
                            onClick={handleCancel}
                            className="flex-1 py-4 text-gray-600 font-bold bg-gray-100 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 py-4 text-white font-bold bg-blue-600 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <Check size={18} /> Save Changes
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Account Settings */}
                        <div className="space-y-2">
                            <p className="px-2 text-xs font-bold text-gray-400 uppercase">Settings</p>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <ProfileItem 
                                    icon={<Bell size={18} />} 
                                    label="Notifications" 
                                    onClick={() => setCurrentView('notifications')}
                                />
                                <div className="h-px bg-gray-50 mx-4"></div>
                                <ProfileItem 
                                    icon={<Shield size={18} />} 
                                    label="Privacy & Security" 
                                    onClick={() => setCurrentView('privacy')}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mb-4"
                        >
                            <LogOut size={18} /> Log Out
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
