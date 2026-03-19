import { ChevronRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LearningMode } from '@/types';
import { cn } from '@/lib/utils';

interface LearningModeCardProps {
  mode: LearningMode;
  onClick?: () => void;
  index?: number;
}

export function LearningModeCard({ mode, onClick, index = 0 }: LearningModeCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      disabled={mode.locked}
      className={cn(
        'w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card',
        'transition-all duration-200',
        !mode.locked && 'hover:shadow-card-hover active:scale-[0.98]',
        mode.locked && 'opacity-70'
      )}
    >
      {/* Illustration */}
      <div className="flex-shrink-0 w-20 h-20 relative">
        <img
          src={mode.illustration}
          alt={mode.title}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-gray-900 mb-1">{mode.title}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{mode.description}</p>
        
        {mode.locked ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm">{mode.lockMessage}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-bamboo-400">
            <span className="text-sm font-medium">{mode.actionText}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
