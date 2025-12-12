
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Settings, Calendar, Save, Camera, Image as ImageIcon, Edit3, ArrowRight } from 'lucide-react';
import { BOOKINGS, ALL_USERS, updateBookingStatus, HALL_DETAILS, updateHallDetails, updateBookingDates } from '../../constants';
import { Hall } from '../../types';

export const AdminBookings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'requests' | 'settings'>('requests');
    
    // --- State for Requests ---
    const [bookings, setBookings] = useState(BOOKINGS);
    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');

    // --- State for Hall Settings ---
    const [hallData, setHallData] = useState<Hall>(HALL_DETAILS);
    const [amenityString, setAmenityString] = useState(HALL_DETAILS.amenities.join(', '));
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Request Handlers ---

    const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
        updateBookingStatus(id, status);
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    };

    const openEditDate = (booking: typeof BOOKINGS[0]) => {
        setEditingBookingId(booking.id);
        setEditStartDate(booking.startDate);
        setEditEndDate(booking.endDate);
    };

    const saveDateEdit = () => {
        if (!editingBookingId || !editStartDate || !editEndDate) return;
        
        // Simple Validation: End >= Start
        if (editEndDate < editStartDate) {
            alert("End date cannot be before start date.");
            return;
        }

        updateBookingDates(editingBookingId, editStartDate, editEndDate);
        
        // Refresh local state
        setBookings(prev => prev.map(b => {
             if (b.id === editingBookingId) {
                 const days = Math.ceil((new Date(editEndDate).getTime() - new Date(editStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                 const newTotal = days * hallData.pricePerDay;
                 return { ...b, startDate: editStartDate, endDate: editEndDate, totalAmount: newTotal };
             }
             return b;
        }));

        setEditingBookingId(null);
    };

    // --- Hall Settings Handlers ---

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHallData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveHallSettings = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedHall = {
            ...hallData,
            amenities: amenityString.split(',').map(s => s.trim()).filter(s => s)
        };
        updateHallDetails(updatedHall);
        alert("Hall details updated successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white pt-12 pb-2 px-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                    <h1 className="text-xl font-bold">Hall Management</h1>
                </div>
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                    <button 
                        onClick={() => setActiveTab('requests')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Requests
                    </button>
                    <button 
                         onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Hall Settings
                    </button>
                </div>
            </div>

            <div className="px-6 py-6 pb-20">
                
                {/* --- REQUESTS TAB --- */}
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {bookings.map(booking => {
                            const user = ALL_USERS.find(u => u.id === booking.userId) || { name: 'Unknown', address: 'Unknown' };
                            return (
                                <div key={booking.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{booking.purpose}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                            booking.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                            booking.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                        }`}>{booking.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-bold">{user.name}</span> • {user.address}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg mb-3">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-800">{booking.startDate}</span>
                                        {booking.startDate !== booking.endDate && (
                                            <>
                                                <ArrowRight size={12} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-800">{booking.endDate}</span>
                                            </>
                                        )}
                                        <button onClick={() => openEditDate(booking)} className="ml-auto text-blue-600 p-1 hover:bg-blue-100 rounded">
                                            <Edit3 size={14} />
                                        </button>
                                    </div>

                                    {booking.status === 'Pending' && (
                                        <div className="flex gap-3 mt-4 border-t border-gray-50 pt-4">
                                            <button 
                                                onClick={() => handleAction(booking.id, 'Rejected')}
                                                className="flex-1 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors"
                                            >
                                                Reject
                                            </button>
                                            <button 
                                                onClick={() => handleAction(booking.id, 'Approved')}
                                                className="flex-1 py-2 bg-green-50 text-green-600 font-bold rounded-xl text-sm hover:bg-green-100 transition-colors"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {bookings.length === 0 && <p className="text-center text-gray-400 mt-10">No booking requests.</p>}
                    </div>
                )}

                {/* --- HALL SETTINGS TAB --- */}
                {activeTab === 'settings' && (
                    <form onSubmit={saveHallSettings} className="space-y-6 animate-in slide-in-from-right-4">
                        
                         {/* Hero Image Upload */}
                         <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Hall Hero Image</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative h-48 w-full bg-gray-50 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors group"
                            >
                                {hallData.image ? (
                                    <>
                                        <img src={hallData.image} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold flex items-center gap-2"><Camera size={20}/> Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <ImageIcon size={32} className="mb-2" />
                                        <span className="text-sm font-bold">Tap to upload cover</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Hall Name</label>
                            <input required className="w-full bg-white border border-gray-200 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100" 
                                value={hallData.name} onChange={e => setHallData({...hallData, name: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Price (Per Day)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                                    <input type="number" required className="w-full bg-white border border-gray-200 p-3 pl-6 rounded-xl font-bold outline-none" 
                                        value={hallData.pricePerDay} onChange={e => setHallData({...hallData, pricePerDay: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Capacity</label>
                                <input type="number" className="w-full bg-white border border-gray-200 p-3 rounded-xl font-bold outline-none" 
                                    value={hallData.capacity} onChange={e => setHallData({...hallData, capacity: Number(e.target.value)})} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Full Address</label>
                            <input className="w-full bg-white border border-gray-200 p-3 rounded-xl font-medium outline-none"
                                value={hallData.address} onChange={e => setHallData({...hallData, address: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Rating (0-5)</label>
                                <input type="number" step="0.1" max="5" className="w-full bg-white border border-gray-200 p-3 rounded-xl font-bold outline-none" 
                                    value={hallData.rating} onChange={e => setHallData({...hallData, rating: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Review Count</label>
                                <input type="number" className="w-full bg-white border border-gray-200 p-3 rounded-xl font-bold outline-none" 
                                    value={hallData.reviews} onChange={e => setHallData({...hallData, reviews: Number(e.target.value)})} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                            <textarea className="w-full bg-white border border-gray-200 p-3 rounded-xl font-medium outline-none h-24" 
                                value={hallData.description} onChange={e => setHallData({...hallData, description: e.target.value})} />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Amenities (Comma Separated)</label>
                            <input className="w-full bg-white border border-gray-200 p-3 rounded-xl font-medium outline-none" 
                                value={amenityString} onChange={e => setAmenityString(e.target.value)} />
                        </div>

                        <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2">
                            <Save size={18} /> Save Settings
                        </button>
                    </form>
                )}
            </div>

            {/* Edit Date Modal */}
            {editingBookingId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">New Start Date</label>
                                <input type="date" className="w-full bg-gray-50 p-3 rounded-xl font-bold" 
                                    value={editStartDate} onChange={e => setEditStartDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">New End Date</label>
                                <input type="date" className="w-full bg-gray-50 p-3 rounded-xl font-bold" 
                                    value={editEndDate} onChange={e => setEditEndDate(e.target.value)} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setEditingBookingId(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600">Cancel</button>
                                <button onClick={saveDateEdit} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
