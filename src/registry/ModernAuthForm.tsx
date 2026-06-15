// category: inputs
// description: A responsive modern auth login form with sleek micro-interactions and inline input validations.

import React, { useState } from 'react';

interface ModernAuthFormProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const ModernAuthForm: React.FC<ModernAuthFormProps> = ({ color = 'violet' }) => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const btnColors = {
    violet: 'bg-violet-600 hover:bg-violet-700 focus:ring-violet-500',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
    rose: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    amber: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-850 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="name@domain.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-850 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all ${btnColors[color]} focus:outline-none focus:ring-2`}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default ModernAuthForm;
