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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-800/50">
      {prevSec ? (
        <button
          onClick={() => onNavigate(prevSec.chId, prevSec.id)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="truncate max-w-[120px] sm:max-w-[150px]">{prevSec.title}</span>
        </button>
      ) : <div className="hidden sm:block" />}

      <button
        onClick={onMarkDone}
        disabled={isCompleted}
        className="w-full sm:w-auto px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all order-first sm:order-none"
        style={{
          background: isCompleted ? "#1f2937" : `linear-gradient(135deg,${chapterColor},#8b5cf6)`,
          color: isCompleted ? "#4b5563" : "white",
          cursor: isCompleted ? "default" : "pointer"
        }}
      >
        {isCompleted ? "✓ Completed" : "Mark Complete"}
      </button>

      {nextSec ? (
        <button
          onClick={() => {
            onMarkDone();
            onNavigate(nextSec.chId, nextSec.id);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          style={{background: `${chapterColor}22`, color: chapterColor}}
        >
          <span className="truncate max-w-[120px] sm:max-w-[150px]">{nextSec.title}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-500/10 text-center">
          🎉 Complete!
        </div>
      )}
    </div>
  );
}