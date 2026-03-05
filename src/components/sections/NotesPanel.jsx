import React, { useState, useEffect } from 'react';

export default function NotesPanel({ sectionId }) {
  const storageKey = `de-notes-${sectionId}`;
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [sectionId, storageKey]);

  const saveNotes = () => {
    localStorage.setItem(storageKey, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 overflow-hidden bg-[#0d1520]">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📝</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Notes
          </span>
        </div>
        <button
          onClick={saveNotes}
          className="text-xs px-2 sm:px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
        >
          {saved ? "✓ Saved" : "Save"}
        </button>
      </div>
      
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Add your notes here..."
        className="w-full p-3 sm:p-4 text-xs sm:text-sm text-slate-300 placeholder-slate-600 outline-none resize-none"
        style={{background: "transparent", minHeight: "80px"}}
        rows={3}
      />
    </div>
  );
}