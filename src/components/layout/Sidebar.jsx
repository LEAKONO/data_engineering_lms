import React from 'react';

export default function Sidebar({ curriculum, activeCh, activeSec, progress, onNavigate, onClose }) {
  return (
    <div className="w-64 sm:w-72 lg:w-64 flex-shrink-0 border-r border-slate-800/60 flex flex-col h-full bg-[#0b1019]">
      <div className="p-3 sm:p-4 border-b border-slate-800/40 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Curriculum
        </div>
        {/* Close button for mobile */}
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-800 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {curriculum.map(ch => (
          <div key={ch.id} className="mb-1">
            <button
              onClick={() => {
                onNavigate(ch.id, ch.sections[0].id);
                if (onClose) onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 sm:py-3 rounded-lg mx-2 hover:bg-slate-800/50 transition-all group w-[calc(100%-16px)]"
            >
              <span className="text-base sm:text-lg leading-none">{ch.emoji}</span>
              <div className="flex-1 text-left min-w-0">
                <div className={`text-xs sm:text-sm font-medium truncate ${
                  activeCh === ch.id ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}>
                  {ch.title}
                </div>
                <div className="hidden sm:flex items-center gap-1.5 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-slate-800">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{
                        width: `${(ch.sections.filter(s => progress[s.id]).length / ch.sections.length) * 100}%`,
                        background: ch.color
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-600">
                    {ch.sections.filter(s => progress[s.id]).length}/{ch.sections.length}
                  </span>
                </div>
                {/* Mobile progress indicator */}
                <div className="sm:hidden flex items-center gap-1 mt-1">
                  <span className="text-xs text-slate-600">
                    {ch.sections.filter(s => progress[s.id]).length}/{ch.sections.length}
                  </span>
                </div>
              </div>
            </button>

            {activeCh === ch.id && (
              <div className="ml-4 sm:ml-6 pl-3 border-l border-slate-800 mt-0.5 mb-1">
                {ch.sections.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      onNavigate(ch.id, sec.id);
                      if (onClose) onClose();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-lg text-left group transition-all hover:bg-slate-800/30"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: progress[sec.id] 
                          ? ch.color 
                          : (activeSec === sec.id ? ch.color : "#374151")
                      }}
                    />
                    <span className={`text-xs sm:text-sm truncate ${
                      activeSec === sec.id 
                        ? "text-white font-medium" 
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}>
                      {sec.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}