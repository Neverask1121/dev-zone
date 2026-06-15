// category: feedback
// description: Inline toast popovers showing critical server messages with state-dismiss animations.

import React from 'react';

interface ToastNotificationSystemProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const ToastNotificationSystem: React.FC<ToastNotificationSystemProps> = ({ color = 'violet' }) => {
  const borderStyles = {
    violet: 'border-violet-500/20 text-violet-400',
    emerald: 'border-emerald-500/20 text-emerald-400',
    rose: 'border-rose-500/20 text-rose-400',
    blue: 'border-blue-500/20 text-blue-400',
    amber: 'border-amber-500/20 text-amber-400',
  };

  return (
    <div className={`w-full max-w-xs p-4 rounded-xl bg-slate-900 border shadow-2xl flex items-center justify-between ${borderStyles[color]}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">🔔</span>
        <div className="text-xs font-semibold">Verification Complete</div>
      </div>
      <button className="text-[10px] text-slate-500 hover:text-white transition-colors cursor-pointer">✕</button>
    </div>
  );
};

export default ToastNotificationSystem;
