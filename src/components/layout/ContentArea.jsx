import React, { forwardRef } from 'react';

const ContentArea = forwardRef(({ 
  chapter, 
  section, 
  progress, 
  onRenderBlock,
  onMarkDone,
  onNavigate,
  adjacentSections,
  NotesPanel,
  QuizComponent,
  NavigationButtons
}, ref) => {
  if (!chapter || !section) return null;

  const chProgress = chapter.sections.filter(s => progress[s.id]).length;
  const chTotal = chapter.sections.length;

  return (
    <div ref={ref} className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span 
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `${chapter.color}22`,
                color: chapter.color
              }}
            >
              {chapter.emoji} {chapter.title}
            </span>
            {progress[section.id] && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/20 text-emerald-400">
                ✓ Completed
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            {section.title}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <div className="h-0.5 flex-1 rounded-full" style={{background: `${chapter.color}30`}}>
              <div 
                className="h-full rounded-full" 
                style={{
                  width: `${(chProgress / chTotal) * 100}%`,
                  background: chapter.color
                }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {chProgress}/{chTotal} sections
            </span>
          </div>
        </div>

        {/* Content Blocks */}
        {section.blocks.map((block, i) => onRenderBlock(block, i))}

        {/* Notes */}
        <NotesPanel sectionId={section.id} />

        {/* Quiz */}
        {section.quiz && (
          <QuizComponent
            quiz={section.quiz}
            sectionId={section.id}
            chColor={chapter.color}
            onPass={() => {
              onMarkDone();
              if (adjacentSections.next) {
                onNavigate(adjacentSections.next.chId, adjacentSections.next.id);
              }
            }}
          />
        )}

        {/* Navigation */}
        <NavigationButtons
          prevSec={adjacentSections.prev}
          nextSec={adjacentSections.next}
          currentSec={section.id}
          chapterColor={chapter.color}
          isCompleted={progress[section.id]}
          onMarkDone={onMarkDone}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
});

ContentArea.displayName = 'ContentArea';
export default ContentArea;