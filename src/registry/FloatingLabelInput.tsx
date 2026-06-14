// category: inputs
// description: An elegant, fluid input component with a floating placeholder that scales down on focus.

import React, { useState } from 'react';

interface FloatingLabelInputProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  color = 'violet',
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const inputStyles = {
    violet: 'focus:ring-violet-600 peer-focus:text-violet-500 dark:peer-focus:text-violet-400',
    emerald: 'focus:ring-emerald-600 peer-focus:text-emerald-500 dark:peer-focus:text-emerald-400',
    rose: 'focus:ring-rose-600 peer-focus:text-rose-500 dark:peer-focus:text-rose-400',
    blue: 'focus:ring-blue-600 peer-focus:text-blue-500 dark:peer-focus:text-blue-400',
    amber: 'focus:ring-amber-600 peer-focus:text-amber-500 dark:peer-focus:text-amber-400',
  };

  return (
    <div className="relative w-full max-w-xs">
      <input 
        type="text" 
        id="floating_preview_reg"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder ?? ' '}
        className={`block w-full px-4 py-3 text-sm text-white bg-slate-900 border border-slate-850 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:border-transparent peer transition-all duration-300 ${inputStyles[color] || inputStyles.violet}`} 
      />
      <label 
        htmlFor={id} 
        className="absolute text-xs text-slate-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-950 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 pointer-events-none"
      >
        Email Address
      </label>
    </div>
  );
};

export default FloatingLabelInput;
