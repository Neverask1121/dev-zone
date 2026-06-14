// category: inputs
// description: A responsive toggle switch featuring high-fidelity active shadow glow indicators and sliding animations.

import React, { useState } from 'react';

interface InteractiveNeumorphicToggleProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const InteractiveNeumorphicToggle: React.FC<InteractiveNeumorphicToggleProps> = ({
  color = 'violet',
  checked: controlledChecked,
  defaultChecked,
  onChange
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const accentStyles = {
    violet: 'bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.4)]',
    emerald: 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    rose: 'bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    blue: 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    amber: 'bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
  };

  const bgStyle = accentStyles[color] || accentStyles.violet;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-slate-400">System Audio</span>
      <button 
        onClick={handleToggle}
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
