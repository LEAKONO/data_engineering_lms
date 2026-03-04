import React from 'react';

export default function RightPanel({ curriculum, chapter, activeSec, progress, onNavigate }) {
  if (!chapter) return null;

  return (
    <div className="w-52 flex-shrink-0 border-l border-slate-800/40 p-4 hidden lg:block" style={{background:"#0b1019"}}>
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
        In This Chapter
      </div>
      
      <div className="space-y-1">
        {chapter.sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => onNavigate(chapter.id, sec.id)}
            className="w-full text-left px-2 py-1.5 rounded-lg group transition-all hover:bg-slate-800/40"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: activeSec === sec.id 
                    ? chapter.color 
                    : (progress[sec.id] ? "#10b981" : "#374151")
                }}
              />
              <span className={`text-xs leading-snug ${
                activeSec === sec.id 
                  ? "text-white font-medium" 
                  : "text-slate-500 group-hover:text-slate-300"
              }`}>
                {sec.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          All Chapters
        </div>
        <div className="space-y-1">
          {curriculum.map(c => (
            <button
              key={c.id}
              onClick={() => onNavigate(c.id, c.sections[0].id)}
              className="w-full text-left px-2 py-1.5 rounded-lg group transition-all hover:bg-slate-800/40 flex items-center gap-2"
            >
              <span className="text-sm leading-none">{c.emoji}</span>
              <span className={`text-xs truncate ${
                activeSec?.startsWith(c.id) 
                  ? "text-white font-medium" 
                  : "text-slate-600 group-hover:text-slate-400"
              }`}>
                {c.title.split(" — ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}