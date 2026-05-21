// category: feedback
// description: An ultra-premium glassmorphic dialog modal featuring backdrop-blur filters, scaling transitions, and success checkmarks.

import React, { useState } from 'react';
import { Info, Sparkles, X } from 'lucide-react';

interface GlassmorphicModalProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const GlassmorphicModal: React.FC<GlassmorphicModalProps> = ({ color = 'violet' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const accentStyles = {
    violet: {
      btn: 'bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]',
      icon: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      outlineBtn: 'border-violet-500/20 hover:bg-violet-500/10 text-violet-400'
    },
    emerald: {
      btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      outlineBtn: 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400'
    },
    rose: {
      btn: 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
      icon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      outlineBtn: 'border-rose-500/20 hover:bg-rose-500/10 text-rose-400'
    },
    blue: {
      btn: 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      icon: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      outlineBtn: 'border-blue-500/20 hover:bg-blue-500/10 text-blue-400'
    },
    amber: {
      btn: 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      icon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      outlineBtn: 'border-amber-500/20 hover:bg-amber-500/10 text-amber-400'
    }
  };

  const current = accentStyles[color] || accentStyles.violet;

  return (
    <div className="flex items-center justify-center">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`px-6 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${current.btn}`}
      >
        Open Dialog Modal
      </button>

      {/* Backdrop Layer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          {/* Modal Container */}
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900/80 border border-white/10 dark:border-white/5 shadow-2xl overflow-hidden animate-scale-up">
            {/* Top Gloss Ornament */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-30 bg-gradient-to-br from-white to-transparent`}></div>

            {/* Header / Title */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${current.icon}`}>
                <Info className="w-5 h-5" />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide flex items-center gap-1.5">
              Confirm Transaction <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              You are about to authorize an asynchronous deployment pipeline. Please double-check your environment variables before executing.
            </p>

            {/* Actions Layer */}
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className={`px-4.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${current.outlineBtn}`}
              >
                Cancel Action
              </button>
              <button 
                onClick={() => {
                  alert('Action Confirmed Successfully!');
                  setIsOpen(false);
                }}
                className={`px-5 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${current.btn}`}
              >
                Confirm & Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlassmorphicModal;
