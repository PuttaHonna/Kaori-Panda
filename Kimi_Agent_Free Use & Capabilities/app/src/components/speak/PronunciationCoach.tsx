import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Loader2, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceSynthesis } from '@/hooks/useVoiceSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { geminiPrompt, hasGeminiKey } from '@/lib/gemini';

const PRACTICE_WORDS = [
  { japanese: '桜', furigana: 'さくら', english: 'cherry blossom' },
  { japanese: 'ありがとう', furigana: 'ありがとう', english: 'thank you' },
  { japanese: '食べます', furigana: 'たべます', english: 'to eat' },
  { japanese: '水をください', furigana: 'みずをください', english: 'water please' },
  { japanese: 'どこですか', furigana: 'どこですか', english: 'where is it?' },
  { japanese: '電車は何時ですか', furigana: 'でんしゃはなんじですか', english: 'what time is the train?' },
  { japanese: '日本語が好きです', furigana: 'にほんごがすきです', english: 'I like Japanese' },
  { japanese: 'おはようございます', furigana: 'おはようございます', english: 'good morning' },
];

interface ScoreResult {
  score: number;
  tip: string;
  similar: string;
}

async function scorePronunciation(target: string, heard: string): Promise<ScoreResult> {
  const prompt = `You are a Japanese pronunciation coach.
Target phrase: "${target}"
Student said (speech recognition result): "${heard}"

Score the pronunciation 1–10 and give a short tip.
Return ONLY valid JSON:
{ "score": 7, "tip": "one actionable tip in English", "similar": "how close it sounded, one phrase" }`;

  const raw = await geminiPrompt(prompt);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as ScoreResult;
}

export function PronunciationCoach() {
  const [wordIdx, setWordIdx] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'listen' | 'recording' | 'scoring' | 'done'>('idle');

  const { speak, isSpeaking } = useVoiceSynthesis();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const current = PRACTICE_WORDS[wordIdx];

  const handleListen = () => {
    speak(current.japanese);
    setPhase('listen');
  };

  const handleRecord = useCallback(() => {
    resetTranscript();
    setPhase('recording');
    startListening();
  }, [resetTranscript, startListening]);

  const handleStopAndScore = useCallback(async () => {
    stopListening();
    setPhase('scoring');
    setLoading(true);
    try {
      const heard = transcript || '(nothing detected)';
      const res = await scorePronunciation(current.japanese, heard);
      setResult(res);
      setPhase('done');
    } catch {
      setResult({ score: 0, tip: 'Could not score — check your API key.', similar: '' });
      setPhase('done');
    } finally {
      setLoading(false);
    }
  }, [stopListening, transcript, current.japanese]);

  const nextWord = () => {
    setWordIdx(i => (i + 1) % PRACTICE_WORDS.length);
    setResult(null);
    setPhase('idle');
    resetTranscript();
  };

  const scoreColor = (s: number) =>
    s >= 9 ? 'text-emerald-500' : s >= 6 ? 'text-amber-500' : 'text-red-500';

  const renderStars = (score: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.round(score / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
      />
    ));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
          <Mic className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Pronunciation Coach 🎤</h2>
          <p className="text-xs text-slate-500">Listen → Record → Get scored by AI</p>
        </div>
      </div>

      {!hasGeminiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Add Gemini API key in Settings for AI scoring.
        </div>
      )}

      {/* Word card */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 text-white text-center shadow-lg">
        <p className="text-slate-200 text-sm mb-1">{current.furigana}</p>
        <p className="jp-text text-4xl font-black mb-2">{current.japanese}</p>
        <p className="text-rose-100 text-sm">{current.english}</p>
        <p className="text-xs text-rose-200 mt-3">{wordIdx + 1} / {PRACTICE_WORDS.length}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleListen}
          variant="outline"
          className="h-12 rounded-2xl gap-2 font-bold border-slate-200"
          disabled={isSpeaking}
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-rose-500 animate-pulse' : ''}`} />
          {isSpeaking ? 'Playing…' : '1. Listen'}
        </Button>

        {phase !== 'recording' ? (
          <Button
            onClick={handleRecord}
            className="h-12 rounded-2xl gap-2 font-bold bg-rose-500 hover:bg-rose-600"
            disabled={loading}
          >
            <Mic className="w-4 h-4" /> 2. Record
          </Button>
        ) : (
          <Button
            onClick={handleStopAndScore}
            className="h-12 rounded-2xl gap-2 font-bold bg-red-600 hover:bg-red-700 animate-pulse"
          >
            <Mic className="w-4 h-4" /> Stop & Score
          </Button>
        )}
      </div>

      {isListening && (
        <div className="text-center text-sm text-rose-500 font-medium animate-pulse">
          🎙 Listening… speak now
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Scoring your pronunciation…
        </div>
      )}

      {/* Score result */}
      <AnimatePresence>
        {result && phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
              <div className="flex justify-center mb-2">{renderStars(result.score)}</div>
              <span className={`text-5xl font-black ${scoreColor(result.score)}`}>{result.score}</span>
              <span className="text-slate-400 text-xl">/10</span>
              {result.similar && (
                <p className="text-slate-500 text-sm mt-2">&ldquo;{result.similar}&rdquo;</p>
              )}
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">💡 Tip</p>
              <p className="text-slate-700 text-sm">{result.tip}</p>
            </div>

            <Button onClick={nextWord} className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold">
              Next Word →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
