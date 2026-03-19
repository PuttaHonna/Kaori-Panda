import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getDateString } from '@/lib/utils';
import type { Word } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewPageProps {
    onBack: () => void;
}

const SRS_INTERVALS = [1, 3, 7, 14, 30, 60];

function getLevelLabel(level: number): string {
    const labels = ['New', 'Learning', 'Familiar', 'Confident', 'Advanced', 'Mastered'];
    return labels[Math.min(level, labels.length - 1)];
}

function getLevelColor(level: number): string {
    const colors = [
        'bg-gray-100 text-gray-600',
        'bg-blue-100 text-blue-700',
        'bg-amber-100 text-amber-700',
        'bg-emerald-100 text-emerald-700',
        'bg-purple-100 text-purple-700',
        'bg-rose-100 text-rose-700',
    ];
    return colors[Math.min(level, colors.length - 1)];
}

export function ReviewPage({ onBack }: ReviewPageProps) {
    const { state, dispatch } = useApp();
    const today = getDateString(new Date());

    // Get words due for review (nextReviewDate <= today)
    const dueWords: Word[] = state.words.filter(
        w => !w.nextReviewDate || w.nextReviewDate <= today
    );

    const [queue, setQueue] = useState<Word[]>(() => [...dueWords]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [results, setResults] = useState<{ correct: number; wrong: number }>({ correct: 0, wrong: 0 });
    const [done, setDone] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const currentWord = queue[currentIndex];
    const progress = currentIndex / Math.max(queue.length, 1);

    const handleAnswer = useCallback((correct: boolean) => {
        if (!currentWord) return;

        dispatch({ type: 'REVIEW_WORD', payload: { wordId: currentWord.id, correct } });
        setResults(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
        }));

        setDirection(correct ? 'right' : 'left');

        const next = currentIndex + 1;
        if (next >= queue.length) {
            setDone(true);
        } else {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(next), 100);
        }
    }, [currentWord, currentIndex, queue.length, dispatch]);

    const handleRestart = () => {
        setQueue([...dueWords]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setResults({ correct: 0, wrong: 0 });
        setDone(false);
    };

    // Empty state
    if (queue.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
            >
                <header className="flex items-center px-4 h-14 bg-white border-b border-gray-100">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="ml-2 text-lg font-semibold text-gray-900">Review Session</h1>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
                    <span className="text-6xl">🎉</span>
                    <h2 className="text-2xl font-bold text-gray-900">All caught up!</h2>
                    <p className="text-gray-500">
                        No words are due for review today. Come back tomorrow or add more words to your Word Bank.
                    </p>
                </div>
            </motion.div>
        );
    }

    // Completion screen
    if (done) {
        const accuracy = Math.round((results.correct / queue.length) * 100);
        return (
            <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
            >
                <header className="flex items-center px-4 h-14 bg-white border-b border-gray-100">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="ml-2 text-lg font-semibold text-gray-900">Session Complete</h1>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                    >
                        <Trophy className="w-20 h-20 text-yellow-400" />
                    </motion.div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">{accuracy}%</h2>
                        <p className="text-gray-500">accuracy</p>
                    </div>

                    <div className="w-full max-w-xs grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                            <p className="text-2xl font-bold text-emerald-600">{results.correct}</p>
                            <p className="text-sm text-emerald-700">Correct</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-2xl text-center">
                            <p className="text-2xl font-bold text-red-500">{results.wrong}</p>
                            <p className="text-sm text-red-600">Missed</p>
                        </div>
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                        <button
                            onClick={handleRestart}
                            className="w-full py-3 rounded-full border-2 border-bamboo-400 text-bamboo-600 font-semibold flex items-center justify-center gap-2 hover:bg-bamboo-50 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Review Again
                        </button>
                        <button
                            onClick={onBack}
                            className="w-full py-3 rounded-full bg-bamboo-400 text-white font-semibold hover:bg-bamboo-500 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
            {/* Header */}
            <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Review Session</h1>
                </div>
                <span className="text-sm text-gray-500">
                    {currentIndex + 1} / {queue.length}
                </span>
            </header>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100 flex-shrink-0">
                <motion.div
                    className="h-full bg-bamboo-400 rounded-full"
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-6 py-3 bg-white border-b border-gray-50 flex-shrink-0">
                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {results.correct}
                </span>
                <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    {results.wrong}
                </span>
            </div>

            {/* Card area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
                {/* Instruction */}
                <p className="text-sm text-gray-400">
                    {isFlipped ? 'Did you get it right?' : 'Tap the card to reveal'}
                </p>

                {/* Flashcard */}
                <AnimatePresence mode="wait">
                    <motion.button
                        key={`${currentWord.id}-${isFlipped ? 'back' : 'front'}`}
                        initial={{ opacity: 0, y: direction === 'right' ? 30 : -30, rotateY: isFlipped ? 180 : 0 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        exit={{ opacity: 0, y: direction === 'right' ? -30 : 30 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => !isFlipped && setIsFlipped(true)}
                        className={cn(
                            'w-full max-w-sm min-h-48 rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4 p-8 text-center',
                            isFlipped ? 'bg-bamboo-50 cursor-default' : 'bg-white cursor-pointer hover:shadow-xl active:scale-[0.98]',
                            'transition-all duration-200'
                        )}
                    >
                        {!isFlipped ? (
                            <>
                                <p className="jp-text text-4xl font-bold text-gray-900">{currentWord.japanese}</p>
                                <span className={cn('text-xs px-3 py-1 rounded-full font-medium', getLevelColor(currentWord.level ?? 0))}>
                                    {getLevelLabel(currentWord.level ?? 0)}
                                </span>
                            </>
                        ) : (
                            <>
                                <p className="jp-text text-2xl font-bold text-gray-900">{currentWord.japanese}</p>
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-base">{currentWord.romaji}</p>
                                    <p className="text-gray-900 font-semibold text-lg">{currentWord.english}</p>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Level {currentWord.level ?? 0} → {(currentWord.level ?? 0) < 5 ? `review in ${SRS_INTERVALS[(currentWord.level ?? 0) + 1] ?? 60}d if correct` : 'Mastered!'}
                                </div>
                            </>
                        )}
                    </motion.button>
                </AnimatePresence>

                {/* Answer buttons — only after flip */}
                <AnimatePresence>
                    {isFlipped && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-sm grid grid-cols-2 gap-4"
                        >
                            <button
                                onClick={() => handleAnswer(false)}
                                className="py-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors active:scale-95"
                            >
                                <XCircle className="w-5 h-5" />
                                Missed
                            </button>
                            <button
                                onClick={() => handleAnswer(true)}
                                className="py-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors active:scale-95"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Got it!
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
