import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeaderboardEntryExtended {
  rank: number;
  username: string;
  score: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntryExtended[];
}

const rankColors: Record<number, string> = {
  1: 'bg-yellow-300 text-yellow-900',
  2: 'bg-gray-200 text-gray-700',
  3: 'bg-amber-200 text-amber-800',
};

function formatScore(score: number): string {
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
  return score.toString();
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-bamboo-100 flex items-center justify-center">
          <span className="text-xl">🌸</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
      </div>

      <p className="text-gray-600 mb-4">Words Spoken This Week</p>

      <div className="space-y-2">
        {entries.map((entry, index) => {
          const isTop3 = entry.rank <= 3;
          const rankColor = rankColors[entry.rank];

          return (
            <motion.div
              key={`${entry.username}-${entry.rank}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={cn(
                'flex items-center gap-4 p-3 rounded-2xl shadow-sm transition-all duration-200',
                entry.isCurrentUser
                  ? 'bg-bamboo-100 border-2 border-bamboo-300'
                  : isTop3
                    ? 'bg-stat-yellow'
                    : 'bg-white'
              )}
            >
              {/* Rank Badge */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  isTop3 ? rankColor : 'bg-gray-100 text-gray-600'
                )}
              >
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
              </div>

              {/* Username */}
              <span
                className={cn(
                  'flex-1 font-medium',
                  entry.isCurrentUser ? 'text-bamboo-700 font-semibold' : isTop3 ? 'text-gray-900' : 'text-gray-700'
                )}
              >
                {entry.username}
                {entry.isCurrentUser && (
                  <span className="ml-1 text-xs text-bamboo-500">(you)</span>
                )}
              </span>

              {/* Score */}
              <span
                className={cn(
                  'font-semibold',
                  entry.isCurrentUser ? 'text-bamboo-700' : isTop3 ? 'text-gray-900' : 'text-gray-600'
                )}
              >
                {formatScore(entry.score)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
