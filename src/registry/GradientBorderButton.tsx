// category: buttons
// description: An elegant dark-themed border button that lights up with high-tech neon gradient borders on focus/hover.

import React from 'react';

interface GradientBorderButtonProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({ color = 'violet' }) => {
  const gradientBorderStyles = {
    violet: 'from-pink-500 via-purple-500 to-blue-500',
    emerald: 'from-emerald-500 via-teal-500 to-cyan-500',
    rose: 'from-rose-500 via-pink-500 to-red-500',
    blue: 'from-blue-500 via-indigo-500 to-violet-500',
    amber: 'from-amber-500 via-yellow-500 to-orange-500',
  };

  return (
    <button className="relative p-[1.5px] rounded-xl overflow-hidden group bg-transparent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
      <span className={`absolute inset-0 bg-gradient-to-r rounded-xl opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 ${gradientBorderStyles[color]}`}></span>
      <span className="relative block px-7 py-3 rounded-[11px] bg-slate-950 text-slate-100 font-semibold group-hover:text-white transition-colors duration-300">
        Explore Collections
      </span>
    </button>
  );
};

export default GradientBorderButton;
