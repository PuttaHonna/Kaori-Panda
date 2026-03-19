import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { DailyGoals } from '@/components/speak/DailyGoals';
import { StatsGrid } from '@/components/speak/StatsGrid';
import { LearningModeCard } from '@/components/speak/LearningModeCard';
import { useApp } from '@/contexts/AppContext';
import type { LearningMode } from '@/types';

interface SpeakTabProps {
  onStartLesson: () => void;
  onStartChat: () => void;
  onStartDojo: () => void;
}

export function SpeakTab({ onStartLesson, onStartChat, onStartDojo }: SpeakTabProps) {
  const { state } = useApp();
  const [showStats, setShowStats] = useState(false);

  const learningModes: LearningMode[] = [
    {
      id: 'lesson',
      title: 'Lesson Mode',
      description: 'Learn grammar and vocab through conversations',
      actionText: 'Start Unit 1.1',
      illustration: '/illustrations/lesson-mode.png',
    },
    {
      id: 'freespeak',
      title: 'FreeSpeak',
      description: 'Practice conversing, anything goes!',
      actionText: 'Start Chatting',
      illustration: '/illustrations/freespeak-mode.png',
    },
    {
      id: 'dojo',
      title: 'Multiplayer Dojo',
      description: '60-second rapid-fire race against another online player!',
      actionText: 'Enter Dojo',
      illustration: '/illustrations/revision-mode.png',
    },
  ];

  const handleModeClick = (modeId: string) => {
    switch (modeId) {
      case 'lesson':
        onStartLesson();
        break;
      case 'freespeak':
        onStartChat();
        break;
      case 'dojo':
        onStartDojo();
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-4 space-y-6"
    >
      {/* Header with refresh */}
      <div className="flex items-center justify-between px-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Daily Goals or Stats Grid */}
      {showStats ? (
        <StatsGrid stats={state.stats} />
      ) : (
        <DailyGoals goals={state.goals} />
      )}

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowStats(false)}
          className={`w-2 h-2 rounded-full transition-colors ${!showStats ? 'bg-gray-800' : 'bg-gray-300'
            }`}
        />
        <button
          onClick={() => setShowStats(true)}
          className={`w-2 h-2 rounded-full transition-colors ${showStats ? 'bg-gray-800' : 'bg-gray-300'
            }`}
        />
      </div>

      {/* Learning Modes */}
      <div className="px-4 space-y-4">
        {learningModes.map((mode, index) => (
          <LearningModeCard
            key={mode.id}
            mode={mode}
            index={index}
            onClick={() => handleModeClick(mode.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
