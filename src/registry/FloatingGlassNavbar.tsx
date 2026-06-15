// category: navigation
// description: A floating page header component with backdrop filters and interactive list items.

import React from 'react';
import type { BaseComponentProps } from './types';

interface FloatingGlassNavbarProps extends BaseComponentProps {}

export const FloatingGlassNavbar: React.FC<FloatingGlassNavbarProps> = ({ color = 'violet', id, className: extraClassName, style, 'data-testid': testId, role, tabIndex }) => {
  const navStyles = {
    violet: 'from-violet-600 to-indigo-600',
    emerald: 'from-emerald-600 to-teal-600',
    rose: 'from-rose-600 to-pink-600',
    blue: 'from-blue-600 to-cyan-600',
    amber: 'from-amber-600 to-orange-600',
  };

  const bgStyle = navStyles[color] || navStyles.violet;

  return (
    <nav id={id} style={style} data-testid={testId} role={role} tabIndex={tabIndex} className={`w-full max-w-lg mx-auto rounded-full bg-slate-900/60 backdrop-blur-md border border-white/5 px-4 py-2.5 flex items-center justify-between shadow-xl${extraClassName ? ` ${extraClassName}` : ''}`}>
      <div className="flex items-center gap-1.5">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-r flex items-center justify-center font-bold text-white text-xs ${bgStyle}`}>
          F
        </div>
        <span className="text-white font-bold text-xs tracking-wider">FreeUI</span>
      </div>
      
      <ul className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold">
        <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
        <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
      </ul>
      
      <button className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-[10px] font-bold hover:bg-slate-100 active:scale-95 transition-all">
        Sign In
      </button>
    </nav>
  );
};

export default FloatingGlassNavbar;
