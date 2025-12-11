import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Settings, Activity, FileText, Download, Calendar } from 'lucide-react';
import { ANNOUNCEMENTS } from '../constants';

export const AnnouncementDetails = () => {
    const navigate = useNavigate();
    const item = ANNOUNCEMENTS[0];

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
                 
                 <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                        <Settings size={12} /> {item.category}
                    </span>
                    <span className="text-gray-400 text-sm">{item.date}</span>
                 </div>

                 <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{item.title}</h1>
                 
                 <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                    <img src="https://picsum.photos/seed/manager/100/100" className="w-12 h-12 rounded-full ring-2 ring-white shadow-md" alt="author" />
                    <div>
                        <p className="font-bold text-gray-900">{item.author}</p>
                        <p className="text-xs text-gray-500">Community Manager</p>
                    </div>
                    <div className="ml-auto flex items-center text-gray-400 text-xs">
                         <Activity size={14} className="mr-1" /> 1.2k views
                    </div>
                 </div>

                 <div className="prose prose-blue text-gray-600 mb-8 leading-relaxed">
                    <p>{item.content}</p>
                    <p className="mt-4">Starting next Monday, the pool will reopen with extended summer hours. Residents can enjoy the facilities from <span className="font-bold text-blue-600">6:00 AM to 10:00 PM</span> daily. We are also introducing morning aqua-aerobics classes every Tuesday and Thursday, free for all registered residents.</p>
                    
                    <blockquote className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl my-6 italic text-blue-800 font-medium text-sm">
                        "The new heated section will be available starting November 1st, perfect for evening swims."
                    </blockquote>

                    <p>Please review the attached schedule for specific maintenance blocks where the pool might be temporarily unavailable for cleaning.</p>
                 </div>

                 <div className="mb-12">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Attached Files <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">2</span>
                    </h3>
                    <div className="space-y-3">
                        {item.attachments?.map((file, idx) => (
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

                 {/* Action Button - Sticky if needed, but here inline */}
                 <div className="pb-10">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex justify-center items-center gap-2">
                        <Calendar size={20} /> Add to Calendar
                    </button>
                 </div>
            </div>
        </div>
    )
}