import React from 'react';

export default function InfoBox({ label, color, content }) {
  return (
    <div 
      className="my-3 sm:my-4 rounded-xl p-3 sm:p-4" 
      style={{
        borderLeft: `4px solid ${color}`,
        background: `${color}11`,
        border: `1px solid ${color}30`,
        borderLeftWidth: "4px"
      }}
    >
      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color}}>
        {label}
      </div>
      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed break-words">
        {content}
      </p>
    </div>
  );
}