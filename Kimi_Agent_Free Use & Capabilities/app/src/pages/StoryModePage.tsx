import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, ChevronRight, BookOpen, Volume2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { geminiPrompt, hasGeminiKey } from '@/lib/gemini';
import { useVoiceSynthesis } from '@/hooks/useVoiceSynthesis';
import { useApp } from '@/contexts/AppContext';

interface StorySentence {
  japanese: string;
  furigana: string;
  english: string;
}

interface Story {
  title: string;
  sentences: StorySentence[];
}

async function generateStory(level: string): Promise<Story> {
  const levelMap: Record<string, string> = {
    beginner: 'N5 (very simple sentences, は・が・です・じゃない, common verbs)',
    intermediate: 'N4 (て-form, past tense, adjectives, ～たい)',
    advanced: 'N3 (conditional forms, passive, causative)',
  };
  const jlpt = levelMap[level] || levelMap.beginner;
  const prompt = `Create a short, fun Japanese story for a ${jlpt} learner.
Return ONLY valid JSON in this exact format:
{
  "title": "Story title in English",
  "sentences": [
    { "japanese": "Japanese sentence", "furigana": "hiragana reading of the sentence", "english": "English translation" },
    { "japanese": "...", "furigana": "...", "english": "..." },
    { "japanese": "...", "furigana": "...", "english": "..." },
    { "japanese": "...", "furigana": "...", "english": "..." },
    { "japanese": "...", "furigana": "...", "english": "..." }
  ]
}
Important: 5 sentences only. Keep vocabulary at ${jlpt} level. Make it fun and culturally interesting (food, travel, daily life).
Return ONLY the JSON.`;

  const raw = await geminiPrompt(prompt);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as Story;
}

interface StoryModePageProps {
  onBack: () => void;
}

export function StoryModePage({ onBack }: StoryModePageProps) {
  const { state } = useApp();
  const { speak, isSpeaking } = useVoiceSynthesis();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});

  const loadStory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStory(null);
    setRevealed(0);
    setShowTranslation({});
    try {
      const s = await generateStory(state.settings.difficulty);
      setStory(s);
      setRevealed(1);
    } catch {
      setError('Could not generate a story. Please check your API key.');
    } finally {
      setLoading(false);
    }
  }, [state.settings.difficulty]);

  const toggleTranslation = (idx: number) =>
    setShowTranslation(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-amber-50 to-white"
    >
      {/* Header */}
      <div className="flex items-center p-4 bg-white/80 backdrop-blur border-b sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-slate-800">Story Mode 📖</h1>
        {story && (
          <button onClick={loadStory} className="p-2 rounded-full hover:bg-slate-100">
            <RefreshCw className="w-5 h-5 text-slate-500" />
          </button>
        )}
        {!story && <div className="w-9" />}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* No story yet */}
        {!story && !loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 py-16">
            <div className="w-24 h-24 rounded-3xl bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-amber-500" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-2">AI Story Mode</h2>
              <p className="text-slate-500 text-sm max-w-xs">
                Gemini generates a short Japanese story at your level. Tap each sentence to reveal the translation.
              </p>
            </div>
            {!hasGeminiKey && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-700 text-center max-w-xs">
                Add your Gemini API key in Settings to use Story Mode.
              </div>
            )}
            <Button
              onClick={loadStory}
              disabled={!hasGeminiKey}
              className="w-48 h-12 text-base rounded-2xl bg-amber-500 hover:bg-amber-600 font-bold"
            >
              Generate Story ✨
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-slate-500 font-medium">Kaori is writing a story for you…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm text-center">
            {error}
            <Button onClick={loadStory} size="sm" className="block mx-auto mt-3 rounded-xl">Try again</Button>
          </div>
        )}

        {/* Story */}
        {story && !loading && (
          <div className="space-y-4 max-w-lg mx-auto">
            <h2 className="text-xl font-black text-slate-900 text-center mb-6">{story.title}</h2>

            <AnimatePresence>
              {story.sentences.slice(0, revealed).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="jp-text text-xl font-bold text-slate-900 mb-1">{s.japanese}</p>
                        <p className="text-slate-400 text-sm">{s.furigana}</p>
                      </div>
                      <button
                        onClick={() => speak(s.japanese)}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 shrink-0"
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-amber-500' : 'text-slate-500'}`} />
                      </button>
                    </div>

                    {/* Translation toggle */}
                    <button
                      onClick={() => toggleTranslation(i)}
                      className="mt-3 text-xs text-amber-600 font-medium hover:underline"
                    >
                      {showTranslation[i] ? 'Hide translation' : 'Show translation'}
                    </button>
                    <AnimatePresence>
                      {showTranslation[i] && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-slate-600 text-sm mt-1"
                        >
                          {s.english}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Next sentence / finish */}
            <div className="text-center py-4">
              {revealed < story.sentences.length ? (
                <Button
                  onClick={() => setRevealed(r => r + 1)}
                  className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-bold gap-2"
                >
                  Next Sentence <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-500 font-medium">🎉 You finished the story!</p>
                  <Button onClick={loadStory} className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-bold gap-2">
                    <RefreshCw className="w-4 h-4" /> New Story
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
