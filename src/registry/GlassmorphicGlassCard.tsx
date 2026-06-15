// category: cards
// description: A glowing backdrop blur card with reflective borders and elegant hover scaling.

import React from 'react';
import { DollarSign } from 'lucide-react';
import type { BaseComponentProps } from './types';

interface GlassmorphicGlassCardProps extends BaseComponentProps {}

export const GlassmorphicGlassCard: React.FC<GlassmorphicGlassCardProps> = ({ color = 'violet', id, className: extraClassName, style, 'data-testid': testId, role, tabIndex }) => {
  const glassCardStyles = {
    violet: { glow: 'bg-violet-600/20 text-violet-400', hoverGlow: 'group-hover:bg-violet-600/40', blurGlow: 'bg-violet-600/30 group-hover:bg-violet-600/50' },
    emerald: { glow: 'bg-emerald-600/20 text-emerald-400', hoverGlow: 'group-hover:bg-emerald-600/40', blurGlow: 'bg-emerald-600/30 group-hover:bg-emerald-600/50' },
    rose: { glow: 'bg-rose-600/20 text-rose-400', hoverGlow: 'group-hover:bg-rose-600/40', blurGlow: 'bg-rose-600/30 group-hover:bg-rose-600/50' },
    blue: { glow: 'bg-blue-600/20 text-blue-400', hoverGlow: 'group-hover:bg-blue-600/40', blurGlow: 'bg-blue-600/30 group-hover:bg-blue-600/50' },
    amber: { glow: 'bg-amber-600/20 text-amber-400', hoverGlow: 'group-hover:bg-amber-600/40', blurGlow: 'bg-amber-600/30 group-hover:bg-amber-600/50' },
  };

  const current = glassCardStyles[color] || glassCardStyles.violet;

  return (
    <div id={id} style={style} data-testid={testId} role={role} tabIndex={tabIndex} className={`relative group p-6 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-white/20 transition-all duration-300 hover:translate-y-[-4px] shadow-2xl max-w-sm${extraClassName ? ` ${extraClassName}` : ''}`}>
      <div className={`absolute -top-12 -left-12 w-24 h-24 rounded-full blur-2xl opacity-40 transition-colors duration-300 ${current.blurGlow}`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform ${current.glow}`}>
          <DollarSign className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Secure Transactions</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Experience decentralized payment infrastructures with robust end-to-end encryption protocols.
        </p>
      </div>
    </div>
  );
};

export default GlassmorphicGlassCard;
