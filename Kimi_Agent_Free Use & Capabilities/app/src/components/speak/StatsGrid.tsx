import { MessageSquare, Layers, Users, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Stats } from '@/types';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  stats: Stats;
}

interface StatItem {
  key: keyof Stats;
  label: string;
  icon: React.ElementType;
}

const statItems: StatItem[] = [
  { key: 'messagesSpoken', label: 'Messages Spoken', icon: MessageSquare },
  { key: 'flashcardsRevised', label: 'Flashcards Revised', icon: Layers },
  { key: 'lessonsCompleted', label: 'Lessons Completed', icon: Users },
  { key: 'secondsSpoken', label: 'Seconds Spoken', icon: Timer },
];

function formatStatValue(key: keyof Stats, value: number): string {
  if (key === 'secondsSpoken') {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }
  return value.toString();
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          const value = stats[item.key];
          
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-stat-blue rounded-2xl p-4',
                'transition-all duration-200 hover:shadow-md'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatStatValue(item.key, value)}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">{item.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
