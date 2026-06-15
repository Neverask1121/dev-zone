// category: navigation
// description: Step indicator progress tracker highlighting navigation points of user checkout flows.

import React from 'react';

interface MultiStepIndicatorProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const MultiStepIndicator: React.FC<MultiStepIndicatorProps> = ({ color = 'violet' }) => {
  const nodeColors = {
    violet: 'bg-violet-600 border-violet-600',
    emerald: 'bg-emerald-600 border-emerald-600',
    rose: 'bg-rose-600 border-rose-600',
    blue: 'bg-blue-600 border-blue-600',
    amber: 'bg-amber-600 border-amber-600',
  };

  return (
    <div className="flex items-center justify-between w-full max-w-sm relative px-4">
      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
      {[
        { num: '1', active: true },
        { num: '2', active: false },
        { num: '3', active: false }
      ].map((step, idx) => (
        <div
          key={idx}
          className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
            step.active ? `${nodeColors[color]} text-white` : 'border-slate-800 bg-slate-950 text-slate-500'
          }`}
        >
          {step.num}
        </div>
      ))}
    </div>
  );
};

export default MultiStepIndicator;
