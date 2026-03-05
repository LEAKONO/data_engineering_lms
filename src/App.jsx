import React, { useState, useRef, useEffect } from 'react';
import { curriculum } from './data/index';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateProgress, getAdjacentSections, searchContent } from './utils/helpers';

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
import MobileMenu from './components/layout/MobileMenu';

// Add Google Fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

export default function App() {
  const [activeCh, setActiveCh] = useState("ch1");
  const [activeSec, setActiveSec] = useState("ch1s1");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
  }, [activeSec]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (chId, secId) => {
    setActiveCh(chId);
    setActiveSec(secId);
    setSearchResults([]);
    setSidebarOpen(false);
    setMobileMenuOpen(false);
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
          <p key={index} className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base break-words">
            {block.content}
          </p>
        );
      case "code":
        return (
          <CodeBlock key={index} label={block.label} code={block.code} language={block.language} />
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
      className="h-screen flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#080c14",
      }}
    >
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        completedCount={progressStats.completed}
        totalSecs={progressStats.total}
        onSearch={handleSearch}
        searchResults={searchResults}
        onNavigate={handleNavigate}
      />

      {mobileMenuOpen && (
        <MobileMenu
          curriculum={curriculum}
          activeCh={activeCh}
          activeSec={activeSec}
          progress={progress}
          onNavigate={handleNavigate}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-30 w-64 sm:w-72 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:transform-none lg:translate-x-0 lg:block
        `}>
          <Sidebar
            curriculum={curriculum}
            activeCh={activeCh}
            activeSec={activeSec}
            progress={progress}
            onNavigate={handleNavigate}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
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
        </main>

        {/* Right Panel */}
        <div className="hidden xl:block">
          <RightPanel
            curriculum={curriculum}
            chapter={chapter}
            activeSec={activeSec}
            progress={progress}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
}