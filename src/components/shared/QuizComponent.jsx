import React, { useState, useEffect } from 'react';

export default function QuizComponent({ quiz, sectionId, chColor, onPass }) {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState("hidden");

  const score = submitted ? quiz.filter((q, i) => selected[i] === q.correct).length : 0;
  const passed = score >= Math.ceil(quiz.length * 0.7);

  useEffect(() => {
    setSelected({});
    setSubmitted(false);
    setCurrent(0);
    setMode("hidden");
  }, [sectionId]);

  if (mode === "hidden") {
    return (
      <div className="mt-8 p-5 rounded-2xl border border-slate-700/50" style={{background:"#0d1520"}}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-sm">Section Quiz</div>
            <div className="text-slate-500 text-xs mt-0.5">
              {quiz.length} questions • Need 70% to pass
            </div>
          </div>
          <button 
            onClick={() => setMode("taking")} 
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{background: `linear-gradient(135deg, ${chColor}, #8b5cf6)`}}
          >
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  if (mode === "taking") {
    const q = quiz[current];
    return (
      <div className="mt-8 rounded-2xl border border-slate-700/50 overflow-hidden" style={{background:"#0d1520"}}>
        <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Quiz</span>
          <span className="text-xs text-slate-500">Question {current + 1} of {quiz.length}</span>
        </div>
        
        <div className="p-5">
          <div className="flex gap-1.5 mb-5">
            {quiz.map((_, i) => (
              <div 
                key={i} 
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{
                  background: i < current ? "#10b981" : i === current ? chColor : "#1e293b"
                }}
              />
            ))}
          </div>

          <p className="text-white font-medium text-sm leading-relaxed mb-5">{q.q}</p>

          <div className="space-y-2">
            {q.opts.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => !submitted && setSelected(s => ({...s, [current]: oi}))}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all border quiz-option"
                style={{
                  background: selected[current] === oi ? `${chColor}22` : "#111827",
                  borderColor: selected[current] === oi ? chColor : "#1e293b",
                  color: selected[current] === oi ? "white" : "#94a3b8"
                }}
              >
                <span className="font-bold mr-2" style={{color: selected[current] === oi ? chColor : "#475569"}}>
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-5">
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            >
              ← Prev
            </button>

            {current < quiz.length - 1 ? (
              <button
                onClick={() => setCurrent(current + 1)}
                disabled={selected[current] === undefined}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
                style={{background: `${chColor}44`}}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmitted(true);
                  setMode("results");
                }}
                disabled={Object.keys(selected).length < quiz.length}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30"
                style={{background: `linear-gradient(135deg, ${chColor}, #8b5cf6)`}}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results mode
  return (
    <div 
      className="mt-8 rounded-2xl border overflow-hidden" 
      style={{
        background: "#0d1520",
        borderColor: passed ? "#10b98144" : "#ef444444"
      }}
    >
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{
              background: passed ? "#10b98122" : "#ef444422",
              color: passed ? "#10b981" : "#ef4444"
            }}
          >
            {Math.round(score / quiz.length * 100)}%
          </div>
          
          <div>
            <div className="text-lg font-bold" style={{color: passed ? "#10b981" : "#ef4444"}}>
              {passed ? "✓ Passed!" : "✗ Not Yet"}
            </div>
            <div className="text-slate-400 text-sm">
              {score} / {quiz.length} correct • Need {Math.ceil(quiz.length * 0.7)}/{quiz.length} to pass
            </div>
          </div>

          <button
            onClick={() => {
              setSelected({});
              setSubmitted(false);
              setCurrent(0);
              setMode("taking");
            }}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
        {quiz.map((q, i) => {
          const isCorrect = selected[i] === q.correct;
          return (
            <div 
              key={i} 
              className="rounded-xl p-4" 
              style={{
                background: isCorrect ? "#10b98111" : "#ef444411",
                border: `1px solid ${isCorrect ? "#10b98133" : "#ef444433"}`
              }}
            >
              <div className="flex gap-2 mb-2">
                <span style={{color: isCorrect ? "#10b981" : "#ef4444"}}>
                  {isCorrect ? "✓" : "✗"}
                </span>
                <span className="text-white text-sm font-medium">{q.q}</span>
              </div>
              
              {!isCorrect && (
                <div className="text-xs text-red-400 mb-1.5">
                  Your answer: <span className="text-slate-300">
                    {q.opts[selected[i]] ?? 'Not answered'}
                  </span>
                </div>
              )}
              
              <div className="text-xs mb-2" style={{color: "#6ee7b7"}}>
                ✓ Correct: <span className="text-white">{q.opts[q.correct]}</span>
              </div>
              
              <div className="text-xs text-slate-400 leading-relaxed bg-slate-800/50 rounded-lg p-3">
                {q.exp}
              </div>
            </div>
          );
        })}
      </div>

      {passed && (
        <div className="px-5 pb-5">
          <button
            onClick={onPass}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{background: `linear-gradient(135deg, ${chColor}, #8b5cf6)`}}
          >
            Mark Section Complete & Continue →
          </button>
        </div>
      )}
    </div>
  );
}