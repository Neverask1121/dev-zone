// category: cards
// description: A high-fidelity pricing grid card highlighting subscription tier plans and responsive button accents.

import React from 'react';
import { Check } from 'lucide-react';

interface SleekPricingCardProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const SleekPricingCard: React.FC<SleekPricingCardProps> = ({ color = 'violet' }) => {
  const accentStyles = {
    violet: {
      btn: 'bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]',
      text: 'text-violet-400',
      badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    },
    emerald: {
      btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    rose: {
      btn: 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
      text: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    blue: {
      btn: 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    amber: {
      btn: 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  };

  const current = accentStyles[color] || accentStyles.violet;

  return (
    <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
      {/* Top Accent Ring */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15 bg-gradient-to-br from-white to-transparent`}></div>

      {/* Plan Details */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${current.badge}`}>
          POPULAR PLAN
        </span>
      </div>

      <h3 className="text-xl font-bold text-white tracking-wide">Developer Suite</h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ultimate toolkit for independent SaaS creators.</p>
      
      <div className="my-5 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-white">$49</span>
        <span className="text-xs font-semibold text-slate-500">/ month</span>
      </div>

      {/* Features Checklist */}
      <ul className="space-y-3 mb-6 text-[11px] text-slate-300 font-medium">
        <li className="flex items-center gap-2">
          <Check className={`w-4 h-4 shrink-0 ${current.text}`} />
          <span>Unlimited Cloud Sandboxes</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className={`w-4 h-4 shrink-0 ${current.text}`} />
          <span>Tailwind CSS v4 Native Compiler</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className={`w-4 h-4 shrink-0 ${current.text}`} />
          <span>100 GB Distributed SSD Cache</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className={`w-4 h-4 shrink-0 ${current.text}`} />
          <span>24/7 Priority Discord Support</span>
        </li>
      </ul>

      {/* Pricing Button */}
      <button className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${current.btn}`}>
        Get Started Today
      </button>
    </div>
  );
};

export default SleekPricingCard;
