// category: inputs
// description: A responsive toggle switch featuring high-fidelity active shadow glow indicators and sliding animations.

import React, { useState } from 'react';
import type { BaseComponentProps } from './types';

interface InteractiveNeumorphicToggleProps extends BaseComponentProps {}

export const InteractiveNeumorphicToggle: React.FC<InteractiveNeumorphicToggleProps> = ({ color = 'violet', id, className: extraClassName, style, 'data-testid': testId, role, tabIndex }) => {
  const [isChecked, setIsChecked] = useState(false);

  const accentStyles = {
    violet: 'bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.4)]',
    emerald: 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    rose: 'bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    blue: 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    amber: 'bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
  };

  const bgStyle = accentStyles[color] || accentStyles.violet;

  return (
    <div id={id} style={style} data-testid={testId} role={role} tabIndex={tabIndex} className={`flex items-center gap-3${extraClassName ? ` ${extraClassName}` : ''}`}>
      <span className="text-xs font-semibold text-slate-400">System Audio</span>
      <button 
        onClick={() => setIsChecked(!isChecked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${isChecked ? bgStyle : 'bg-slate-800'}`}
      >
        <span 
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} 
        />
      </button>
      <span className={`text-xs font-semibold ${isChecked ? 'text-white' : 'text-slate-500'}`}>
        {isChecked ? 'Enabled' : 'Muted'}
      </span>
    </div>
  );
};

export default InteractiveNeumorphicToggle;
