// category: cards
// description: An interactive product tier visual table highlighting features, value propositions, and dynamic call-to-actions.

import React from 'react';

interface InteractivePricingTableProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const InteractivePricingTable: React.FC<InteractivePricingTableProps> = ({ color = 'violet' }) => {
  const themeStyles = {
    violet: 'bg-violet-600 text-white shadow-violet-500/20 hover:bg-violet-700',
    emerald: 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700',
    rose: 'bg-rose-600 text-white shadow-rose-500/20 hover:bg-rose-700',
    blue: 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700',
    amber: 'bg-amber-600 text-white shadow-amber-500/20 hover:bg-amber-700',
  };

  return (
    <div className="w-full max-w-sm rounded-3xl p-6 bg-slate-900 border border-slate-800 text-center shadow-xl">
      <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">Developer Plan</div>
      <div className="text-4xl font-extrabold text-white mb-4">$29<span className="text-sm text-slate-500 font-normal">/mo</span></div>
      <ul className="text-xs text-slate-400 space-y-2 mb-6">
        <li>Unlimited components</li>
        <li>Dynamic analytics</li>
        <li>Priority PR reviews</li>
      </ul>
      <button className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${themeStyles[color]}`}>
        Get Started
      </button>
    </div>
  );
};

export default InteractivePricingTable;
