import { useState, useMemo } from 'react';
import type { GrammarPoint } from '@/types';
import { GrammarCard } from './GrammarCard';
import { SearchBar } from '@/components/shared/SearchBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { JLPTBadge } from './JLPTBadge';

interface GrammarListProps {
  grammar: GrammarPoint[];
}

export function GrammarList({ grammar }: GrammarListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarPoint | null>(null);

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  const filteredGrammar = useMemo(() => {
    return grammar.filter((g) => {
      // 1. Level Check
      const matchesLevel = !selectedLevel || g.level === selectedLevel;
      if (!matchesLevel) return false;

      // 2. Search Check
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();

      return (
        g.japanese.toLowerCase().includes(query) ||
        g.romaji.toLowerCase().includes(query) ||
        g.meaning.toLowerCase().includes(query) ||
        g.exampleJapanese.toLowerCase().includes(query) ||
        g.exampleEnglish.toLowerCase().includes(query)
      );
    });
  }, [grammar, searchQuery, selectedLevel]);

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder="Search grammar..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* JLPT Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
            className={`
              shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all
              ${selectedLevel === level
                ? 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'
              }
            `}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm px-1">
        <span className="text-gray-500 font-medium">
          {filteredGrammar.length} grammar {filteredGrammar.length === 1 ? 'point' : 'points'}
        </span>
      </div>

      <div className="space-y-3">
        {filteredGrammar.map((g, index) => (
          <GrammarCard
            key={g.id}
            grammar={g}
            index={index}
            onClick={() => setSelectedGrammar(g)}
          />
        ))}
      </div>

      <Dialog
        open={selectedGrammar !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedGrammar(null)}
      >
        <DialogContent className="max-w-md mx-4 rounded-3xl p-6 sm:p-8">
          {selectedGrammar && (
            <>
              <DialogHeader className="mb-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <DialogTitle className="text-2xl font-bold jp-text">
                    {selectedGrammar.japanese}
                  </DialogTitle>
                  <JLPTBadge level={selectedGrammar.level} />
                </div>
                <p className="text-gray-500 font-medium">{selectedGrammar.romaji}</p>
              </DialogHeader>

              <div className="space-y-6">
                <div className="bg-bamboo-50 p-4 rounded-2xl border border-bamboo-100">
                  <h4 className="text-sm font-bold text-bamboo-800 uppercase tracking-wider mb-1">
                    Meaning
                  </h4>
                  <p className="text-bamboo-900 font-medium text-lg">
                    {selectedGrammar.meaning}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Example Usage
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <p className="jp-text text-xl font-medium text-gray-900 leading-normal">
                      {selectedGrammar.exampleJapanese}
                    </p>
                    <p className="text-gray-600">
                      {selectedGrammar.exampleEnglish}
                    </p>
                  </div>
                </div>

                {selectedGrammar.kanjiExplanation && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Kanji Breakdown
                    </h4>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                      <div className="flex flex-col gap-2">
                        {selectedGrammar.kanjiExplanation.split(',').map((part, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                            <span className="text-gray-700 jp-text">
                              {part.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
