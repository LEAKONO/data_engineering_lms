import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ label, code, language = 'sql' }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
  const lineCount = code.split('\n').length;
  const shouldTruncate = lineCount > 12 && !isExpanded;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 my-3 sm:my-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
          <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
            {lang.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400 font-medium truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
          {lineCount > 12 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs px-1.5 sm:px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all whitespace-nowrap"
            >
              {isExpanded ? 'Less' : 'More'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-1.5 sm:px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
          >
            {copied ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="relative max-w-full">
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '0.75rem',
              background: '#0B1120',
              fontSize: '0.75rem',
              lineHeight: '1.4',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
            showLineNumbers={lineCount > 3}
            wrapLines={true}
            lineNumberStyle={{
              color: '#4B5563',
              fontSize: '0.7rem',
              marginRight: '0.5rem',
              minWidth: '1.5rem',
            }}
            codeTagProps={{
              style: {
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>

        {shouldTruncate && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B1120] to-transparent flex items-end justify-center pb-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-all shadow-lg"
            >
              Expand ({lineCount} lines)
            </button>
          </div>
        )}
      </div>

      {code.includes('ERROR') && (
        <div className="px-3 sm:px-4 py-2 bg-red-950/30 border-t border-red-900/30 text-xs text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="truncate">⚠️ Common error pattern</span>
        </div>
      )}
    </div>
  );
}