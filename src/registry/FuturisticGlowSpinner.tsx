// category: feedback
// description: A gorgeous multi-ring radial loader designed for futuristic dashboards and asynchronous tasks.

import React from 'react';

interface FuturisticGlowSpinnerProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const FuturisticGlowSpinner: React.FC<FuturisticGlowSpinnerProps> = ({ color = 'violet' }) => {
  const loaderStyles = {
    violet: { ring: 'border-violet-500/10', spinner: 'border-t-violet-500 border-r-pink-500', dash: 'border-indigo-400' },
    emerald: { ring: 'border-emerald-500/10', spinner: 'border-t-emerald-500 border-r-teal-500', dash: 'border-cyan-400' },
    rose: { ring: 'border-rose-500/10', spinner: 'border-t-rose-500 border-r-pink-500', dash: 'border-red-400' },
    blue: { ring: 'border-blue-500/10', spinner: 'border-t-blue-500 border-r-cyan-500', dash: 'border-indigo-400' },
    amber: { ring: 'border-amber-500/10', spinner: 'border-t-amber-500 border-r-orange-500', dash: 'border-yellow-400' },
  };

  const current = loaderStyles[color] || loaderStyles.violet;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <div className={`absolute inset-0 rounded-full border-4 ${current.ring}`}></div>
      <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin ${current.spinner}`}></div>
      <div className={`absolute w-6 h-6 rounded-full border-4 border-dashed animate-[spin_3s_linear_infinite_reverse] ${current.dash}`}></div>
    </div>
  );
};

export default FuturisticGlowSpinner;
