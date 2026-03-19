import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useWanakana } from '@/hooks/useWanakana';
import { cn } from '@/lib/utils';
import type { Lesson, Exercise } from '@/types';

interface QuizPageProps {
    lesson: Lesson;
    onBack: () => void;
    onComplete: () => void;
}

export function QuizPage({ lesson, onBack, onComplete }: QuizPageProps) {
    const { dispatch } = useApp();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [scoreAcc, setScoreAcc] = useState(0);

    const inputRef = useWanakana<HTMLInputElement>();

    const exercises = lesson.exercises || [];
    const exercise = exercises[currentIdx] as Exercise | undefined;

    const isFinished = currentIdx >= exercises.length;

    if (!exercise && !isFinished) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
                <h2 className="text-xl font-bold mb-4">No exercises found for this lesson.</h2>
                <button onClick={onBack} className="text-bamboo-500 font-medium">Go Back</button>
            </div>
        );
    }

    const handleCheck = () => {
        if (isRevealed) return;

        let answer = '';
        if (exercise?.type === 'multiple_choice') answer = selectedOption || '';
        else if (exercise?.type === 'fill_blank' || exercise?.type === 'conjugation') answer = inputText.trim();

        // For reading type, they just tap "Got it"
        const correct = exercise?.type === 'reading' ? true : answer === exercise?.correctAnswer;
        setIsCorrect(correct);
        setIsRevealed(true);

        if (correct) {
            setScoreAcc(s => s + 10);
        }
    };

    const handleNext = () => {
        setIsRevealed(false);
        setSelectedOption(null);
        setInputText('');
        setCurrentIdx(i => i + 1);
    };

    const handleFinish = () => {
        // Award 50 points per completed lesson, plus 10 per correct answer
        dispatch({ type: 'UPDATE_STATS', payload: { lessonsCompleted: (useApp().state.stats.lessonsCompleted || 0) + 1 } });
        onComplete();
    };

    const progressPct = isFinished ? 100 : ((currentIdx) / exercises.length) * 100;

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center"
            >
                <div className="w-24 h-24 bg-bamboo-100 text-bamboo-500 rounded-full flex items-center justify-center mb-6 shadow-sm mx-auto">
                    <Trophy className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Complete!</h1>
                <p className="text-gray-500 mb-8">You scored {scoreAcc} points.</p>
                <button
                    onClick={handleFinish}
                    className="w-full max-w-sm bg-bamboo-500 text-white rounded-2xl py-4 font-bold text-lg hover:bg-bamboo-600 transition-colors shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
                >
                    Continue
                </button>
            </motion.div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col font-sans">
            {/* Header */}
            <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden content-center">
                        <motion.div
                            className="h-full bg-bamboo-500 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">{exercise?.question}</h2>

                        {exercise?.type === 'reading' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                                <p className="text-4xl jp-text text-gray-900 mb-4">{exercise.correctAnswer}</p>
                                {exercise.englishTranslation && (
                                    <p className="text-gray-500 text-lg">{exercise.englishTranslation}</p>
                                )}
                            </div>
                        )}

                        {exercise?.type === 'multiple_choice' && (
                            <div className="space-y-3">
                                {exercise.options?.map(opt => {
                                    const isSelected = selectedOption === opt;
                                    const showAsCorrect = isRevealed && opt === exercise.correctAnswer;
                                    const showAsWrong = isRevealed && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={opt}
                                            disabled={isRevealed}
                                            onClick={() => setSelectedOption(opt)}
                                            className={cn(
                                                'w-full p-4 rounded-xl border-2 text-left transition-all jp-text text-lg',
                                                !isRevealed && !isSelected && 'border-gray-100 bg-white text-gray-700 hover:border-bamboo-200',
                                                !isRevealed && isSelected && 'border-bamboo-500 bg-bamboo-50 text-bamboo-700 font-medium',
                                                showAsCorrect && 'border-green-500 bg-green-50 text-green-700 font-bold',
                                                showAsWrong && 'border-red-500 bg-red-50 text-red-700',
                                                isRevealed && !showAsCorrect && !showAsWrong && 'border-gray-100 bg-gray-50 opacity-50'
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {(exercise?.type === 'fill_blank' || exercise?.type === 'conjugation') && (
                            <div className="space-y-4">
                                {exercise.type === 'conjugation' && (
                                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-center gap-3 mb-2">
                                        <div className="text-2xl jp-text font-bold bg-white px-3 py-1 rounded-lg shadow-sm">
                                            {exercise.question.split(' ')[0]} {/* Simple extraction of the verb */}
                                        </div>
                                        <div className="text-sm font-medium">
                                            Type the <strong>Potential Form</strong> (Can do)
                                        </div>
                                    </div>
                                )}
                                <input
                                    ref={inputRef}
                                    disabled={isRevealed}
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="Type in Japanese..."
                                    className={cn(
                                        'w-full border-2 rounded-xl p-4 text-xl jp-text outline-none transition-colors',
                                        !isRevealed && 'border-gray-200 focus:border-bamboo-500 bg-white text-gray-900',
                                        isRevealed && isCorrect && 'border-green-500 bg-green-50 text-green-700 font-medium',
                                        isRevealed && !isCorrect && 'border-red-500 bg-red-50 text-red-700'
                                    )}
                                    autoFocus
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer / Check Button */}
            <div className={cn(
                "bg-white border-t p-4 transition-colors",
                isRevealed && isCorrect && "bg-green-50 border-green-100",
                isRevealed && !isCorrect && "bg-red-50 border-red-100"
            )}>
                {isRevealed && (
                    <div className="mb-4 px-2 flex items-start gap-3">
                        {isCorrect ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                        )}
                        <div>
                            <h3 className={cn("font-bold text-lg mb-1", isCorrect ? "text-green-700" : "text-red-700")}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h3>
                            <p className={cn("text-base", isCorrect ? "text-green-600" : "text-red-600")}>
                                {!isCorrect && <span className="block mb-1">Answer: <strong>{exercise?.correctAnswer}</strong></span>}
                                {exercise?.englishTranslation}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={isRevealed ? handleNext : handleCheck}
                    disabled={!isRevealed && exercise?.type === 'multiple_choice' && !selectedOption}
                    className={cn(
                        "w-full rounded-2xl py-4 font-bold text-lg text-white transition-all",
                        !isRevealed && exercise?.type === 'multiple_choice' && !selectedOption ? "bg-gray-200 text-gray-400" :
                            !isRevealed ? "bg-bamboo-500 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:bg-bamboo-600" :
                                isCorrect ? "bg-green-500 hover:bg-green-600" :
                                    "bg-red-500 hover:bg-red-600"
                    )}
                >
                    {isRevealed ? 'Continue' : 'Check'}
                </button>
            </div>
        </div>
    );
}
