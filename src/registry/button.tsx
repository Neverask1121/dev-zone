// category: buttons
// description: A contributed action button from an open-source PR submission that dynamically adapts to color accent customizers.

import React from 'react';

interface ContributedButtonProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
  as?: React.ElementType;
}

export const ContributedButton: React.FC<ContributedButtonProps> = ({ as: Component = 'button', color = 'violet' }) => {
  const accentStyles = {
    violet: 'from-violet-600 to-indigo-600 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]',
    emerald: 'from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    rose: 'from-rose-600 to-pink-600 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)]',
    blue: 'from-blue-600 to-cyan-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    amber: 'from-amber-600 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]',
  };

  return (
    <Component className={`px-6 py-2.5 rounded-xl text-white font-bold bg-gradient-to-r transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${accentStyles[color] || accentStyles.violet}`}>
      Dynamic Button PR
    </Component>
  );
};
