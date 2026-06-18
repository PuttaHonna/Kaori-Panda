import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { geminiPrompt, hasGeminiKey } from '@/lib/gemini';
import { useWanakana } from '@/hooks/useWanakana';

interface CorrectionResult {
  corrected: string;
  errors: { original: string; fix: string; reason: string }[];
  tip: string;
  score: number; // 1-10
}

async function checkSentence(text: string): Promise<CorrectionResult> {
  const prompt = `You are a Japanese language teacher. A student wrote: "${text}"

Analyze this Japanese sentence and respond ONLY with valid JSON in this exact format:
{
  "corrected": "the fully corrected Japanese sentence",
  "errors": [
    { "original": "wrong part", "fix": "correct part", "reason": "brief English explanation" }
  ],
  "tip": "one practical grammar tip in English",
  "score": 8
}

If the sentence is perfect, return an empty errors array and score 10.
Return ONLY the JSON, no other text.`;

  const raw = await geminiPrompt(prompt);
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as CorrectionResult;
}

export function SenseiCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useWanakana<HTMLTextAreaElement>();

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await checkSentence(text.trim());
      setResult(res);
    } catch {
      setError('Could not analyze the sentence. Check your API key or try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 9 ? 'text-emerald-600' : s >= 6 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = (s: number) =>
    s >= 9 ? 'bg-emerald-50 border-emerald-200' : s >= 6 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Sensei Check ✍️</h2>
          <p className="text-xs text-slate-500">Type a Japanese sentence — AI corrects & explains</p>
        </div>
      </div>

      {!hasGeminiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Add your Gemini API key in Settings to use this feature.
        </div>
      )}

      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="日本語を入力してください…  (e.g. わたしは食べるりんご)"
          rows={3}
          className="w-full p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none jp-text text-base"
        />
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50">
          <span className="text-xs text-slate-400">{text.length} characters</span>
          <Button
            onClick={handleCheck}
            disabled={!text.trim() || loading || !hasGeminiKey}
            size="sm"
            className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check ✨'}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Score + Corrected sentence */}
            <div className={`rounded-2xl border p-4 ${scoreBg(result.score)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700 text-sm">Corrected Sentence</span>
                <span className={`text-2xl font-black ${scoreColor(result.score)}`}>{result.score}/10</span>
              </div>
              <p className="jp-text text-xl font-bold text-slate-900">{result.corrected}</p>
              {result.score === 10 && (
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Perfect sentence! 🎉
                </div>
              )}
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Errors Found ({result.errors.length})
                </div>
                {result.errors.map((e, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="jp-text text-red-500 font-bold line-through text-sm">{e.original}</span>
                      <span className="text-slate-400">→</span>
                      <span className="jp-text text-emerald-600 font-bold text-sm">{e.fix}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{e.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tip */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">💡 Grammar Tip</p>
              <p className="text-slate-700 text-sm">{result.tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
