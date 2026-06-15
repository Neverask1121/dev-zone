// category: feedback
// description: A gorgeous smooth loading indicator with a fluid gradient look.

import React from 'react';

interface LiquidProgressBarProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const LiquidProgressBar: React.FC<LiquidProgressBarProps> = ({ color = 'violet' }) => {
  const fillStyles = {
    violet: 'from-violet-500 to-indigo-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
    emerald: 'from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    rose: 'from-rose-500 to-pink-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    blue: 'from-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    amber: 'from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
  };

  return (
    <div className="w-full max-w-sm space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
        <span>Processing</span>
        <span>65%</span>
      </div>
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700">
        <div className={`h-full w-[65%] rounded-full bg-gradient-to-r ${fillStyles[color]}`} />
      </div>
    </div>
  );
};

export default LiquidProgressBar;
