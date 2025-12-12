import React, { useEffect, useState } from 'react';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading process
    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400); // Slight delay after 100% before unmounting
          return 100;
        }
        // Randomize speed slightly for realism
        const increment = Math.random() * 5 + 2; 
        return Math.min(old + increment, 100);
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Splash Background" 
            className="w-full h-full object-cover opacity-30 grayscale scale-110 animate-in fade-in zoom-in duration-[3000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-1000">
        
        {/* Logo Container */}
        <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[28px] flex items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.4)] border border-white/10 relative z-10">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-md">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 rounded-full -z-10"></div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
          Rajsri <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SPARK</span>
        </h1>

        {/* Divider */}
        <div className="w-16 h-1.5 bg-blue-600 rounded-full mb-6 mt-2 shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>

        {/* Subtitle */}
        <p className="text-gray-400 text-[11px] font-bold tracking-[0.25em] uppercase leading-7 max-w-[260px] text-center border-t border-white/10 pt-6">
          Sports Performance<br/>Arts Recreation<br/>Knowledge
        </p>
      </div>

      {/* Bottom Loading Bar (Reference Style) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="absolute bottom-4 text-[10px] text-gray-600 font-mono">v1.0.0</p>
    </div>
  );
};