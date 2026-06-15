// category: buttons
// description: A package of customizable badges with status glow icons, micro-animations, and solid backgrounds.

import React from 'react';

interface VibrantStatusBadgeProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const VibrantStatusBadge: React.FC<VibrantStatusBadgeProps> = ({ color = 'violet' }) => {
  const badgeColors = {
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className="flex gap-3">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${badgeColors[color]}`}>
        <span className="w-2 h-2 rounded-full bg-current animate-ping mr-1"></span>
        System Live
      </span>
    </div>
  );
};

export default VibrantStatusBadge;
