import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, CheckCircle, Smartphone, Lock } from 'lucide-react';
import { switchUserRole } from '../constants';

export const Login = () => {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mobile.length < 10) return;

        setIsLoading(true);

        // Check for Admin credentials mock
        if (mobile === '9999999999') {
            switchUserRole('Admin');
        } else {
            switchUserRole('Resident');
        }

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover scale-110"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-slate-900/90"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[340px] px-4 animate-in fade-in zoom-in duration-700">
                
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[24px] border border-white/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-md">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">Rajsri<br/>SPARK</h1>
                    <p className="text-white/80 text-xs mt-3 font-medium tracking-wide uppercase">Sports Performance Arts Recreation Knowledge</p>
                </div>

                {/* Glassmorphic Form Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
                    {/* Glossy sheen */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        
                        <div>
                            <label className="block text-xs font-bold text-white/90 uppercase tracking-widest mb-2 ml-1 shadow-black/10 text-shadow">
                                Mobile Number
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Smartphone className="text-white/60 group-focus-within:text-white transition-colors" size={20} />
                                </div>
                                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                                    <span className="text-white/60 font-medium border-r border-white/20 pr-2 mr-2">+91</span>
                                </div>
                                <input 
                                    type="tel" 
                                    value={mobile}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            if(e.target.value.length <= 10) {
                                                setMobile(e.target.value);
                                            }
                                        }
                                    }}
                                    placeholder="98765 43210"
                                    className="w-full pl-24 pr-4 py-4 bg-black/20 border border-white/10 text-white font-bold text-lg rounded-2xl outline-none focus:border-white/40 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-white/20 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group select-none">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" defaultChecked />
                                    <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all bg-white/5"></div>
                                    <CheckCircle size={14} className="text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="ml-2 text-sm text-white/70 font-medium group-hover:text-white transition-colors">Remember me</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || mobile.length < 10 || isSuccess}
                            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 border border-white/10 ${
                                isSuccess 
                                ? 'bg-emerald-500 text-white shadow-emerald-500/40' 
                                : isLoading 
                                    ? 'bg-white/10 text-white/50 cursor-wait' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40'
                            }`}
                        >
                            {isSuccess ? (
                                <>Success <CheckCircle size={20} /></>
                            ) : isLoading ? (
                                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Login <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-white/40">
                            Don't have an account? <button className="font-bold text-white hover:text-blue-300 transition-colors ml-1">Request Access</button>
                        </p>
                        <p className="text-[10px] text-white/20 mt-4">
                            Demo Admin: <span className="font-mono">9999999999</span>
                        </p>
                    </div>
                </div>
                
                {/* Footer Info */}
                <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white font-medium tracking-[0.2em] uppercase">Secured by Rajsri SPARK</p>
                </div>
            </div>
        </div>
    );
};