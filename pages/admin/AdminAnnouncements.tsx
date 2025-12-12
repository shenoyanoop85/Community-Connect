
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X, Trash2, Users, Edit2, AlertCircle, Bold, Quote, Highlighter, Paperclip, FileText, Camera, Image as ImageIcon } from 'lucide-react';
import { ANNOUNCEMENTS, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../constants';
import { Announcement } from '../../types';

export const AdminAnnouncements = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Initial State Helper
    const initialFormState: Partial<Announcement> = {
        title: '', 
        content: '', 
        category: 'General', 
        targetAudience: 'All Residents', 
        isImportant: false,
        author: 'Admin Team',
        image: '',
        attachments: []
    };

    const [formData, setFormData] = useState<Partial<Announcement>>(initialFormState);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCreate = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openEdit = (ann: Announcement) => {
        setEditingId(ann.id);
        setFormData(ann);
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

    const insertTag = (tagStart: string, tagEnd: string) => {
        if (!textareaRef.current) return;
        
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content || '';
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + tagStart + selection + tagEnd + text.substring(end);
        setFormData({ ...formData, content: newText });

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tagStart.length, end + tagStart.length);
        }, 0);
    };

    const handleAddAttachment = () => {
        const newFile = {
            name: `Document_${Date.now()}.pdf`,
            size: '1.2 MB',
            type: 'pdf' as const
        };
        setFormData({
            ...formData,
            attachments: [...(formData.attachments || []), newFile]
        });
    };

    const handleRemoveAttachment = (index: number) => {
        setFormData({
            ...formData,
            attachments: (formData.attachments || []).filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalData: Announcement = {
            id: editingId || `a${Date.now()}`,
            date: formData.date || 'Just Now',
            image: formData.image || 'https://picsum.photos/seed/news/800/400',
            isUnread: editingId ? (formData.isUnread ?? false) : true,
            ...formData as Announcement
        };

        if (editingId) {
            updateAnnouncement(finalData);
        } else {
            addAnnouncement(finalData);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
             <div className="bg-white pt-12 pb-4 px-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                    <h1 className="text-xl font-bold">Manage News</h1>
                </div>
                <button 
                    onClick={openCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                    <Plus size={16} /> Post
                </button>
            </div>

            <div className="px-6 py-6 space-y-4">
                {ANNOUNCEMENTS.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 relative">
                        <div className="flex justify-between items-start">
                             <div className="pr-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.category === 'Alert' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{item.category}</span>
                                    {item.isImportant && <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5"><AlertCircle size={10} /> Urgent</span>}
                                    {item.attachments && item.attachments.length > 0 && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Paperclip size={10} /> {item.attachments.length}</span>}
                                </div>
                                <h3 className="font-bold text-gray-900 mt-1">{item.title}</h3>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Users size={10} /> To: {item.targetAudience || 'All'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">By: {item.author}</p>
                             </div>
                             <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button 
                                    onClick={() => openEdit(item)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button 
                                    onClick={() => { if(window.confirm('Delete post?')) deleteAnnouncement(item.id); }}
                                    className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

             {/* Create/Edit Modal */}
             {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Post' : 'Post Announcement'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Hero Image Upload */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Announcement Image</label>
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
                                <input required className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none" 
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Author / Posted By</label>
                                <input className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none" 
                                    placeholder="e.g. Admin Team"
                                    value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                                    <select className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none"
                                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                                        <option value="General">General</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Policy">Policy</option>
                                        <option value="Alert">Emergency Alert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Target Batch</label>
                                    <select className="w-full bg-gray-50 p-3 rounded-xl font-bold outline-none"
                                        value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})}>
                                        <option>All Residents</option>
                                        <option>Block A</option>
                                        <option>Block B</option>
                                        <option>Committee</option>
                                    </select>
                                </div>
                            </div>

                            {/* Priority Toggle */}
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={formData.isImportant}
                                        onChange={e => setFormData({...formData, isImportant: e.target.checked})}
                                    />
                                    <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-red-500 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-700">Mark as High Priority / Emergency</span>
                            </div>

                            {/* Rich Content Editor */}
                             <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Content</label>
                                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-100">
                                        <button type="button" onClick={() => insertTag('[b]', '[/b]')} className="p-2 hover:bg-white rounded text-gray-600" title="Bold">
                                            <Bold size={16} />
                                        </button>
                                        <button type="button" onClick={() => insertTag('[highlight]', '[/highlight]')} className="p-2 hover:bg-white rounded text-blue-600" title="Highlight Blue">
                                            <Highlighter size={16} />
                                        </button>
                                        <button type="button" onClick={() => insertTag('[quote]', '[/quote]')} className="p-2 hover:bg-white rounded text-gray-600" title="Quote Block">
                                            <Quote size={16} />
                                        </button>
                                        <div className="h-4 w-px bg-gray-300 mx-1"></div>
                                        <span className="text-[10px] text-gray-400 font-medium px-2">Select text & click icon</span>
                                    </div>
                                    <textarea 
                                        ref={textareaRef}
                                        className="w-full bg-gray-50 p-3 font-medium outline-none h-40 resize-none text-sm leading-relaxed" 
                                        value={formData.content} 
                                        onChange={e => setFormData({...formData, content: e.target.value})}
                                        placeholder="Write your announcement here..."
                                    />
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Attachments</label>
                                    <button type="button" onClick={handleAddAttachment} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded">
                                        <Plus size={12} /> Add File
                                    </button>
                                </div>
                                {formData.attachments && formData.attachments.length > 0 ? (
                                    <div className="space-y-2">
                                        {formData.attachments.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-gray-100 rounded text-gray-500"><FileText size={14}/></div>
                                                    <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">{file.type}</span>
                                                </div>
                                                <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-red-400 p-1 hover:bg-red-50 rounded">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
                                        <p className="text-xs text-gray-400">No files attached</p>
                                    </div>
                                )}
                            </div>
                            
                            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl mt-2">
                                {editingId ? 'Save Changes' : 'Post Now'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
