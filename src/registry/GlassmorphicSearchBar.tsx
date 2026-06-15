// category: inputs
// description: A gorgeous glassmorphic input with blur effect, search icon integration, and keyboard shortcuts indicator.

import React from 'react';

interface GlassmorphicSearchBarProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const GlassmorphicSearchBar: React.FC<GlassmorphicSearchBarProps> = ({ color = 'violet' }) => {
  const borderColors = {
    violet: 'focus-within:border-violet-500',
    emerald: 'focus-within:border-emerald-500',
    rose: 'focus-within:border-rose-500',
    blue: 'focus-within:border-blue-500',
    amber: 'focus-within:border-amber-500',
  };

  return (
    <div className={`flex items-center gap-2 w-full max-w-lg px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all ${borderColors[color]}`}>
      <span className="text-slate-400">🔍</span>
      <input
        type="text"
        placeholder="Type to search..."
        className="w-full bg-transparent text-white placeholder-slate-400 border-0 outline-none focus:ring-0 text-sm"
      />
      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">⌘K</span>
    </div>
  );
};

export default GlassmorphicSearchBar;
