import { motion } from 'framer-motion';
import { Leaderboard } from '@/components/compete/Leaderboard';
import { leaderboardData } from '@/data/leaderboard';
import { useApp } from '@/contexts/AppContext';

export function CompeteTab() {
  const { state } = useApp();

  // Build the leaderboard with user's score injected
  const userScore = state.stats.messagesSpoken;
  const userName = state.user.name || 'You';

  const userEntry = {
    rank: 0, // will be calculated below
    username: userName,
    score: userScore,
    isCurrentUser: true,
  };

  // Merge user entry into the leaderboard and sort
  const allEntries = [
    ...leaderboardData.map(e => ({ ...e, isCurrentUser: false })),
    userEntry,
  ]
    .sort((a, b) => b.score - a.score)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-4"
    >
      <Leaderboard entries={allEntries} />
    </motion.div>
  );
}
