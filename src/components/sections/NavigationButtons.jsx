import React from 'react';

export default function NavigationButtons({ 
  prevSec, 
  nextSec, 
  currentSec,
  chapterColor,
  isCompleted,
  onMarkDone,
  onNavigate 
}) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800/50">
      {prevSec ? (
        <button
          onClick={() => onNavigate(prevSec.chId, prevSec.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          <span className="truncate max-w-36">{prevSec.title}</span>
        </button>
      ) : <div />}

      <button
        onClick={onMarkDone}
        disabled={isCompleted}
        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: isCompleted ? "#1f2937" : `linear-gradient(135deg,${chapterColor},#8b5cf6)`,
          color: isCompleted ? "#4b5563" : "white",
          cursor: isCompleted ? "default" : "pointer"
        }}
      >
        {isCompleted ? "✓ Completed" : "Mark as Done"}
      </button>

      {nextSec ? (
        <button
          onClick={() => {
            onMarkDone();
            onNavigate(nextSec.chId, nextSec.id);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{background: `${chapterColor}22`, color: chapterColor}}
        >
          <span className="truncate max-w-36">{nextSec.title}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      ) : (
        <div className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10">
          🎉 Course Complete!
        </div>
      )}
    </div>
  );
}