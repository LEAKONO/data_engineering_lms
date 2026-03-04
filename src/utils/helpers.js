export const calculateProgress = (progress, curriculum) => {
  const totalSections = curriculum.reduce(
    (acc, ch) => acc + ch.sections.length, 
    0
  );
  const completedSections = Object.values(progress).filter(Boolean).length;
  return {
    total: totalSections,
    completed: completedSections,
    percentage: (completedSections / totalSections) * 100
  };
};

export const findSectionById = (curriculum, sectionId) => {
  for (const ch of curriculum) {
    const section = ch.sections.find(s => s.id === sectionId);
    if (section) {
      return { ...section, chapterId: ch.id, chapterColor: ch.color };
    }
  }
  return null;
};

export const getAdjacentSections = (curriculum, currentSectionId) => {
  const allSections = curriculum.flatMap(ch => 
    ch.sections.map(s => ({ ...s, chId: ch.id }))
  );
  
  const currentIndex = allSections.findIndex(s => s.id === currentSectionId);
  
  return {
    prev: currentIndex > 0 ? allSections[currentIndex - 1] : null,
    next: currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null
  };
};

export const searchContent = (curriculum, query) => {
  if (query.length < 2) return [];
  
  const results = [];
  curriculum.forEach(ch => {
    ch.sections.forEach(sec => {
      const matches = 
        sec.title.toLowerCase().includes(query.toLowerCase()) ||
        sec.blocks.some(block => 
          (block.content || block.code || "").toLowerCase().includes(query.toLowerCase())
        );
      
      if (matches) {
        results.push({
          id: sec.id,
          title: sec.title,
          chapterId: ch.id,
          chapterTitle: ch.title,
          chapterEmoji: ch.emoji
        });
      }
    });
  });
  
  return results.slice(0, 8);
};