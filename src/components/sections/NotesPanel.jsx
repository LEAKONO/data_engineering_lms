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
    <div className="mt-6 rounded-2xl border border-slate-700/50 overflow-hidden" style={{background:"#0d1520"}}>
      <div className="px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📝</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            My Notes
          </span>
        </div>
        <button
          onClick={saveNotes}
          className="text-xs px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
        >
          {saved ? "✓ Saved" : "Save"}
        </button>
      </div>
      
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Add your own notes, questions, examples, or reminders for this section..."
        className="w-full p-4 text-sm text-slate-300 placeholder-slate-600 outline-none resize-none"
        style={{background: "transparent", minHeight: "100px"}}
      />
    </div>
  );
}