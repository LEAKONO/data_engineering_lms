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
    <div ref={ref} className="h-full overflow-y-auto">
      <div className="max-w-3xl xl:max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span 
              className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap"
              style={{
                background: `${chapter.color}22`,
                color: chapter.color
              }}
            >
              {chapter.emoji} <span className="hidden xs:inline">{chapter.title.split(' — ')[0]}</span>
            </span>
            {progress[section.id] && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-400 flex items-center gap-1 whitespace-nowrap">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden xs:inline">Completed</span>
              </span>
            )}
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight break-words">
            {section.title}
          </h1>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1 rounded-full bg-slate-800">
              <div 
                className="h-full rounded-full transition-all" 
                style={{
                  width: `${(chProgress / chTotal) * 100}%`,
                  background: chapter.color
                }}
              />
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {chProgress}/{chTotal}
            </span>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-3 sm:space-y-4">
          {section.blocks.map((block, i) => onRenderBlock(block, i))}
        </div>

        {/* Notes */}
        <div className="mt-6 sm:mt-8">
          <NotesPanel sectionId={section.id} />
        </div>

        {/* Quiz */}
        {section.quiz && (
          <div className="mt-6 sm:mt-8">
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
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 sm:mt-8">
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
    </div>
  );
});

ContentArea.displayName = 'ContentArea';
export default ContentArea;