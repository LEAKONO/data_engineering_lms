import React, { useState } from 'react';

export default function CodeBlock({ label, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 my-4" style={{fontFamily:"'JetBrains Mono',monospace"}}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"/>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"/>
            <div className="w-3 h-3 rounded-full bg-green-500/70"/>
          </div>
          <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all copy-button"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="bg-slate-900/90 overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed whitespace-pre" style={{color:"#a8dadc"}}>
          {code}
        </pre>
      </div>
    </div>
  );
}