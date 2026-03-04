import React, { useState } from 'react';

export default function TopBar({ 
  sidebarOpen, 
  setSidebarOpen, 
  completedCount, 
  totalSecs,
  onSearch,
  searchResults,
  onNavigate 
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleResultClick = (chId, secId) => {
    onNavigate(chId, secId);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex items-center px-4 h-12 border-b border-slate-800/80 flex-shrink-0" style={{background:"#0b1019"}}>
      <button 
        onClick={() => setSidebarOpen(s => !s)} 
        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all mr-3"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      
      <div className="flex items-center gap-2 mr-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{background:"linear-gradient(135deg,#06b6d4,#8b5cf6)"}}>
          DE
        </div>
        <span className="text-white font-bold text-sm hidden sm:block">Data Engineering Mastery</span>
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-xs hidden sm:flex">
        <div className="flex-1 h-1.5 rounded-full bg-slate-800">
          <div 
            className="h-full rounded-full transition-all duration-500" 
            style={{
              width: `${(completedCount / totalSecs) * 100}%`,
              background: "linear-gradient(90deg,#06b6d4,#8b5cf6)"
            }}
          />
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {completedCount}/{totalSecs}
        </span>
      </div>

      <div className="ml-auto relative">
        <button 
          onClick={() => setSearchOpen(s => !s)} 
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        
        {searchOpen && (
          <div className="absolute right-0 top-9 w-80 rounded-xl border border-slate-700/60 shadow-2xl z-50" style={{background:"#111827"}}>
            <div className="p-2">
              <input 
                autoFocus 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search topics, code, concepts..."
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="pb-2 max-h-64 overflow-y-auto">
                {searchResults.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleResultClick(s.chapterId, s.id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="text-xs font-medium text-white">
                      {s.chapterEmoji} {s.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.chapterTitle}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.length > 1 && searchResults.length === 0 && (
              <div className="px-3 pb-3 text-xs text-slate-500">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}