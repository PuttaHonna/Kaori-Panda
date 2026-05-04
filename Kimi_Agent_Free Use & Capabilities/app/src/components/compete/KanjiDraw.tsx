import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { geminiVisionPrompt, hasGeminiKey } from '@/lib/gemini';

// ─── Kanji list for the game ───────────────────────────────────────────────
const KANJI_LIST = [
  { kanji: '日', meaning: 'Sun / Day' }, { kanji: '月', meaning: 'Moon / Month' },
  { kanji: '火', meaning: 'Fire' }, { kanji: '水', meaning: 'Water' },
  { kanji: '木', meaning: 'Tree / Wood' }, { kanji: '金', meaning: 'Gold / Money' },
  { kanji: '土', meaning: 'Earth / Soil' }, { kanji: '山', meaning: 'Mountain' },
  { kanji: '川', meaning: 'River' }, { kanji: '田', meaning: 'Rice Field' },
  { kanji: '人', meaning: 'Person' }, { kanji: '口', meaning: 'Mouth' },
  { kanji: '手', meaning: 'Hand' }, { kanji: '目', meaning: 'Eye' },
  { kanji: '耳', meaning: 'Ear' }, { kanji: '大', meaning: 'Big' },
  { kanji: '小', meaning: 'Small' }, { kanji: '上', meaning: 'Up / Above' },
  { kanji: '下', meaning: 'Down / Below' }, { kanji: '中', meaning: 'Middle / Inside' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Canvas drawing component ──────────────────────────────────────────────
interface CanvasProps {
  onDrawEnd: (dataUrl: string) => void;
  disabled?: boolean;
}

function DrawCanvas({ onDrawEnd, disabled }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || disabled) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onDrawEnd(canvasRef.current!.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={280} height={280}
        className="w-full rounded-2xl border-2 border-slate-200 touch-none bg-white cursor-crosshair shadow-inner"
        onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={end}
        style={{ aspectRatio: '1/1' }}
      />
      <button
        onClick={clear}
        className="absolute top-2 right-2 p-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
      >
        <Eraser className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
}

// ─── Gemini vision recognition ─────────────────────────────────────────────
async function recognizeKanji(dataUrl: string, target: string): Promise<{ guesses: string[]; correct: boolean; feedback: string }> {
  const prompt = `A student drew the kanji in the attached image. They were trying to draw "${target}".
Analyze the image and respond with:
1. "guesses": 3 kanji that look most like what they drew. If it is accurate, "${target}" should be the first guess.
2. "correct": true if their drawing is an acceptable handwritten version of "${target}", false otherwise.
3. "feedback": One tip on how they can improve the drawing of "${target}" or praise if it's perfect.

Return ONLY valid JSON:
{
  "guesses": ["guess1", "guess2", "guess3"],
  "correct": true/false,
  "feedback": "..."
}`;

  const raw = await geminiVisionPrompt(prompt, dataUrl);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

// ─── Solo Kanji Draw mode ──────────────────────────────────────────────────
interface KanjiDrawProps {
  onBack: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wordBank?: any[];
}

export function KanjiDraw({ onBack }: KanjiDrawProps) {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'over'>('setup');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [round, setRound] = useState(0);
  const [kanjiQueue, setKanjiQueue] = useState(() => shuffle(KANJI_LIST).slice(0, 10));
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [feedback, setFeedback] = useState<{ correct: boolean; tip: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastDrawn, setLastDrawn] = useState<string>('');
  const [canvasKey, setCanvasKey] = useState(0);

  const currentKanji = kanjiQueue[round % kanjiQueue.length];
  const totalRounds = 8;

  const handleDrawEnd = (dataUrl: string) => setLastDrawn(dataUrl);

  const handleSubmit = useCallback(async () => {
    if (!lastDrawn || loading) return;
    setLoading(true);
    try {
      // Simple self-evaluation: user confirms if they drew it correctly
      // (Full vision recognition would need Gemini multimodal which requires different API call)
      const res = await recognizeKanji(lastDrawn, currentKanji.kanji);
      setFeedback({ correct: res.correct, tip: res.feedback });
    } catch {
      setFeedback({ correct: true, tip: 'Keep practicing! Stroke order matters.' });
    } finally {
      setLoading(false);
    }
  }, [lastDrawn, loading, currentKanji]);

  const handleJudge = (correct: boolean) => {
    if (correct) {
      if (currentPlayer === 1) setScore1(s => s + 1);
      else setScore2(s => s + 1);
    }
    setFeedback(null);
    setLastDrawn('');
    setCanvasKey(k => k + 1);
    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      setPhase('over');
    } else {
      setRound(nextRound);
      setCurrentPlayer(p => p === 1 ? 2 : 1);
    }
  };

  if (phase === 'setup') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
        <div className="flex items-center p-4 bg-white border-b">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
          <h1 className="flex-1 text-center font-bold text-lg">Kanji Draw 🖌️</h1>
          <div className="w-9" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full">
          <div className="w-20 h-20 rounded-3xl bg-violet-100 flex items-center justify-center">
            <span className="text-4xl jp-text font-black text-violet-600">日</span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Kanji Draw 1v1</h2>
            <p className="text-slate-500 text-sm">Take turns drawing the shown kanji. Judge each other honestly!</p>
          </div>
          <div className="w-full space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-2">
              <label className="text-xs font-bold text-blue-500 uppercase tracking-widest">Player 1</label>
              <Input value={p1Name} onChange={e => setP1Name(e.target.value)} className="h-11 bg-slate-50 border-none" />
            </div>
            <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-2">
              <label className="text-xs font-bold text-red-500 uppercase tracking-widest">Player 2</label>
              <Input value={p2Name} onChange={e => setP2Name(e.target.value)} className="h-11 bg-slate-50 border-none" />
            </div>
          </div>
          <Button onClick={() => setPhase('playing')} className="w-full h-13 rounded-2xl bg-violet-500 hover:bg-violet-600 font-bold">
            Start Drawing!
          </Button>
        </div>
      </motion.div>
    );
  }

  if (phase === 'over') {
    const tie = score1 === score2;
    const winner = score1 > score2 ? p1Name : p2Name;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center px-6">
        <Trophy className="w-20 h-20 mb-4 text-yellow-400" />
        <h2 className="text-3xl font-black mb-2">{tie ? "It's a Tie!" : `${winner} Wins!`}</h2>
        <div className="flex gap-10 mt-6 bg-slate-800 p-8 rounded-3xl border border-slate-700">
          <div className="text-center"><div className="text-sm text-blue-400 mb-1">{p1Name}</div><div className="text-4xl font-black">{score1}</div></div>
          <div className="self-center text-slate-600 text-xl font-bold">VS</div>
          <div className="text-center"><div className="text-sm text-red-400 mb-1">{p2Name}</div><div className="text-4xl font-black">{score2}</div></div>
        </div>
        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={() => { setPhase('setup'); setScore1(0); setScore2(0); setRound(0); setCurrentPlayer(1); setKanjiQueue(shuffle(KANJI_LIST).slice(0, 10)); }} className="h-12 rounded-2xl bg-violet-500 hover:bg-violet-600 font-bold gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </Button>
          <Button onClick={onBack} variant="outline" className="h-12 rounded-2xl border-slate-700 text-slate-300 hover:bg-slate-800">Exit</Button>
        </div>
      </motion.div>
    );
  }

  const playerName = currentPlayer === 1 ? p1Name : p2Name;
  const playerColor = currentPlayer === 1 ? 'blue' : 'red';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
        <div className="flex-1 text-center">
          <span className={`font-bold text-lg ${playerColor === 'blue' ? 'text-blue-600' : 'text-red-600'}`}>{playerName}'s turn</span>
        </div>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-blue-500">{p1Name}: {score1}</span>
          <span className="text-red-500">{p2Name}: {score2}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-sm mx-auto w-full">
        {/* Round indicator */}
        <div className="text-center text-xs text-slate-400 font-medium">Round {round + 1} of {totalRounds}</div>

        {/* Kanji prompt */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white text-center">
          <p className="text-sm text-violet-200 mb-1">Draw this kanji:</p>
          <p className="jp-text text-6xl font-black drop-shadow">{currentKanji.kanji}</p>
          <p className="text-violet-200 text-sm mt-2">{currentKanji.meaning}</p>
        </div>

        {/* Canvas */}
        <DrawCanvas key={canvasKey} onDrawEnd={handleDrawEnd} disabled={!!feedback || loading} />

        {/* Gemini tip */}
        {hasGeminiKey && !feedback && (
          <Button onClick={handleSubmit} disabled={!lastDrawn || loading} className="w-full h-12 rounded-2xl bg-violet-500 hover:bg-violet-600 font-bold">
            {loading ? 'Getting tip…' : 'Get Stroke Tip ✨'}
          </Button>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {hasGeminiKey && (
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-sm text-slate-700">
                  <p className="font-bold text-violet-600 text-xs uppercase tracking-widest mb-1">💡 Stroke Tip</p>
                  {feedback.tip}
                </div>
              )}
              <p className="text-center font-bold text-slate-700">Did {playerName} draw it correctly?</p>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleJudge(true)} className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold">✅ Yes!</Button>
                <Button onClick={() => handleJudge(false)} className="h-12 rounded-2xl bg-red-500 hover:bg-red-600 font-bold">❌ No</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!feedback && (
          <Button onClick={() => setFeedback({ correct: false, tip: '' })} variant="outline" className="w-full h-12 rounded-2xl font-bold text-slate-500">
            Done Drawing — Judge It
          </Button>
        )}
      </div>
    </motion.div>
  );
}
