
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X, Calendar, MapPin, Users, Trash2, Edit2, Camera, Image as ImageIcon, Tag } from 'lucide-react';
import { EVENTS, addEvent, updateEvent, deleteEvent } from '../../constants';
import { Event } from '../../types';

const CATEGORY_OPTIONS = [
    'Social', 
    'Wellness', 
    'Cultural', 
    'Sports', 
    'Educational', 
    'Meeting', 
    'Religious', 
    'Kids', 
    'Music', 
    'Food', 
    'Charity',
    'Other'
];

export const AdminEvents = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    // Initial State Helper
    const initialFormState: Partial<Event> = {
        title: '', 
        date: '', 
        time: '', 
        location: '', 
        address: '', 
        organizer: '', 
        category: 'Social', 
        description: '', 
        targetAudience: 'All Residents', 
        price: 'Free',
        image: '',
        requirements: [],
        benefits: []
    };

    const [formData, setFormData] = useState<Partial<Event>>(initialFormState);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Helpers for comma-separated arrays
    const [reqString, setReqString] = useState('');
    const [benString, setBenString] = useState('');

    const openCreate = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setReqString('');
        setBenString('');
        setIsCustomCategory(false);
        setIsModalOpen(true);
    };

    const openEdit = (event: Event) => {
        setEditingId(event.id);
        setFormData(event);
        setReqString(event.requirements?.join(', ') || '');
        setBenString(event.benefits?.join(', ') || '');
        
        // Detect if category is custom (not in the default list)
        const isStandard = CATEGORY_OPTIONS.includes(event.category);
        setIsCustomCategory(!isStandard);
        
        setIsModalOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalData: Event = {
            id: editingId || `e${Date.now()}`,
            image: formData.image || 'https://picsum.photos/seed/new/800/600',
            registeredCount: formData.registeredCount || 0,
            attendees: formData.attendees || [],
            ...formData as Event,
            requirements: reqString.split(',').map(s => s.trim()).filter(s => s),
            benefits: benString.split(',').map(s => s.trim()).filter(s => s)
        };

        if (editingId) {
            updateEvent(finalData);
        } else {
            addEvent(finalData);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
             {/* Header */}
             <div className="bg-white pt-12 pb-4 px-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                    <h1 className="text-xl font-bold">Manage Events</h1>
                </div>
                <button 
                    onClick={openCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                    <Plus size={16} /> Create
                </button>
            </div>

            <div className="px-6 py-6 space-y-4">
                {EVENTS.map(event => (
                    <div key={event.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 relative">
                        <div className="flex gap-4">
                            <img src={event.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-100" alt="evt" />
                            <div className="flex-1 pr-8">
                                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{event.category}</span>
                                <h3 className="font-bold text-gray-900 mt-1">{event.title}</h3>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Users size={10} /> Batch: {event.targetAudience || 'All'}</p>
                                <p className="text-xs text-gray-500 mt-0.5">By: {event.organizer || 'Admin'}</p>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button 
                                onClick={() => openEdit(event)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button 
                                onClick={() => { if(window.confirm('Delete event?')) deleteEvent(event.id); }}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Event' : 'Create Event'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Hero Image Upload */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Event Cover Image</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative h-48 w-full bg-gray-50 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors group"
                                >
                                    {formData.image ? (
                                        <>
                                            <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
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
                                <label className="text-xs font-bold text-gray-400 uppercase">Title</label>
                                <input required className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100" 
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>

                            {/* Category Selector */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                                {!isCustomCategory ? (
                                    <select 
                                        className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none"
                                        value={CATEGORY_OPTIONS.includes(formData.category || '') ? formData.category : 'Other'}
                                        onChange={(e) => {
                                            if (e.target.value === 'Other') {
                                                setIsCustomCategory(true);
                                                setFormData({...formData, category: ''});
                                            } else {
                                                setFormData({...formData, category: e.target.value});
                                            }
                                        }}
                                    >
                                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                ) : (
                                    <div className="flex gap-2">
                                        <input 
                                            autoFocus
                                            className="flex-1 bg-gray-50 p-3 rounded-xl font-bold outline-none border border-blue-200"
                                            placeholder="Type new category..."
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setIsCustomCategory(false)}
                                            className="px-4 bg-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-200"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Organizer</label>
                                <input className="w-full bg-gray-50 p-3 rounded-xl font-medium outline-none" placeholder="e.g. Sports Committee"
                                    value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                                    <input type="date" required className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none" 
                                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Time</label>
                                    <input type="text" placeholder="e.g. 6 PM" className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none" 
                                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Venue Name</label>
                                <input className="w-full bg-gray-50 p-3 rounded-xl font-medium outline-none" placeholder="e.g. Community Hall"
                                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Full Address</label>
                                <textarea className="w-full bg-gray-50 p-3 rounded-xl font-medium outline-none h-16 resize-none" placeholder="Detailed address..."
                                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Target Audience (Batch)</label>
                                <select className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none"
                                    value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})}>
                                    <option>All Residents</option>
                                    <option>Block A</option>
                                    <option>Block B</option>
                                    <option>Block C</option>
                                    <option>Committee Members</option>
                                </select>
                            </div>

                             <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                <textarea className="w-full bg-gray-50 p-3 rounded-xl font-medium outline-none h-24" 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>

                            {/* Requirements & Benefits */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Requirements (comma separated)</label>
                                    <input className="w-full bg-gray-50 p-3 rounded-xl font-medium outline-none text-sm" placeholder="Formal Attire, Age 18+..."
                                        value={reqString} onChange={e => setReqString(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Benefits (comma separated)</label>
                                    <input className="w-full bg-gray-50 p-3 rounded-xl font-medium outline-none text-sm" placeholder="Dinner, Drinks..."
                                        value={benString} onChange={e => setBenString(e.target.value)} />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl mt-4">
                                {editingId ? 'Save Changes' : 'Publish Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
