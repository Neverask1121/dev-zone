// category: cards
// description: A designer personal card showcasing profile details, social icons, and stats.

import React from 'react';

interface SleekProfileCardProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const SleekProfileCard: React.FC<SleekProfileCardProps> = ({ color = 'violet' }) => {
  const profileCardStyles = {
    violet: { glowBorder: 'from-violet-600 to-pink-600', text: 'text-indigo-400', bgGlow: 'bg-indigo-500/10' },
    emerald: { glowBorder: 'from-emerald-600 to-teal-600', text: 'text-teal-400', bgGlow: 'bg-teal-500/10' },
    rose: { glowBorder: 'from-rose-600 to-pink-600', text: 'text-pink-400', bgGlow: 'bg-pink-500/10' },
    blue: { glowBorder: 'from-blue-600 to-cyan-600', text: 'text-sky-400', bgGlow: 'bg-cyan-500/10' },
    amber: { glowBorder: 'from-amber-600 to-orange-600', text: 'text-amber-400', bgGlow: 'bg-orange-500/10' },
  };

  const current = profileCardStyles[color] || profileCardStyles.violet;

  return (
    <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 transition-colors duration-500 ${current.bgGlow}`}></div>
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className={`absolute -inset-1 bg-gradient-to-r rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity ${current.glowBorder}`}></div>
          <img className="w-16 h-16 rounded-full relative z-10 object-cover border-2 border-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" alt="Avatar" />
        </div>
        <h3 className="text-base font-bold text-white tracking-wide">Evelyn Sterling</h3>
        <p className={`text-xs font-medium mb-3 ${current.text}`}>Principal UI Designer</p>
        <p className="text-[11px] text-slate-400 text-center leading-relaxed mb-5">
          Crafting futuristic spatial UI paradigms and immersive interactive design tokens.
        </p>
        
        <div className="grid grid-cols-3 gap-4 w-full py-3 border-y border-slate-800 text-center mb-5">
          <div>
            <div className="text-xs font-bold text-white">12.5k</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Follow</div>
          </div>
          <div>
            <div className="text-xs font-bold text-white">142</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Works</div>
          </div>
          <div>
            <div className="text-xs font-bold text-white">98%</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Rate</div>
          </div>
        </div>
        
        <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors active:scale-95 duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default SleekProfileCard;
