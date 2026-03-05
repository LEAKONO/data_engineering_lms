import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ label, code, language = 'sql' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect language from label or content
  const detectLanguage = () => {
    if (label?.toLowerCase().includes('python') || code.includes('import ') || code.includes('def ')) {
      return 'python';
    }
    if (label?.toLowerCase().includes('bash') || label?.toLowerCase().includes('shell')) {
      return 'bash';
    }
    if (code.includes('SELECT') || code.includes('INSERT') || code.includes('CREATE TABLE')) {
      return 'sql';
    }
    return language;
  };

  const lang = detectLanguage();

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 my-4 shadow-lg">
      {/* Header with window controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
            {lang.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all copy-button"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code with syntax highlighting */}
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: '#0B1120',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
        showLineNumbers={code.split('\n').length > 5}
        wrapLines={true}
        lineNumberStyle={{
          color: '#4B5563',
          fontSize: '0.8rem',
          marginRight: '1rem',
        }}
      >
        {code}
      </SyntaxHighlighter>

      {/* Language-specific badges for common patterns */}
      {code.includes('ERROR') && (
        <div className="px-4 py-2 bg-red-950/30 border-t border-red-900/30 text-xs text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>⚠️ This example shows a common error pattern</span>
        </div>
      )}
    </div>
  );
}