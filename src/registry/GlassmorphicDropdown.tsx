// category: navigation
// description: A premium translucent navigation popover panel with hover active link options.

import React from 'react';

interface GlassmorphicDropdownProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const GlassmorphicDropdown: React.FC<GlassmorphicDropdownProps> = ({ color = 'violet' }) => {
  const activeStyles = {
    violet: 'hover:bg-violet-600/10 hover:text-violet-400',
    emerald: 'hover:bg-emerald-600/10 hover:text-emerald-400',
    rose: 'hover:bg-rose-600/10 hover:text-rose-400',
    blue: 'hover:bg-blue-600/10 hover:text-blue-400',
    amber: 'hover:bg-amber-600/10 hover:text-amber-400',
  };

  return (
    <div className="w-56 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col gap-1">
      {['View Profile', 'Account Settings', 'Sign Out'].map((item, idx) => (
        <button
          key={idx}
          className={`w-full px-3 py-2 text-left rounded-xl text-xs font-semibold text-slate-350 transition-all cursor-pointer ${activeStyles[color]}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default GlassmorphicDropdown;
