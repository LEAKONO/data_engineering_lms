import React from 'react';

export default function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-slate-700/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60">
            {headers.map((h, i) => (
              <th 
                key={i} 
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-700/50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr 
              key={ri} 
              className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                ri % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/10"
              }`}
            >
              {row.map((cell, ci) => (
                <td 
                  key={ci} 
                  className={`px-4 py-3 leading-relaxed text-slate-300 text-sm ${
                    ci === 0 ? "font-semibold text-white" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}