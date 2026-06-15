// category: feedback
// description: A reusable UI skeleton animation placeholder for cards during asynchronous loading phases.

import React from 'react';

interface SkeletonLoaderCardProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const SkeletonLoaderCard: React.FC<SkeletonLoaderCardProps> = ({ color = 'violet' }) => {
  return (
    <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl animate-pulse space-y-4">
      <div className="h-6 w-2/3 bg-slate-800 rounded-lg" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-5/6 bg-slate-800 rounded" />
      </div>
      <div className="h-10 w-full bg-slate-800 rounded-xl" />
    </div>
  );
};

export default SkeletonLoaderCard;
