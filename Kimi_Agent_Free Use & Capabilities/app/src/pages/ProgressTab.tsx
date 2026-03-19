import { motion } from 'framer-motion';
import { Mail, Timer, BookOpen } from 'lucide-react';
import { ProfileCard } from '@/components/progress/ProfileCard';

import { StatRow } from '@/components/progress/StatRow';
import { HistoryList } from '@/components/progress/HistoryList';
import { useApp } from '@/contexts/AppContext';

export function ProgressTab() {
  const { state, dispatch } = useApp();

  const handleUpdateName = (name: string) => {
    dispatch({ type: 'SET_USER', payload: { name } });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-4 px-4 space-y-4"
    >
      {/* Profile Card */}
      <ProfileCard name={state.user.name} onUpdateName={handleUpdateName} />



      {/* Stats */}
      <div className="space-y-3">
        <StatRow
          icon={Mail}
          iconColor="bg-purple-100 text-purple-600"
          label="Total messages"
          value={state.stats.messagesSpoken}
        />
        <StatRow
          icon={Timer}
          iconColor="bg-cyan-100 text-cyan-600"
          label="Total speak time"
          value={formatTime(state.stats.secondsSpoken)}
        />
        <StatRow
          icon={BookOpen}
          iconColor="bg-emerald-100 text-emerald-600"
          label="Words learned"
          value={`${state.stats.wordsLearned} words`}
        />

      </div>

      {/* History */}
      <HistoryList messages={state.messages} />
    </motion.div>
  );
}
