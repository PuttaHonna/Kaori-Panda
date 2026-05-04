import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Swords, Trophy, RotateCcw, Zap, Flame, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Local1v1Hub } from '@/components/compete/Local1v1Hub';
import { JLPT_DATA } from '@/data/jlptVocab';
import { getElevenLabsAudio, hasElevenLabsKey } from '@/lib/elevenlabs';

interface DojoPageProps {
    onBack: () => void;
}

// Mock Vocabulary List
const DOJO_WORDS = [
    { word: '食べる', reading: 'たべる', meaning: 'To eat' },
    { word: '飲む', reading: 'のむ', meaning: 'To drink' },
    { word: '見る', reading: 'みる', meaning: 'To see' },
    { word: '行く', reading: 'いく', meaning: 'To go' },
    { word: '来る', reading: 'くる', meaning: 'To come' },
    { word: '寝る', reading: 'ねる', meaning: 'To sleep' },
    { word: '起きる', reading: 'おきる', meaning: 'To wake up' },
    { word: '話す', reading: 'はなす', meaning: 'To speak' },
    { word: '聞く', reading: 'きく', meaning: 'To listen' },
    { word: '書く', reading: 'かく', meaning: 'To write' },
    { word: '読む', reading: 'よむ', meaning: 'To read' },
    { word: '買う', reading: 'かう', meaning: 'To buy' },
    { word: '待つ', reading: 'まつ', meaning: 'To wait' },
    { word: '持つ', reading: 'もつ', meaning: 'To hold' },
    { word: '泳ぐ', reading: 'およぐ', meaning: 'To swim' },
];

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateRound(wordsToUse: any[]) {
    const wordList = shuffleArray(wordsToUse);
    const target = wordList[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const distractors = wordList.slice(1, 4).map((w: any) => w.meaning || w.english);
    const options = shuffleArray([target.meaning || target.english, ...distractors]);
    return { target, options };
}

// === MAIN ENTRY COMPONENT ===
export function DojoPage({ onBack }: DojoPageProps) {
    const { state } = useApp();
    const [selectedMode, setSelectedMode] = useState<'menu' | 'local1v1' | 'soloSurvival'>('menu');

    const jlptWords = DOJO_WORDS;

    const learnedWords = state.words.filter(w => w.learned);
    const gameWords = learnedWords.length >= 4 ? learnedWords : jlptWords;

    if (selectedMode === 'local1v1') {
        return <Local1v1Hub onBack={() => setSelectedMode('menu')} wordBank={gameWords} />;
    }

    if (selectedMode === 'soloSurvival') {
        return <SoloSurvivalMode onBack={() => setSelectedMode('menu')} wordBank={gameWords} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-50"
        >
            <div className="flex items-center p-4 bg-white border-b sticky top-0 z-10">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="flex-1 text-center font-bold text-lg text-slate-800 tracking-tight">Multiplayer Dojo</h1>
                <div className="w-9" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-2 mb-4">
                    <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-red-100 text-red-500 mb-6 shadow-sm border border-red-200">
                        <Swords className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Game Mode</h2>
                    <p className="text-slate-500 font-medium">Test your vocabulary speed against a friend or the clock.</p>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <button
                        onClick={() => setSelectedMode('local1v1')}
                        className="w-full p-6 bg-white rounded-3xl shadow-sm border-2 border-slate-200 hover:border-red-400 hover:shadow-md transition-all group text-left relative overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-50 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <Swords className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Local 1v1 Duel</h3>
                                <p className="text-slate-500 text-sm font-medium leading-snug">Choose from 4 mini-games and battle a friend side-by-side.</p>
                            </div>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            <ArrowLeft className="w-5 h-5 text-slate-300 rotate-180" />
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedMode('soloSurvival')}
                        className="w-full p-6 bg-white rounded-3xl shadow-sm border-2 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-left relative overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Endless Survival</h3>
                                <p className="text-slate-500 text-sm font-medium leading-snug">Race against the clock alone. Correct answers add time!</p>
                            </div>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            <ArrowLeft className="w-5 h-5 text-slate-300 rotate-180" />
                        </div>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}


// === SOLO SURVIVAL MODE ===
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SoloSurvivalMode({ onBack, wordBank }: { onBack: () => void, wordBank: any[] }) {
    const { state } = useApp();
    const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [wrongOpt, setWrongOpt] = useState<string | null>(null);

    // High score persists for the session
    const [highScore, setHighScore] = useState(0);

    // JLPT Selection State
    const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
    const [selectedChapterIdx, setSelectedChapterIdx] = useState(0);

    const activeLevel = JLPT_DATA[selectedLevelIdx] || JLPT_DATA[0];
    const activeChapter = activeLevel.chapters[selectedChapterIdx] || activeLevel.chapters[0];
    const targetWordBank = (activeChapter && activeChapter.words.length >= 4)
        ? activeChapter.words
        : wordBank; // Fallback if chapter doesn't have enough words

    const [roundData, setRoundData] = useState(() => generateRound(targetWordBank));

    const playAudio = useCallback(async (text: string) => {
        if (hasElevenLabsKey) {
            try {
                // Use the user's selected premium voice
                const blob = await getElevenLabsAudio(text, state.settings.elevenLabsVoiceId);
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
                return;
            } catch (error) {
                console.error("ElevenLabs TTS failed, falling back to browser TTS", error);
            }
        }

        if (!('speechSynthesis' in window)) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, [state.settings.elevenLabsVoiceId]);

    useEffect(() => {
        if (gameState === 'playing' && roundData?.target?.word) {
            playAudio(roundData.target.word);
        }
    }, [gameState, roundData?.target?.word, playAudio]);

    useEffect(() => {
        if (gameState === 'playing') {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setGameState('gameover');
                    if (score > highScore) setHighScore(score);
                }, 0);
                return () => clearTimeout(timer);
            }
        }
    }, [gameState, timeLeft, score, highScore]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLevelIdx(Number(e.target.value));
        setSelectedChapterIdx(0);
    };

    const handleStart = () => {
        setScore(0);
        setTimeLeft(30);
        setRoundData(generateRound(targetWordBank));
        setGameState('playing');
    };

    const handleAnswer = useCallback((answer: string) => {
        if (gameState !== 'playing') return;

        // Use 'targetWordBank' for next round generation
        if (answer === (roundData.target.meaning || roundData.target.english)) {
            setScore(s => s + 1);
            setTimeLeft(t => t + 2);
            setRoundData(generateRound(targetWordBank));
            setWrongOpt(null);
        } else {
            setTimeLeft(t => Math.max(0, t - 3));
            setWrongOpt(answer);
            setTimeout(() => setWrongOpt(null), 500);
        }
    }, [gameState, roundData, targetWordBank]);

    if (gameState === 'lobby') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col bg-white">
                <div className="flex items-center p-4 border-b">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-lg text-slate-800 tracking-tight">Endless Survival</h1>
                    <div className="w-9" />
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6 max-w-sm mx-auto w-full">
                    <div className="text-center space-y-4 mb-2">
                        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-blue-100 text-blue-500 mb-6 border border-blue-200">
                            <Flame className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Beat the Clock</h2>
                        <p className="text-slate-500 font-medium text-sm">Start with 30 seconds. Correct answers add +2s. Wrong answers deduct -3s.</p>
                    </div>

                    {/* Level Selector UI */}
                    <div className="w-full space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Vocabulary Track</label>
                            <select 
                                value={selectedLevelIdx}
                                onChange={handleLevelChange}
                                className="w-full p-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {JLPT_DATA.map((lvl, i) => (
                                    <option key={lvl.level} value={i}>{lvl.level}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Syllabus / Chapter</label>
                            <select 
                                value={selectedChapterIdx}
                                onChange={e => setSelectedChapterIdx(Number(e.target.value))}
                                className="w-full p-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {activeLevel.chapters.map((ch, i) => (
                                    <option key={i} value={i}>{ch.title} ({ch.words.length} words)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {highScore > 0 && (
                        <div className="bg-slate-100 px-6 py-3 rounded-full flex items-center gap-2 font-bold text-slate-700">
                            <Trophy className="w-5 h-5 text-yellow-500" /> Personal Best: {highScore}
                        </div>
                    )}
                    <Button onClick={handleStart} className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-sm font-bold">
                        Start Survival
                    </Button>
                </div>
            </motion.div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col pt-24 items-center bg-slate-900 text-white px-4">
                <Flame className="w-24 h-24 mb-6 text-red-500 opacity-50" />
                <h2 className="text-3xl font-black mb-2 tracking-tight">Time's Up!</h2>
                <div className="text-6xl font-black text-blue-400 mb-8">{score}</div>
                <div className="text-slate-400 font-medium mb-12">Total correctly translated words</div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Button onClick={handleStart} className="h-14 text-lg bg-blue-500 hover:bg-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <RotateCcw className="w-5 h-5" /> Play Again
                    </Button>
                    <Button onClick={onBack} variant="outline" className="h-14 text-lg border-slate-700 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold">
                        Exit
                    </Button>
                </div>
            </motion.div>
        );
    }

    // PLAYING STATE (Solo)
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white">
            <div className="flex items-center justify-between p-6">
                <div className="text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" /> Score: <span className="text-white text-xl">{score}</span>
                </div>
                <div className={`text-4xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-4">
                <div className="text-center mb-12">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={roundData.target.word}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-4 mb-4"
                        >
                            <div className="text-6xl font-black text-white tracking-tight">
                                {roundData.target.word}
                            </div>
                            <button 
                                onClick={() => playAudio(roundData.target.word)}
                                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors active:scale-95 text-blue-400 shrink-0"
                            >
                                <Volume2 className="w-8 h-8" />
                            </button>
                        </motion.div>
                    </AnimatePresence>
                    <div className="text-xl text-slate-500 font-medium">{roundData.target.reading}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
                    {roundData.options.map((opt, i) => (
                        <Button
                            key={i}
                            onClick={() => handleAnswer(opt)}
                            className={`h-24 text-lg font-bold rounded-3xl border-2 transition-all shadow-sm
                  ${wrongOpt === opt ? 'bg-red-950 border-red-800 text-red-500 scale-95' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 active:scale-95 text-slate-200'}`}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
