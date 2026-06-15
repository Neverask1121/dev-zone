// category: cards
// description: A responsive vertical accordion element containing animations.

import React, { useState } from 'react';

interface AdaptiveAccordionProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const AdaptiveAccordion: React.FC<AdaptiveAccordionProps> = ({ color = 'violet' }) => {
  const [open, setOpen] = useState(false);

  const textColors = {
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-white hover:bg-white/5 transition-all text-left cursor-pointer"
      >
        <span>Toggle Accordion Content</span>
        <span className={`${open ? textColors[color] : 'text-slate-500'}`}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
          This is an accordion component with state transitions. Easy to integrate.
        </div>
      )}
    </div>
  );
};

export default AdaptiveAccordion;
