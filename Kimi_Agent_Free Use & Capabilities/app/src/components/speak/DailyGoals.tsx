import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Goal } from '@/types';
import { cn } from '@/lib/utils';

interface DailyGoalsProps {
  goals: Goal[];
  onGoalClick?: (goal: Goal) => void;
}

const colorMap = {
  green: {
    bg: 'bg-stat-green',
    text: 'text-emerald-700',
    icon: 'bg-emerald-500',
  },
  orange: {
    bg: 'bg-stat-orange',
    text: 'text-orange-700',
    icon: 'bg-orange-500',
  },
  blue: {
    bg: 'bg-stat-blue',
    text: 'text-blue-700',
    icon: 'bg-blue-500',
  },
};

export function DailyGoals({ goals, onGoalClick }: DailyGoalsProps) {
  return (
    <div className="px-4 py-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Today</h2>
      <div className="space-y-3">
        {goals.map((goal, index) => {
          const colors = colorMap[goal.color];
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onGoalClick?.(goal)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl',
                colors.bg,
                'transition-all duration-200 hover:shadow-md active:scale-[0.98]'
              )}
            >
              {/* Progress Circle */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 1.26} 126`}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className={cn(
                  'absolute inset-0 flex items-center justify-center text-sm font-bold',
                  colors.text
                )}>
                  {goal.current}
                </span>
              </div>
              
              {/* Goal Text */}
              <div className="flex-1 text-left">
                <p className={cn('font-medium', colors.text)}>
                  {goal.title}
                </p>
              </div>
              
              {/* Arrow */}
              <ChevronRight className={cn('w-5 h-5', colors.text)} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
