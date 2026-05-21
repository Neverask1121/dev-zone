// category: buttons
// description: A modern, vibrant button with an animated gradient background glow and tactile press feedback.

import React from 'react';
import { Sparkles } from 'lucide-react';

interface GlowPremiumButtonProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const GlowPremiumButton: React.FC<GlowPremiumButtonProps> = ({ color = 'violet' }) => {
  const glowBtnStyles = {
    violet: 'from-violet-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.55)]',
    emerald: 'from-emerald-600 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)]',
    rose: 'from-rose-600 to-pink-600 shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:shadow-[0_0_30px_rgba(244,63,94,0.55)]',
    blue: 'from-blue-600 to-cyan-600 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.55)]',
    amber: 'from-amber-600 to-orange-600 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.55)]',
  };

  return (
    <button className={`relative group overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${glowBtnStyles[color]}`}>
      <span className="relative z-10 flex items-center justify-center gap-2">
        Get Started Free <Sparkles className="w-4 h-4" />
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    </button>
  );
};

export default GlowPremiumButton;
