import React, { useState } from 'react';

export default function MobileMenu({ curriculum, activeCh, activeSec, progress, onNavigate, onClose }) {
  const [expandedCh, setExpandedCh] = useState(activeCh);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Menu */}
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0b1019] border-r border-slate-800/60 overflow-y-auto animate-slide-right">
        <div className="sticky top-0 bg-[#0b1019] z-10 p-4 border-b border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]">
              DE
            </div>
            <span className="text-white font-semibold">Menu</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3">
          {curriculum.map(ch => (
            <div key={ch.id} className="mb-2">
              <button
                onClick={() => setExpandedCh(expandedCh === ch.id ? null : ch.id)}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{ch.emoji}</span>
                  <span className="text-sm font-medium text-white">{ch.title}</span>
                </div>
                <svg 
                  className={`w-4 h-4 text-slate-400 transition-transform ${expandedCh === ch.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedCh === ch.id && (
                <div className="ml-8 mt-1 space-y-1">
                  {ch.sections.map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        onNavigate(ch.id, sec.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                        activeSec === sec.id 
                          ? 'bg-slate-800/60 text-white' 
                          : 'hover:bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: progress[sec.id] 
                            ? ch.color 
                            : (activeSec === sec.id ? ch.color : "#374151")
                        }}
                      />
                      <span className="text-sm flex-1">{sec.title}</span>
                      {progress[sec.id] && (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/40 mt-4">
          <div className="text-xs text-slate-500 mb-2">Overall Progress</div>
          <div className="h-1.5 rounded-full bg-slate-800 mb-1">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]" 
              style={{ width: '45%' }}
            />
          </div>
          <div className="text-xs text-slate-400">45% Complete</div>
        </div>
      </div>
    </div>
  );
}