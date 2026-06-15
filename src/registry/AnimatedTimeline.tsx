// category: cards
// description: A responsive vertical timeline displaying milestones with dynamic glow trails and badge status headers.

import React from 'react';

interface AnimatedTimelineProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const AnimatedTimeline: React.FC<AnimatedTimelineProps> = ({ color = 'violet' }) => {
  const lineColors = {
    violet: 'bg-violet-500',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6 relative pl-6">
      <div className={`absolute left-2.5 top-0 bottom-0 w-0.5 ${lineColors[color]}`} />
      {[
        { title: 'Project Initiated', desc: 'Requirements analyzed and repository set up.' },
        { title: 'Dynamic Registry Up', desc: 'Vite build configured for dynamic scanning.' }
      ].map((item, idx) => (
        <div key={idx} className="relative flex flex-col gap-1">
          <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full ${lineColors[color]} border-2 border-slate-950`} />
          <h4 className="text-xs font-bold text-white">{item.title}</h4>
          <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default AnimatedTimeline;
