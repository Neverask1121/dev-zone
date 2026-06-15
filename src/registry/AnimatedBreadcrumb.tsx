// category: navigation
// description: Animated modern breadcrumbs navigation supporting active path triggers and icons.

import React from 'react';

interface AnimatedBreadcrumbProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const AnimatedBreadcrumb: React.FC<AnimatedBreadcrumbProps> = ({ color = 'violet' }) => {
  const activeStyles = {
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  };

  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 select-none">
      <span className="hover:text-slate-200 cursor-pointer transition-colors">Home</span>
      <span>/</span>
      <span className="hover:text-slate-200 cursor-pointer transition-colors">Registry</span>
      <span>/</span>
      <span className={`${activeStyles[color]}`}>Components</span>
    </nav>
  );
};

export default AnimatedBreadcrumb;
