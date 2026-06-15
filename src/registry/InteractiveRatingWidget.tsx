// category: inputs
// description: Interactive customer stars rating selector with responsive feedback animations.

import React, { useState } from 'react';

interface InteractiveRatingWidgetProps {
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const InteractiveRatingWidget: React.FC<InteractiveRatingWidgetProps> = ({ color = 'violet' }) => {
  const [rating, setRating] = useState(0);

  const starColors = {
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-xl space-y-4">
      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Rate Component</h4>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
              rating >= star ? `${starColors[color]}` : 'text-slate-600'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && (
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Thank you for rating {rating}/5 stars!
        </div>
      )}
    </div>
  );
};

export default InteractiveRatingWidget;
