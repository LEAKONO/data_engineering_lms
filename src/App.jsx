import React, { useState, useRef, useEffect } from 'react';
import { curriculum } from './data/index';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateProgress, getAdjacentSections, findSectionById, searchContent } from './utils/helpers';

import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import ContentArea from './components/layout/ContentArea';
import CodeBlock from './components/shared/CodeBlock';
import DataTable from './components/shared/DataTable';
import InfoBox from './components/shared/InfoBox';
import QuizComponent from './components/shared/QuizComponent';
import NotesPanel from './components/sections/NotesPanel';
import NavigationButtons from './components/sections/NavigationButtons';

// Add Google Fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

export default function App() {
  const [activeCh, setActiveCh] = useState("ch1");
  const [activeSec, setActiveSec] = useState("ch1s1");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useLocalStorage('de-progress', {});
  const [searchResults, setSearchResults] = useState([]);
  const contentRef = useRef(null);

  const chapter = curriculum.find(c => c.id === activeCh);
  const section = chapter?.sections.find(s => s.id === activeSec);
  const progressStats = calculateProgress(progress, curriculum);
  const adjacentSections = getAdjacentSections(curriculum, activeSec);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeSec]);

  const handleNavigate = (chId, secId) => {
    setActiveCh(chId);
    setActiveSec(secId);
    setSearchResults([]);
  };

  const handleMarkDone = () => {
    setProgress(prev => ({
      ...prev,
      [activeSec]: true
    }));
  };

  const handleSearch = (query) => {
    setSearchResults(searchContent(curriculum, query));
  };

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <p key={index} className="text-slate-300 leading-relaxed mb-4 text-sm">
            {block.content}
          </p>
        );
      case "code":
        return (
          <CodeBlock key={index} label={block.label} code={block.code} />
        );
      case "table":
        return (
          <DataTable key={index} headers={block.headers} rows={block.rows} />
        );
      case "info":
        return (
          <InfoBox 
            key={index} 
            label={block.label} 
            color={block.color} 
            content={block.content} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#080c14",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        completedCount={progressStats.completed}
        totalSecs={progressStats.total}
        onSearch={handleSearch}
        searchResults={searchResults}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            curriculum={curriculum}
            activeCh={activeCh}
            activeSec={activeSec}
            progress={progress}
            onNavigate={handleNavigate}
          />
        )}

        <ContentArea
          ref={contentRef}
          chapter={chapter}
          section={section}
          progress={progress}
          onRenderBlock={renderBlock}
          onMarkDone={handleMarkDone}
          onNavigate={handleNavigate}
          adjacentSections={adjacentSections}
          NotesPanel={NotesPanel}
          QuizComponent={QuizComponent}
          NavigationButtons={NavigationButtons}
        />

        <RightPanel
          curriculum={curriculum}
          chapter={chapter}
          activeSec={activeSec}
          progress={progress}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}