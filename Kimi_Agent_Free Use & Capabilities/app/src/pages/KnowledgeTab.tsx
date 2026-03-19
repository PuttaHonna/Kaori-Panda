import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBank } from '@/components/knowledge/WordBank';
import { Dictionary } from '@/components/knowledge/Dictionary';
import { GrammarList } from '@/components/knowledge/GrammarList';
import { TeFormChallenge } from '@/components/knowledge/TeFormChallenge';
import { FloatingActionButton } from '@/components/shared/FloatingActionButton';
import { grammarData } from '@/data/grammar';
import { useApp } from '@/contexts/AppContext';
import { getDateString } from '@/lib/utils';
import { useWanakana } from '@/hooks/useWanakana';
import type { KnowledgeSubTab, Word } from '@/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const subTabs: { id: KnowledgeSubTab; label: string }[] = [
  { id: 'wordbank', label: 'Word Bank' },
  { id: 'dictionary', label: 'Dictionary' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'te-form', label: 'Te-Form' },
];

interface KnowledgeTabProps {
  onStartReview?: () => void;
}

export function KnowledgeTab({ onStartReview }: KnowledgeTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<KnowledgeSubTab>('wordbank');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ japanese: '', romaji: '', english: '' });
  const [formError, setFormError] = useState('');
  const { state, dispatch } = useApp();

  const japaneseInputRef = useWanakana<HTMLInputElement>();

  const handleAddWord = () => {
    setForm({ japanese: '', romaji: '', english: '' });
    setFormError('');
    setShowAddModal(true);
  };

  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.japanese.trim() || !form.english.trim()) {
      setFormError('Japanese and English fields are required.');
      return;
    }
    const newWord: Word = {
      id: Date.now().toString(),
      japanese: form.japanese.trim(),
      romaji: form.romaji.trim(),
      english: form.english.trim(),
      learned: false,
      // SRS defaults: due today (start reviewing immediately)
      level: 0,
      nextReviewDate: getDateString(new Date()),
      reviewCount: 0,
    };
    dispatch({ type: 'ADD_WORD', payload: newWord });
    const wordsGoalCurrent = state.goals.find(g => g.id === '3')?.current ?? 0;
    dispatch({ type: 'UPDATE_GOAL', payload: { id: '3', current: wordsGoalCurrent + 1 } });
    setShowAddModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-4"
    >
      {/* Sub Tabs */}
      <div className="flex items-center justify-center gap-6 mb-6 px-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={cn(
              'text-base font-medium pb-2 transition-colors relative',
              activeSubTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            {tab.label}
            {activeSubTab === tab.id && (
              <motion.div
                layoutId="knowledgeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-bamboo-400 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4">
        {activeSubTab === 'wordbank' && (
          <WordBank
            words={state.words}
            onAddWords={handleAddWord}
            onStartReview={onStartReview}
          />
        )}
        {activeSubTab === 'dictionary' && <Dictionary />}
        {activeSubTab === 'grammar' && <GrammarList grammar={grammarData} />}
        {activeSubTab === 'te-form' && <TeFormChallenge />}
      </div>

      {activeSubTab === 'wordbank' && <FloatingActionButton onClick={handleAddWord} />}

      {/* Add Word Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Word</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitWord} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Japanese <span className="text-bamboo-500">*</span>
              </label>
              <input
                ref={japaneseInputRef}
                type="text"
                value={form.japanese}
                onChange={e => setForm(f => ({ ...f, japanese: e.target.value }))}
                placeholder="例：食べる"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bamboo-200 jp-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Romaji</label>
              <input
                type="text"
                value={form.romaji}
                onChange={e => setForm(f => ({ ...f, romaji: e.target.value }))}
                placeholder="e.g. taberu"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bamboo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                English <span className="text-bamboo-500">*</span>
              </label>
              <input
                type="text"
                value={form.english}
                onChange={e => setForm(f => ({ ...f, english: e.target.value }))}
                placeholder="e.g. to eat"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bamboo-200"
              />
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-full bg-bamboo-400 hover:bg-bamboo-500 text-white">
                Add Word
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AnimatePresence />
    </motion.div>
  );
}
