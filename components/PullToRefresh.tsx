import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export const PullToRefresh = ({ children, onRefresh }: { children?: React.ReactNode, onRefresh: () => Promise<void> }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Only allow pulling if we are dragging down and window is at top
    if (diff > 0 && window.scrollY <= 0) {
       // Add resistance to the pull
       setPullDistance(Math.min(diff * 0.45, 120)); 
    } else {
        setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setRefreshing(true);
      setPullDistance(60); // Snap to loading position
      await onRefresh();
      setRefreshing(false);
      setPullDistance(0);
    } else {
      setPullDistance(0);
    }
    setStartY(0);
  };

  return (
    <div 
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
        className="relative"
    >
        {/* Loader Indicator */}
        <div 
            className="absolute left-0 right-0 flex justify-center pointer-events-none z-50 transition-all duration-300"
            style={{ 
                top: refreshing ? '40px' : `${Math.max(10, pullDistance - 30)}px`,
                opacity: pullDistance > 10 || refreshing ? 1 : 0,
            }}
        >
            <div className="bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-xl border border-gray-100 flex items-center justify-center text-blue-600">
                <RefreshCw size={20} className={`${refreshing ? 'animate-spin' : ''} ${!refreshing && pullDistance > 0 ? 'transform rotate-[120deg] transition-transform duration-500' : ''}`} />
            </div>
        </div>

        {/* Content Wrapper */}
        <div style={{ transform: `translateY(${pullDistance}px)`, transition: refreshing ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.1s' }}>
            {children}
        </div>
    </div>
  );
};