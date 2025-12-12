
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, User, Phone, MapPin, Edit2, Users, Shield, HeartHandshake, Briefcase, UserCog, Plus, X, Check, Tag, Trash2, Inbox } from 'lucide-react';
import { ALL_USERS, updateUserProfile, GLOBAL_CATEGORIES, addCategoryToGlobal, removeCategoryFromGlobal } from '../../constants';
import { User as UserType } from '../../types';

type TabType = 'Requests' | 'Users' | 'Admins' | 'Association' | 'Volunteers';

export const AdminResidents = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('Requests');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserType[]>(ALL_USERS); // Local state for immediate UI updates
    
    // --- Edit Modal State ---
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [systemRole, setSystemRole] = useState<'Resident' | 'Admin'>('Resident');
    const [directoryTitle, setDirectoryTitle] = useState('');
    const [userCategories, setUserCategories] = useState<string[]>([]);
    const [primaryCategory, setPrimaryCategory] = useState('');
    const [newCategoryInput, setNewCategoryInput] = useState('');

    // --- Add Global Category Modal State ---
    const [isAddCatOpen, setIsAddCatOpen] = useState(false);
    const [globalCategories, setGlobalCategories] = useState<string[]>(GLOBAL_CATEGORIES);
    const [globalCatInput, setGlobalCatInput] = useState('');

    // --- Filtering Logic ---
    const getFilteredData = () => {
        let data: UserType[] = [];
        
        // 1. Filter by Tab
        if (activeTab === 'Requests') {
            data = users.filter(u => u.directoryRequest?.status === 'Pending');
        } else if (activeTab === 'Users') {
            data = users;
        } else if (activeTab === 'Admins') {
            data = users.filter(u => u.role === 'Admin');
        } else if (activeTab === 'Association') {
            data = users.filter(u => u.directory?.isEnabled && u.directory?.primaryCategory === 'Association Member');
        } else {
            // Volunteers Tab (Everyone else in directory)
            data = users.filter(u => u.directory?.isEnabled && u.directory?.primaryCategory && u.directory.primaryCategory !== 'Association Member');
        }

        // 2. Filter by Search Term (Search entire dataset)
        if (searchTerm.length >= 1) {
            const lowerTerm = searchTerm.toLowerCase();
            return data.filter((item) => 
                item.name.toLowerCase().includes(lowerTerm) ||
                item.phone.includes(lowerTerm) ||
                (item.address && item.address.toLowerCase().includes(lowerTerm)) ||
                (item.directory?.title && item.directory.title.toLowerCase().includes(lowerTerm)) ||
                (item.directory?.primaryCategory && item.directory.primaryCategory.toLowerCase().includes(lowerTerm))
            );
        }

        // 3. If no search, limit to first 20 records
        return data.slice(0, 20);
    };

    const results = getFilteredData();
    const pendingCount = users.filter(u => u.directoryRequest?.status === 'Pending').length;

    // --- Actions ---

    const openEdit = (user: UserType) => {
        setEditingUser(user);
        setSystemRole(user.role);
        setDirectoryTitle(user.directory?.title || '');
        setUserCategories(user.directory?.categories || []);
        setPrimaryCategory(user.directory?.primaryCategory || '');
    };

    const handleAddCategoryToUser = (cat: string) => {
        if (!cat) return;
        if (!userCategories.includes(cat)) {
            const newCats = [...userCategories, cat];
            setUserCategories(newCats);
            // If it's the first category, set as primary automatically
            if (newCats.length === 1) setPrimaryCategory(cat);
        }
        setNewCategoryInput('');
    };

    const handleRemoveCategoryFromUser = (cat: string) => {
        const newCats = userCategories.filter(c => c !== cat);
        setUserCategories(newCats);
        // If primary was removed, reset primary to first available or empty
        if (primaryCategory === cat) {
            setPrimaryCategory(newCats.length > 0 ? newCats[0] : '');
        }
    };

    // New logic to handle requests from within the modal
    const approveRequestedCategory = (cat: string) => {
        handleAddCategoryToUser(cat);
    };

    const clearRequest = () => {
        if (editingUser) {
            updateUserProfile(editingUser.id, { directoryRequest: undefined });
            // Update local state to remove the request banner immediately
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, directoryRequest: undefined } : u));
            
            // Close modal if looking at Requests tab, since this user is no longer a "Request"
            if (activeTab === 'Requests') {
                setEditingUser(null);
            }
        }
    };

    const saveUserProfile = () => {
        if (!editingUser) return;

        let finalTitle = directoryTitle.trim();

        // 1. If Title is empty, use the System Role (Resident/Admin)
        if (finalTitle === '') {
            finalTitle = systemRole;
        } 
        // 2. If title matches 'Admin' but role is changed to 'Resident', update title to 'Resident'
        else if (finalTitle === 'Admin' && systemRole === 'Resident') {
            finalTitle = 'Resident';
        }
        // 3. If title matches 'Resident' but role is changed to 'Admin', update title to 'Admin'
        else if (finalTitle === 'Resident' && systemRole === 'Admin') {
            finalTitle = 'Admin';
        }
        // 4. If title is custom (e.g. 'President'), it remains unchanged regardless of role change

        const directoryData = {
            title: finalTitle,
            categories: userCategories,
            primaryCategory: primaryCategory,
            // Enable in directory if they have a Title OR Categories
            isEnabled: userCategories.length > 0 || finalTitle.length > 0
        };

        const updates: Partial<UserType> = {
            role: systemRole,
            directory: directoryData,
            // When saving, we implicitly clear pending requests as resolved/handled
            directoryRequest: undefined 
        };

        updateUserProfile(editingUser.id, updates);
        
        // Refresh local state
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updates } : u));
        setEditingUser(null);
    };

    const addGlobalCategory = () => {
        if (globalCatInput && !globalCategories.includes(globalCatInput)) {
            // Update local state
            setGlobalCategories([...globalCategories, globalCatInput]);
            // Sync with global constant
            addCategoryToGlobal(globalCatInput);
            setGlobalCatInput('');
        }
    };

    const removeGlobalCategory = (cat: string) => {
        // Update local state
        setGlobalCategories(globalCategories.filter(c => c !== cat));
        // Sync with global constant
        removeCategoryFromGlobal(cat);
    };

    const getTabIcon = (tab: TabType) => {
        switch(tab) {
            case 'Requests': return <Inbox size={16} />;
            case 'Users': return <User size={16} />;
            case 'Admins': return <UserCog size={16} />;
            case 'Association': return <Users size={16} />;
            case 'Volunteers': return <HeartHandshake size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white pt-12 pb-4 px-6 sticky top-0 z-10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                        <h1 className="text-xl font-bold">Community Directory</h1>
                    </div>
                    {/* Add Category (Global Definition) Button */}
                    <button 
                        onClick={() => setIsAddCatOpen(true)}
                        className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                        <Tag size={14} /> Manage Categories
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar gap-2">
                    {(['Requests', 'Users', 'Admins', 'Association', 'Volunteers'] as TabType[]).map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                                    isActive 
                                    ? 'bg-white text-gray-900 shadow-sm grow-[1.5]' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {getTabIcon(tab)}
                                {isActive && <span>{tab}</span>}
                                {tab === 'Requests' && pendingCount > 0 && (
                                    <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full">{pendingCount}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-6 py-6 pb-20">
                {results.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No records found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {results.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4 group">
                                <div className="relative">
                                    <img src={item.avatar} className="w-14 h-14 rounded-full object-cover bg-gray-100" alt={item.name} />
                                    {item.directory?.isEnabled && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                    
                                    {/* Display Logic */}
                                    {activeTab === 'Requests' && item.directoryRequest ? (
                                        <div className="flex flex-col mt-1">
                                            <p className="text-xs text-orange-500 font-bold flex items-center gap-1">
                                                Requesting Access
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {item.directoryRequest.categories.map((cat, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-md text-[10px] font-bold">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : item.directory?.isEnabled ? (
                                        <div className="flex flex-col">
                                            <p className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                                                <Briefcase size={10} /> {item.directory.title || item.role}
                                            </p>
                                            {item.directory.primaryCategory && (
                                                <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wide">
                                                    {item.directory.primaryCategory}
                                                    {item.directory.categories.length > 1 && ` +${item.directory.categories.length - 1}`}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <MapPin size={10} /> {item.address}
                                        </p>
                                    )}
                                </div>

                                <button 
                                    onClick={() => openEdit(item)}
                                    className={`p-2 rounded-xl transition-colors ${activeTab === 'Requests' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Edit2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* EDIT USER DIRECTORY MODAL */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Edit Profile & Privileges</h3>
                            <button onClick={() => setEditingUser(null)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                            <img src={editingUser.avatar} className="w-12 h-12 rounded-full" alt="user" />
                            <div>
                                <p className="font-bold text-gray-900">{editingUser.name}</p>
                                <p className="text-xs text-gray-500">{editingUser.address}</p>
                            </div>
                        </div>

                        {/* PENDING REQUEST SECTION */}
                        {editingUser.directoryRequest && (
                            <div className="mb-6 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-bold text-orange-700 flex items-center gap-2">
                                        <Inbox size={16} /> Pending Request
                                    </h4>
                                    <button onClick={clearRequest} className="text-[10px] text-red-500 font-bold underline">Reject All</button>
                                </div>
                                <p className="text-xs text-orange-600 mb-3">User requested to join these roles. Click to approve.</p>
                                <div className="flex flex-wrap gap-2">
                                    {editingUser.directoryRequest.categories.map(reqCat => {
                                        const isAlreadyAdded = userCategories.includes(reqCat);
                                        return (
                                            <button 
                                                key={reqCat}
                                                onClick={() => !isAlreadyAdded && approveRequestedCategory(reqCat)}
                                                disabled={isAlreadyAdded}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all ${
                                                    isAlreadyAdded 
                                                    ? 'bg-green-100 text-green-700 border-green-200 cursor-default opacity-80' 
                                                    : 'bg-white text-gray-700 border-orange-200 hover:bg-orange-100 hover:text-orange-700 shadow-sm'
                                                }`}
                                            >
                                                {reqCat}
                                                {isAlreadyAdded ? <span className="text-[10px] font-normal italic">(Added)</span> : <span className="bg-orange-100 text-orange-600 px-1 rounded text-[10px] flex items-center gap-0.5"><Plus size={10} /> Approve</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* System Role Selection */}
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-2">
                                    <Shield size={12} /> System Role (Privileges)
                                </label>
                                <select 
                                    className={`w-full p-3 rounded-xl font-bold outline-none border transition-colors ${
                                        systemRole === 'Admin' 
                                        ? 'bg-red-50 text-red-600 border-red-100' 
                                        : 'bg-white text-gray-800 border-gray-200'
                                    }`}
                                    value={systemRole}
                                    onChange={e => setSystemRole(e.target.value as 'Resident' | 'Admin')} 
                                >
                                    <option value="Resident">Resident</option>
                                    <option value="Admin">Administrator</option>
                                </select>
                                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                                    {systemRole === 'Admin' 
                                        ? '⚠️ Administrators have full access to manage residents, events, bookings, and announcements.' 
                                        : 'Residents have standard access to view events, book halls, and access services.'}
                                </p>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Directory Title */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Directory Title (Free Text)</label>
                                <input 
                                    className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none border border-transparent focus:border-blue-200" 
                                    placeholder="e.g. Secretary, Plumber, President"
                                    value={directoryTitle}
                                    onChange={e => setDirectoryTitle(e.target.value)} 
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Leave empty to use role ({systemRole})</p>
                            </div>

                            {/* Categories Management */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Assigned Categories</label>
                                
                                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] bg-white border border-gray-100 rounded-xl p-2 items-center">
                                    {userCategories.map(cat => (
                                        <div key={cat} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                                            {cat}
                                            <button onClick={() => handleRemoveCategoryFromUser(cat)} className="hover:text-blue-800 p-0.5 hover:bg-blue-100 rounded"><X size={12} /></button>
                                        </div>
                                    ))}
                                    {userCategories.length === 0 && <span className="text-xs text-gray-400 italic py-1.5 px-2">No categories assigned.</span>}
                                </div>

                                <div className="flex gap-2">
                                    <select 
                                        className="flex-1 bg-gray-50 p-3 rounded-xl font-medium outline-none text-sm"
                                        value={newCategoryInput}
                                        onChange={(e) => {
                                            if (e.target.value === 'ADD_NEW') return;
                                            handleAddCategoryToUser(e.target.value);
                                        }}
                                    >
                                        <option value="">+ Add Manual Category...</option>
                                        {globalCategories.filter(c => !userCategories.includes(c)).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Primary Category Selection */}
                            {userCategories.length > 0 && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Primary Category</label>
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-[10px] text-gray-400 mb-2">Controls which filter tab this user appears in.</p>
                                        <select 
                                            className="w-full bg-white p-2 rounded-lg font-bold outline-none text-sm border border-gray-200"
                                            value={primaryCategory}
                                            onChange={e => setPrimaryCategory(e.target.value)}
                                        >
                                            {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button onClick={saveUserProfile} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg mt-4 hover:bg-black transition-colors">
                                Save Profile & Resolve Requests
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD GLOBAL CATEGORY MODAL */}
            {isAddCatOpen && (
                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-xs rounded-[32px] p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Manage Categories</h3>
                            <button onClick={() => setIsAddCatOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                        </div>
                        
                        <div className="mb-6 max-h-[200px] overflow-y-auto space-y-2">
                            {globalCategories.map(cat => (
                                <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium">{cat}</span>
                                    <button onClick={() => removeGlobalCategory(cat)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input 
                                className="flex-1 bg-gray-50 p-2 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-200"
                                placeholder="New Category Name"
                                value={globalCatInput}
                                onChange={e => setGlobalCatInput(e.target.value)}
                            />
                            <button onClick={addGlobalCategory} disabled={!globalCatInput} className="bg-blue-600 text-white p-2 rounded-xl disabled:opacity-50">
                                <Plus />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">Add categories here to make them available in User Edit.</p>
                    </div>
                 </div>
            )}
        </div>
    );
};
