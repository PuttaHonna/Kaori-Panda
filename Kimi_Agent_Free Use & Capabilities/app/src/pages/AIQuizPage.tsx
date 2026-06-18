import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIQuiz, type AIQuizQuestion } from '@/hooks/useAIQuiz';
import { hasGeminiKey } from '@/lib/gemini';

interface AIQuizPageProps {
  onBack: () => void;
}

export function AIQuizPage({ onBack }: AIQuizPageProps) {
  const { questions, loading, error, generate } = useAIQuiz();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q: AIQuizQuestion | undefined = questions[current];

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleRestart = async () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    await generate();
  };

  const optClass = (opt: string) => {
    if (!selected) return 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50';
    if (opt === q.answer) return 'bg-emerald-50 border-emerald-400 text-emerald-800';
    if (opt === selected) return 'bg-red-50 border-red-400 text-red-800';
    return 'bg-white border-slate-100 text-slate-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-slate-800">AI Quiz 🧠</h1>
        {questions.length > 0 && !done && (
          <span className="text-sm text-slate-400 font-medium">{current + 1}/{questions.length}</span>
        )}
        {(!questions.length || done) && <div className="w-9" />}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {/* Start screen */}
        {!loading && !error && questions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-indigo-500" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Personalized AI Quiz</h2>
              <p className="text-slate-500 text-sm max-w-xs">
                Gemini generates 5 questions targeting your weakest vocabulary. Harder on the words you struggle with!
              </p>
            </div>
            {!hasGeminiKey && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-700 text-center max-w-xs">
                Add your Gemini API key in Settings to use AI Quiz.
              </div>
            )}
            <Button onClick={generate} disabled={!hasGeminiKey} className="w-48 h-12 text-base rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-bold">
              Start Quiz ✨
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <p className="text-slate-500 font-medium">Generating questions for you…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm text-center mt-8">
            {error}
            <Button onClick={generate} size="sm" className="block mx-auto mt-3 rounded-xl">Try again</Button>
          </div>
        )}

        {/* Done screen */}
        {done && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-indigo-100 flex items-center justify-center">
              <span className="text-4xl">{score === questions.length ? '🎉' : score >= 3 ? '👍' : '📚'}</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-1">Quiz Complete!</h2>
              <p className="text-5xl font-black text-indigo-500 mt-2">{score}<span className="text-2xl text-slate-400">/{questions.length}</span></p>
              <p className="text-slate-500 mt-2">
                {score === questions.length ? 'Perfect score! 🌟' : score >= 3 ? 'Great job! Keep going.' : 'Keep practicing — you\'ll get there!'}
              </p>
            </div>
            <Button onClick={handleRestart} className="w-48 h-12 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-bold gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        )}

        {/* Question */}
        {q && !done && !loading && (
          <div className="w-full max-w-md space-y-4">
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all"
                style={{ width: `${((current) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <p className="text-slate-900 font-bold text-lg leading-snug">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${optClass(opt)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="jp-text">{opt}</span>
                    {selected && opt === q.answer && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />}
                    {selected && opt === selected && opt !== q.answer && <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation + Next */}
            <AnimatePresence>
              {selected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-slate-700">
                    <span className="font-bold text-indigo-600">📝 </span>{q.explanation}
                  </div>
                  <Button onClick={handleNext} className="w-full h-12 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-bold">
                    {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
