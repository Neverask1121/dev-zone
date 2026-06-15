// category: navigation
// description: A responsive floating layout docking system containing micro-animations.

import React from 'react';

interface DynamicBottomDockProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const DynamicBottomDock: React.FC<DynamicBottomDockProps> = ({ color = 'violet' }) => {
  const borderColors = {
    violet: 'hover:border-violet-500 hover:text-violet-400',
    emerald: 'hover:border-emerald-500 hover:text-emerald-400',
    rose: 'hover:border-rose-500 hover:text-rose-400',
    blue: 'hover:border-blue-500 hover:text-blue-400',
    amber: 'hover:border-amber-500 hover:text-amber-400',
  };

  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl">
      {['📁', '⚙️', '💬', '🔔'].map((icon, idx) => (
        <button
          key={idx}
          className={`w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm transition-all hover:scale-115 active:scale-95 cursor-pointer ${borderColors[color]}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default DynamicBottomDock;
