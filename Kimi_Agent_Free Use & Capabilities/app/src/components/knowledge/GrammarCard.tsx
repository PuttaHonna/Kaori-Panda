import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GrammarPoint } from '@/types';
import { JLPTBadge } from './JLPTBadge';
import { cn } from '@/lib/utils';

interface GrammarCardProps {
  grammar: GrammarPoint;
  index?: number;
  onClick?: () => void;
}

export function GrammarCard({ grammar, index = 0, onClick }: GrammarCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 bg-white rounded-2xl shadow-card',
        'transition-all duration-200',
        'hover:shadow-card-hover active:scale-[0.98]'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg jp-text">
            {grammar.japanese}
          </h3>
          <p className="text-sm text-gray-500 jp-text">{grammar.romaji}</p>
        </div>
        <JLPTBadge level={grammar.level} />
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3 jp-text">
        {grammar.exampleJapanese}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium line-clamp-1 pr-4">
          {grammar.exampleEnglish}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
      </div>
    </motion.button>
  );
}
