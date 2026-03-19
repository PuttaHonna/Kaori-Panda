import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { convertToTeForm } from '@/lib/verbs';
import { cn } from '@/lib/utils';
import { FuriganaText } from '../shared/FuriganaText';

interface VerbData {
    dictionary: string;
    kanji: string;
    group: 1 | 2 | 3;
    meaning: string;
}

// Typical verbs learned in Lessons 14-16 for testing Te-form
const CHALLENGE_VERBS: VerbData[] = [
    { dictionary: 'いく', kanji: '行く', group: 1, meaning: 'to go' },
    { dictionary: 'たべる', kanji: '食べる', group: 2, meaning: 'to eat' },
    { dictionary: 'する', kanji: 'する', group: 3, meaning: 'to do' },
    { dictionary: 'のむ', kanji: '飲む', group: 1, meaning: 'to drink' },
    { dictionary: 'くる', kanji: '来る', group: 3, meaning: 'to come' },
    { dictionary: 'あそぶ', kanji: '遊ぶ', group: 1, meaning: 'to play' },
    { dictionary: 'まつ', kanji: '待つ', group: 1, meaning: 'to wait' },
    { dictionary: 'かえる', kanji: '帰る', group: 1, meaning: 'to return home' },
    { dictionary: 'みる', kanji: '見る', group: 2, meaning: 'to see/watch' },
    { dictionary: 'はなす', kanji: '話す', group: 1, meaning: 'to speak' },
];

export function TeFormChallenge() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);

    const currentVerb = CHALLENGE_VERBS[currentIndex];
    const targetTeForm = convertToTeForm(currentVerb.dictionary, currentVerb.group);

    // Also allow kanji based te form if we can compute it reliably, but for typing practice kana is usually expected.
    // For this challenge, we'll validate strictly against the hiragana output of convertToTeForm since we pass the dictionary kana.

    const handleCheck = () => {
        if (!input.trim() || isChecked) return;

        const correct = input.trim() === targetTeForm;
        setIsCorrect(correct);
        setIsChecked(true);
        if (correct) setScore(s => s + 1);
    };

    const handleNext = () => {
        setIsChecked(false);
        setInput('');

        if (currentIndex < CHALLENGE_VERBS.length - 1) {
            setCurrentIndex(i => i + 1);
        } else {
            // Loop back or show completion
            setCurrentIndex(0);
            setScore(0);
        }
    };

    const isComplete = isChecked && currentIndex === CHALLENGE_VERBS.length - 1;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Te-Form Challenge</h2>
                <div className="bg-bamboo-50 text-bamboo-600 px-3 py-1 rounded-full text-sm font-bold">
                    {score} / {CHALLENGE_VERBS.length}
                </div>
            </div>

            <div className="relative h-48 mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4"
                    >
                        <div className="text-sm text-bamboo-500 font-bold tracking-widest uppercase">
                            Group {currentVerb.group} Verb
                        </div>
                        <div className="text-5xl font-bold text-gray-900 jp-text">
                            <FuriganaText text={`${currentVerb.dictionary}[${currentVerb.kanji}]`} />
                        </div>
                        <div className="text-gray-500 text-lg">
                            {currentVerb.meaning}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isChecked}
                    placeholder="Type te-form in hiragana (e.g., いっte -> いって)"
                    className={cn(
                        "w-full px-4 py-4 rounded-2xl border-2 text-center text-xl jp-text outline-none transition-all",
                        !isChecked && "border-gray-200 focus:border-bamboo-400 bg-gray-50",
                        isChecked && isCorrect && "border-green-500 bg-green-50 text-green-700",
                        isChecked && !isCorrect && "border-red-500 bg-red-50 text-red-700"
                    )}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheck();
                    }}
                />

                <AnimatePresence>
                    {isChecked && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="overflow-hidden"
                        >
                            <div className={cn(
                                "flex items-center gap-2 justify-center p-3 rounded-xl mb-4 font-bold text-lg",
                                isCorrect ? "text-green-600" : "text-red-600"
                            )}>
                                {isCorrect ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Correct!</>
                                ) : (
                                    <><XCircle className="w-5 h-5" /> Answer: {targetTeForm}</>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={isChecked ? handleNext : handleCheck}
                    disabled={!input.trim() && !isChecked}
                    className={cn(
                        "w-full py-4 rounded-2xl font-bold text-lg text-white transition-all",
                        !input.trim() && !isChecked ? "bg-gray-200 text-gray-400" : "bg-bamboo-500 hover:bg-bamboo-600 active:scale-95 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]",
                        isComplete && isChecked ? "bg-blue-500 hover:bg-blue-600 shadow-sm" : ""
                    )}
                >
                    {isComplete && isChecked ? (
                        <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-5 h-5" /> Try Again
                        </span>
                    ) : isChecked ? 'Next Verb' : 'Check'}
                </button>
            </div>
        </div>
    );
}
