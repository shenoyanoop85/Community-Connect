
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Share2, Activity, FileText, Download, CheckCircle, Wrench, AlertCircle, Calendar } from 'lucide-react';
import { ANNOUNCEMENTS } from '../constants';

// Simple parser for custom tags: [highlight]text[/highlight], [quote]text[/quote], [b]text[/b]
const renderRichText = (text: string) => {
    if (!text) return null;

    // Split by newlines first to handle paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, pIndex) => {
        // Simple regex-based tokenization for inline styles
        // Matches [tag]content[/tag] or plain text
        const parts = paragraph.split(/(\[highlight\].*?\[\/highlight\]|\[quote\].*?\[\/quote\]|\[b\].*?\[\/b\])/g);

        // Check if the entire paragraph is a quote (optional optimization, but we handle inline too)
        const isQuoteBlock = parts.some(p => p.startsWith('[quote]'));

        if (isQuoteBlock && parts.length <= 3) {
             // Handle blockquote specifically if it's the main content of the line
             const content = paragraph.replace(/\[quote\]|\[\/quote\]/g, '');
             return (
                 <blockquote key={pIndex} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl my-6 italic text-blue-800 font-medium text-sm">
                     {content}
                 </blockquote>
             );
        }

        return (
            <p key={pIndex} className="mb-4 leading-relaxed">
                {parts.map((part, i) => {
                    if (part.startsWith('[highlight]')) {
                        return <span key={i} className="font-bold text-blue-600 bg-blue-50 px-1 rounded">{part.replace(/\[highlight\]|\[\/highlight\]/g, '')}</span>;
                    }
                    if (part.startsWith('[b]')) {
                        return <strong key={i} className="font-bold text-gray-900">{part.replace(/\[b\]|\[\/b\]/g, '')}</strong>;
                    }
                    // Fallback for inline quotes if mixed with text
                    if (part.startsWith('[quote]')) {
                        return <span key={i} className="italic text-gray-500">"{part.replace(/\[quote\]|\[\/quote\]/g, '')}"</span>;
                    }
                    return <span key={i}>{part}</span>;
                })}
            </p>
        );
    });
};

export const AnnouncementDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const item = ANNOUNCEMENTS.find(a => a.id === id) || ANNOUNCEMENTS[0];

    const [viewCount, setViewCount] = useState(1240);
    const [isAcknowledged, setIsAcknowledged] = useState(false);

    const handleAcknowledge = () => {
        if (!isAcknowledged) {
            setIsAcknowledged(true);
            setViewCount(prev => prev + 1);
        }
    };

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'Maintenance':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    icon: <Wrench size={12} />
                };
            case 'Alert':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    icon: <AlertCircle size={12} />
                };
            case 'Policy':
                return {
                    bg: 'bg-orange-50',
                    text: 'text-orange-600',
                    icon: <FileText size={12} />
                };
            default:
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                    icon: <Calendar size={12} />
                };
        }
    };

    const style = getCategoryStyles(item.category);

    return (
        <div className="min-h-screen bg-white">
            <div className="relative h-[45vh]">
                <img src={item.image} className="w-full h-full object-cover" alt="detail" />
                <div className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-center z-10">
                     <button onClick={() => navigate(-1)} className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors">
                        <ChevronLeft />
                    </button>
                     <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="relative -mt-10 bg-white rounded-t-[40px] px-8 pt-10 min-h-[60vh] shadow-inner">
                 <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
                 
                 <div className="flex flex-col items-start gap-3 mb-5">
                    <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5`}>
                        {style.icon} {item.category}
                    </span>
                    <span className="text-gray-400 text-sm font-medium ml-1 flex items-center gap-2">
                        {item.date} 
                        {item.time && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                {item.time}
                            </>
                        )}
                    </span>
                 </div>

                 <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{item.title}</h1>
                 
                 <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                    <img src="https://picsum.photos/seed/manager/100/100" className="w-12 h-12 rounded-full ring-2 ring-white shadow-md" alt="author" />
                    <div>
                        <p className="font-bold text-gray-900">{item.author}</p>
                        <p className="text-xs text-gray-500">Community Manager</p>
                    </div>
                    <div className="ml-auto flex items-center text-gray-400 text-xs">
                         <Activity size={14} className="mr-1" /> {viewCount.toLocaleString()} views
                    </div>
                 </div>

                 {/* Rich Text Content */}
                 <div className="prose prose-blue text-gray-600 mb-8">
                    {renderRichText(item.content)}
                 </div>

                 {/* Dynamic Attachments */}
                 {item.attachments && item.attachments.length > 0 && (
                     <div className="mb-12">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Attached Files <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{item.attachments.length}</span>
                        </h3>
                        <div className="space-y-3">
                            {item.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${file.type === 'pdf' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-400">{file.size} • {file.type === 'pdf' ? 'PDF Document' : 'Image'}</p>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                        <Download size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}

                 <div className="pb-10">
                    <button 
                        onClick={handleAcknowledge}
                        disabled={isAcknowledged}
                        className={`w-full py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all duration-300 ${
                            isAcknowledged 
                            ? 'bg-green-100 text-green-700 shadow-none cursor-default' 
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95'
                        }`}
                    >
                        <CheckCircle size={20} className={isAcknowledged ? "fill-green-700 text-white" : ""} /> 
                        {isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                 </div>
            </div>
        </div>
    )
}
