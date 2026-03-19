import { useState } from 'react';
import { ArrowUpDown, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import type { Word } from '@/types';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getDateString } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface WordBankProps {
  words: Word[];
  onAddWords?: () => void;
  onStartReview?: () => void;
}

const SRS_LEVEL_BADGES = [
  { label: 'New', color: 'bg-gray-100 text-gray-500' },
  { label: 'Learning', color: 'bg-blue-100 text-blue-600' },
  { label: 'Familiar', color: 'bg-amber-100 text-amber-700' },
  { label: 'Confident', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Advanced', color: 'bg-purple-100 text-purple-700' },
  { label: 'Mastered', color: 'bg-rose-100 text-rose-700' },
];

export function WordBank({ words, onAddWords, onStartReview }: WordBankProps) {
  const { dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const today = getDateString(new Date());
  const dueCount = words.filter(w => !w.nextReviewDate || w.nextReviewDate <= today).length;
  const learnedCount = words.filter(w => w.learned).length;

  const filteredWords = words.filter(w =>
    w.japanese.includes(searchQuery) ||
    w.romaji?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (words.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={BookOpen}
          title="No words yet"
          subtitle="Add words from the + button, or start speaking — words will appear here"
        />
        <div className="text-center">
          <Button onClick={onAddWords} className="rounded-full bg-bamboo-400 hover:bg-bamboo-500 text-white">
            + Add First Word
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Due today banner */}
      {dueCount > 0 && (
        <button
          onClick={onStartReview}
          className="w-full flex items-center justify-between p-4 bg-bamboo-50 border-2 border-bamboo-200 rounded-2xl hover:bg-bamboo-100 active:scale-[0.98] transition-all"
        >
          <div className="text-left">
            <p className="font-semibold text-bamboo-700">🔔 {dueCount} card{dueCount > 1 ? 's' : ''} due today</p>
            <p className="text-sm text-bamboo-500">Tap to start your review session</p>
          </div>
          <span className="text-bamboo-500 text-lg">→</span>
        </button>
      )}

      {/* Search + Sort */}
      <div className="flex items-center gap-2">
        <SearchBar
          placeholder={`${learnedCount} / ${words.length} learned`}
          className="flex-1"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <ArrowUpDown className="w-5 h-5" />
        </button>
      </div>

      {/* Word list */}
      {filteredWords.length === 0 ? (
        <EmptyState title="No words found" subtitle="Try a different search term" />
      ) : (
        <div className="space-y-2">
          {filteredWords.map((word) => {
            const level = word.level ?? 0;
            const badge = SRS_LEVEL_BADGES[Math.min(level, SRS_LEVEL_BADGES.length - 1)];
            const isDue = !word.nextReviewDate || word.nextReviewDate <= today;
            return (
              <div
                key={word.id}
                className={cn(
                  'p-4 rounded-xl shadow-sm flex items-center gap-3 transition-colors',
                  word.learned ? 'bg-emerald-50' : 'bg-white',
                  isDue && !word.learned && 'border-l-4 border-bamboo-300'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn('font-medium jp-text', word.learned ? 'text-emerald-800' : 'text-gray-900')}>
                      {word.japanese}
                    </p>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', badge.color)}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{word.romaji}</p>
                </div>
                <p className="text-sm text-gray-600 shrink-0">{word.english}</p>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_WORD_LEARNED', payload: word.id })}
                  className="p-1 ml-1 transition-colors shrink-0"
                >
                  {word.learned
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
