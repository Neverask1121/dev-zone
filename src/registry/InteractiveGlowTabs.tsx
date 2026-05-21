// category: navigation
// description: A responsive tab controller switch with floating background indicator highlight animations.

import React, { useState } from 'react';

interface InteractiveGlowTabsProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const InteractiveGlowTabs: React.FC<InteractiveGlowTabsProps> = ({ color = 'violet' }) => {
  const [activeTab, setActiveTab] = useState('home');

  const accentStyles = {
    violet: 'bg-violet-600/20 text-violet-400 border-violet-500/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
    blue: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
  };

  const currentStyle = accentStyles[color] || accentStyles.violet;

  const tabs = [
    { id: 'home', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="flex p-1.5 rounded-xl bg-slate-900 border border-slate-800/80 max-w-sm w-full gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all duration-300 cursor-pointer ${isActive ? `${currentStyle} shadow-lg border` : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveGlowTabs;
