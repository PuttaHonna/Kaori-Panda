import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateJLPTChapters, type JLPTWord } from '@/lib/jlpt';
import { useApp } from '@/contexts/AppContext';
// getMinnaLessons removed
import type { Lesson, N5Lesson } from '@/types';
import { cn } from '@/lib/utils';

// Static fallback for A1 just in case
// import { lessonsData as staticLessons } from '@/data/lessons';
import n5Data from '@/data/genkiN5.json';

interface UnitPageProps {
  onBack: () => void;
  onStartLesson: (lesson: Lesson) => void;
  onStartN5Lesson?: (lesson: N5Lesson) => void;
}

export function UnitPage({ onBack, onStartLesson, onStartN5Lesson }: UnitPageProps) {
  const { state } = useApp();
  const [curriculum, setCurriculum] = useState<'jlpt' | 'genki'>('genki');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<number>(5); // Default to N5 config (JLPT)
  const [chapters, setChapters] = useState<Lesson[]>([]);
  const [n5Lessons, setN5Lessons] = useState<N5Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedId(lesson.id);
    // Brief visual feedback then navigate
    setTimeout(() => {
      onStartLesson(lesson);
    }, 200);
  };

  // Fetch JLPT Data or load Minna NO Nihongo
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      if (curriculum === 'genki') {
        try {
          // Map JSON to N5Lesson interface
          const parsed: N5Lesson[] = (n5Data.lessons || []).map((l: unknown) => {
            const lessonObj = l as { lessonNumber: number; topic?: string; grammar: string; key_vocab?: string[] };
            return {
            lessonNumber: lessonObj.lessonNumber,
            title: lessonObj.topic || `Lesson ${lessonObj.lessonNumber}`,
            grammar: [
              {
                rule: lessonObj.grammar,
                explanation: 'See textbook for full explanation',
                examples: []
              }
            ],
            vocabulary: lessonObj.key_vocab?.map((v: string) => ({
              kanji: v, reading: '', english: '' // Stub out vocab shape
            })) || []
          }});

          if (parsed && Array.isArray(parsed)) {
            // Pattern for 12 Genki I Chapters
            const offset = (5 - activeLevel) * 12;
            const allLessons: N5Lesson[] = Array.from({ length: 12 }, (_, i) => {
              const lessonNum = i + 1 + offset;
              const existing = parsed.find(l => l.lessonNumber === lessonNum);
              if (existing) return existing;
              // Dummy empty lesson for UI structure
              return {
                lessonNumber: lessonNum,
                title: `Lesson ${lessonNum}`,
                grammar: [{ rule: 'Coming Soon', explanation: 'TBD', examples: [] }],
                vocabulary: []
              };
            });

            setN5Lessons(allLessons);
          }
        } catch (err: unknown) {
          console.error("Genki syllabus error:", err);
          setError("Failed to load Genki syllabus.");
          setN5Lessons([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Load JLPT
      try {
        const res = await fetch(`/jlpt/n${activeLevel}.json`);
        if (!res.ok) throw new Error('Failed to fetch JSON');
        const words: JLPTWord[] = await res.json();

        const generated = generateJLPTChapters(activeLevel, words);
        if (generated.length === 0) {
          throw new Error("No chapters generated from data.");
        }
        setChapters(generated);
      } catch (err: unknown) {
          console.error("JLPT fetch error:", err);
          setError(err instanceof Error ? err.message : "Failed to load JLPT syllabus.");
        setChapters([]);
      } finally {
        setIsLoading(false);
        setShowLevelDropdown(false);
      }
    }
    loadData();
  }, [activeLevel, curriculum]);

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 flex-shrink-0 relative z-20">
        <div className="flex items-center gap-3 w-max flex-1">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex bg-gray-100 p-1 rounded-full w-full max-w-[240px]">
            <button
              onClick={() => setCurriculum('jlpt')}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
                curriculum === 'jlpt' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              JLPT Vocab
            </button>
            <button
              onClick={() => setCurriculum('genki')}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
                curriculum === 'genki' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Textbook
            </button>
          </div>
        </div>

        <div className="relative ml-2 flex-shrink-0">
          <button
            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 bg-white"
          >
            N{activeLevel}
            <ChevronDown className={cn("w-4 h-4 transition-transform", showLevelDropdown && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showLevelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden py-1 w-24"
              >
                {[5, 4, 3, 2, 1].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-50",
                      activeLevel === lvl ? "text-bamboo-500 bg-bamboo-50" : "text-gray-700"
                    )}
                  >
                    N{lvl}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        {curriculum === 'jlpt' ? (
          <p className="text-sm text-gray-500 mb-4 px-1">Learn {chapters.length * 20} vocabulary words across {chapters.length} chapters</p>
        ) : (
          <p className="text-sm text-gray-500 mb-4 px-1">Genki Textbook (Lessons {(5 - activeLevel) * 12 + 1} - {(5 - activeLevel) * 12 + 12})</p>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-bamboo-300" />
            <p>Loading {curriculum === 'jlpt' ? `N${activeLevel} syllabus` : 'Textbook'}...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-red-500">
            <p className="font-bold mb-2">Error Loading JLPT Data</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs text-gray-400 mt-4">Make sure you ran the fetch-jlpt.mjs script.</p>
          </div>
        ) : curriculum === 'jlpt' ? (
          <div className="space-y-4">
            {chapters.map((lesson, index) => (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap max delay
                onClick={() => handleLessonClick(lesson)}
                className={cn(
                  'w-full text-left p-4 bg-white rounded-2xl shadow-sm border border-transparent',
                  'transition-all duration-200',
                  'hover:shadow-md hover:border-gray-100 active:scale-[0.98]',
                  selectedId === lesson.id && 'ring-2 ring-bamboo-400 shadow-md border-transparent'
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1">{lesson.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="px-2 py-1 bg-bamboo-100 text-bamboo-700 text-xs font-bold rounded-lg border border-bamboo-200">
                      {lesson.unit}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                      {lesson.level}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-bamboo-500 text-sm font-medium">
                  <span className="text-gray-400 text-xs font-normal">20 Items • {lesson.exercises?.length} Exercises</span>
                  <span className="flex items-center gap-1">Start Chapter <ChevronLeft className="w-4 h-4 rotate-180" /></span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {n5Lessons.map((lesson, index) => {
              const isCompleted = state.progress.completedLessons.includes(lesson.lessonNumber);
              const mainRule = lesson.grammar?.[0]?.rule || 'Coming Soon';

              return (
                <motion.button
                  key={lesson.lessonNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap max delay
                  onClick={() => {
                    if (onStartN5Lesson) {
                      // Add small delay for button effect
                      setSelectedId(`n5-${lesson.lessonNumber}`);
                      setTimeout(() => onStartN5Lesson(lesson), 200);
                    }
                  }}
                  className={cn(
                    'w-full text-left p-4 bg-white rounded-2xl shadow border border-gray-100',
                    'transition-all duration-200',
                    'hover:shadow-md hover:border-gray-200 active:scale-[0.98]',
                    selectedId === `n5-${lesson.lessonNumber}` && 'ring-2 ring-bamboo-400 shadow-md border-transparent',
                    isCompleted ? 'bg-green-50/30' : ''
                  )}
                >
                  <div className="flex flex-col gap-2 relative">
                    {/* Absolute Positioned Checkmark if completed */}
                    {isCompleted && (
                      <div className="absolute top-1 right-0 text-green-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}

                    {/* Header */}
                    <div className="text-xs font-bold text-bamboo-500 uppercase tracking-widest mt-1">
                      Lesson {lesson.lessonNumber}
                    </div>

                    {/* Grammar Topic / Title */}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg pr-8 leading-tight">
                        {lesson.title || 'General Topics'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1.5 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        {mainRule}
                      </p>
                    </div>

                    {/* Progress Bar Area */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={cn("font-semibold", isCompleted ? "text-green-600" : "text-gray-500")}>
                          {isCompleted ? 'Completed' : 'Not Started'}
                        </span>
                        <span className="text-gray-400">{isCompleted ? '100%' : '0%'}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isCompleted ? '100%' : '0%' }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className={cn("h-full rounded-full", isCompleted ? "bg-green-500" : "bg-bamboo-500")}
                        />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
