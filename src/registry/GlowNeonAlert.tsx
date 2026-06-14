// category: feedback
// description: A glossy status indicator alert with glowing border accent lights and custom action items.

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface GlowNeonAlertProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
  visible?: boolean;
  defaultVisible?: boolean;
  onDismiss?: () => void;
}

export const GlowNeonAlert: React.FC<GlowNeonAlertProps> = ({
  color = 'violet',
  visible: controlledVisible,
  defaultVisible,
  onDismiss
}) => {
  const [internalVisible, setInternalVisible] = useState(defaultVisible ?? true);

  const isControlled = controlledVisible !== undefined;
  const alertVisible = isControlled ? controlledVisible : internalVisible;

  const handleDismiss = () => {
    if (!isControlled) setInternalVisible(false);
    onDismiss?.();
  };

  const handleShow = () => {
    if (!isControlled) setInternalVisible(true);
  };

  const alertStyles = {
    violet: {
      container: 'bg-violet-950/20 border-violet-800/30 shadow-[0_0_20px_rgba(168,85,247,0.08)]',
      line: 'bg-violet-500',
      icon: 'bg-violet-500/10 text-violet-400',
      action: 'text-violet-400 hover:text-violet-300'
    },
    emerald: {
      container: 'bg-emerald-950/20 border-emerald-800/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]',
      line: 'bg-emerald-500',
      icon: 'bg-emerald-500/10 text-emerald-400',
      action: 'text-emerald-400 hover:text-emerald-300'
    },
    rose: {
      container: 'bg-rose-950/20 border-rose-800/30 shadow-[0_0_20px_rgba(244,63,94,0.08)]',
      line: 'bg-rose-500',
      icon: 'bg-rose-500/10 text-rose-400',
      action: 'text-rose-400 hover:text-rose-300'
    },
    blue: {
      container: 'bg-blue-950/20 border-blue-800/30 shadow-[0_0_20px_rgba(59,130,246,0.08)]',
      line: 'bg-blue-500',
      icon: 'bg-blue-500/10 text-blue-400',
      action: 'text-blue-400 hover:text-blue-300'
    },
    amber: {
      container: 'bg-amber-950/20 border-amber-800/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]',
      line: 'bg-amber-500',
      icon: 'bg-amber-500/10 text-amber-400',
      action: 'text-amber-400 hover:text-amber-300'
    }
  };

  const current = alertStyles[color] || alertStyles.violet;

  if (!alertVisible) {
    return (
      <button 
        onClick={handleShow} 
        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs border border-slate-800 transition-colors"
      >
        Show Alert Again
      </button>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full max-w-xs p-3.5 rounded-xl border flex items-start gap-3 group transition-all duration-300 ${current.container}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${current.line}`}></div>
      <div className={`p-1.5 rounded-lg shrink-0 ${current.icon}`}>
        <Info className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white mb-0.5 tracking-wide">System Update</h4>
          <button onClick={handleDismiss} className="text-[10px] text-slate-500 hover:text-slate-300">✕</button>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Version 2.4.0 is ready. Features custom layout engines and smooth GPU accelerators.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button className={`text-[10px] font-bold transition-colors ${current.action}`}>Update Now</button>
          <button className="text-[10px] font-bold text-slate-500 hover:text-slate-400 transition-colors">Later</button>
        </div>
      </div>
    </div>
  );
};

export default GlowNeonAlert;
