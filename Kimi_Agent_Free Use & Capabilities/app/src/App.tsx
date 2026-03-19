import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from '@/contexts/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { SpeakTab } from '@/pages/SpeakTab';
import { KnowledgeTab } from '@/pages/KnowledgeTab';
import { CompeteTab } from '@/pages/CompeteTab';
import { ProgressTab } from '@/pages/ProgressTab';
import { ChatPage } from '@/pages/ChatPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { UnitPage } from '@/pages/UnitPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { QuizPage } from '@/pages/QuizPage';
import { DojoPage } from '@/pages/DojoPage';
import { LessonReaderPage } from '@/pages/LessonReaderPage';
import type { TabType, Lesson, N5Lesson } from '@/types';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('speak');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUnit, setShowUnit] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showDojo, setShowDojo] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedN5Lesson, setSelectedN5Lesson] = useState<N5Lesson | null>(null);

  const handleStartLesson = () => setShowUnit(true);

  const handleLessonSelected = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowUnit(false);
    setShowChat(true);
  };

  const handleN5LessonSelected = (n5: N5Lesson) => {
    setSelectedN5Lesson(n5);
    setShowUnit(false);
  };

  const handleN5Practice = () => {
    if (!selectedN5Lesson) return;
    const mappedLesson: Lesson = {
      id: `n5-${selectedN5Lesson.lessonNumber}`,
      unit: 'N5',
      level: `Lesson ${selectedN5Lesson.lessonNumber}`,
      title: selectedN5Lesson.title,
      description: selectedN5Lesson.grammar[0]?.rule || '',
      exercises: []
    };
    setSelectedLesson(mappedLesson);
    setSelectedN5Lesson(null); // Close the reader first
    setShowChat(true);
  };

  const handleStartChat = () => {
    setSelectedLesson(null);
    setShowChat(true);
  };

  const handleChatBack = () => { setShowChat(false); setSelectedLesson(null); };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'speak':
        return (
          <SpeakTab
            onStartLesson={handleStartLesson}
            onStartChat={handleStartChat}
            onStartDojo={() => setShowDojo(true)}
          />
        );
      case 'knowledge':
        return <KnowledgeTab onStartReview={() => setShowReview(true)} />;
      case 'compete':
        return <CompeteTab />;
      case 'progress':
        return <ProgressTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppLayout activeTab={activeTab} onTabChange={setActiveTab} onSettings={() => setShowSettings(true)}>
        {renderTabContent()}
      </AppLayout>

      <AnimatePresence>
        {showChat && (
          <ChatPage
            key="chat"
            onBack={handleChatBack}
            lessonTitle={selectedLesson?.title}
            lessonContext={selectedLesson ? `${selectedLesson.unit} · ${selectedLesson.level}` : undefined}
          />
        )}
        {showSettings && <SettingsPage key="settings" onBack={() => setShowSettings(false)} />}
        {showUnit && (
          <UnitPage
            key="unit"
            onBack={() => setShowUnit(false)}
            onStartLesson={handleLessonSelected}
            onStartN5Lesson={handleN5LessonSelected}
          />
        )}
        {showReview && <ReviewPage key="review" onBack={() => setShowReview(false)} />}
        {showDojo && <DojoPage key="dojo" onBack={() => setShowDojo(false)} />}
        {selectedN5Lesson && (
          <LessonReaderPage
            key={`reader-${selectedN5Lesson.lessonNumber}`}
            lesson={selectedN5Lesson}
            onBack={() => setSelectedN5Lesson(null)}
            onPractice={handleN5Practice}
          />
        )}
        {selectedLesson?.exercises && selectedLesson.exercises.length > 0 && (
          <QuizPage
            key="quiz"
            lesson={selectedLesson}
            onBack={() => setSelectedLesson(null)}
            onComplete={() => setSelectedLesson(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
