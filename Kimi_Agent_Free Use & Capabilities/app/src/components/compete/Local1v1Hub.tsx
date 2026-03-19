import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Swords, Zap, BookOpen, AlignJustify, Keyboard, RotateCcw, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─────────────────────────────────────────────
// Shared types & helpers
// ─────────────────────────────────────────────
interface HubProps {
  onBack: () => void;
  wordBank: any[];
}

type GameId = 'wordDuel' | 'hiraganaBlitz' | 'kanjiShowdown' | 'sentenceScramble' | 'romajiTypeoff';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: string, pool: string[]): string[] {
  const distractors = shuffle(pool.filter(p => p !== correct)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

// ─────────────────────────────────────────────
// Hiragana / katakana data
// ─────────────────────────────────────────────
const HIRAGANA = [
  { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' }, { char: 'か', romaji: 'ka' },
  { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' },
  { char: 'こ', romaji: 'ko' }, { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' },
  { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' },
  { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' }, { char: 'な', romaji: 'na' },
  { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' },
  { char: 'の', romaji: 'no' }, { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' },
  { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' },
  { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' }, { char: 'や', romaji: 'ya' },
  { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' }, { char: 'ら', romaji: 'ra' },
  { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' },
  { char: 'ろ', romaji: 'ro' }, { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n' },
];

// ─────────────────────────────────────────────
// Shared split-screen shell
// ─────────────────────────────────────────────
interface SplitShellProps {
  onBack: () => void;
  p1Name: string;
  p2Name: string;
  score1: number;
  score2: number;
  timeLeft: number;
  children: React.ReactNode; // [0]=P2 content, [1]=P1 content
}

function SplitShell({ onBack, p1Name, p2Name, score1, score2, timeLeft, children }: SplitShellProps) {
  const [p1, p2] = Array.isArray(children) ? children : [null, children];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Player 2 — rotated */}
      <div className="flex-1 rotate-180 flex flex-col justify-end p-4 pb-10 bg-gradient-to-t from-red-950/40 to-slate-900 relative">
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
          <span className="text-red-400 font-bold uppercase tracking-widest text-sm">{p2Name}</span>
          <span className="text-3xl font-black">{score2}</span>
        </div>
        {p2}
      </div>

      {/* Divider timer */}
      <div className="h-1 bg-slate-950 relative flex items-center justify-center shrink-0">
        <div
          className="absolute w-16 h-16 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center cursor-pointer shadow-xl"
          onClick={onBack}
        >
          <span className={`text-xl font-black ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Player 1 */}
      <div className="flex-1 flex flex-col justify-end p-4 pb-10 bg-gradient-to-t from-blue-950/40 to-slate-900 relative">
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
          <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">{p1Name}</span>
          <span className="text-3xl font-black">{score1}</span>
        </div>
        {p1}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Setup screen (shared)
// ─────────────────────────────────────────────
interface SetupProps {
  title: string;
  description: string;
  accentColor: string;
  icon: React.ReactNode;
  onBack: () => void;
  onStart: (p1: string, p2: string) => void;
}
function SetupScreen({ title, description, accentColor, icon, onBack, onStart }: SetupProps) {
  const [p1, setP1] = useState('Player 1');
  const [p2, setP2] = useState('Player 2');
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
      <div className="flex items-center p-4 bg-white border-b">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
        <h1 className="flex-1 text-center font-bold text-lg text-slate-800">{title}</h1>
        <div className="w-9" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${accentColor} mb-2`}>{icon}</div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-1">{title}</h2>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>
        <div className="w-full space-y-4">
          <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-2">
            <label className="text-xs font-bold text-blue-500 uppercase tracking-widest">Player 1 (Bottom)</label>
            <Input value={p1} onChange={e => setP1(e.target.value)} className="h-11 bg-slate-50 border-none font-medium" />
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-2">
            <label className="text-xs font-bold text-red-500 uppercase tracking-widest">Player 2 (Top)</label>
            <Input value={p2} onChange={e => setP2(e.target.value)} className="h-11 bg-slate-50 border-none font-medium" />
          </div>
        </div>
        <Button onClick={() => onStart(p1, p2)} className={`w-full h-14 text-lg rounded-2xl font-bold`}>
          Start Game
        </Button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Game Over screen
// ─────────────────────────────────────────────
function GameOverScreen({ score1, score2, p1Name, p2Name, onReplay, onExit }: any) {
  const tie = score1 === score2;
  const winner = score1 > score2 ? p1Name : p2Name;
  const winColor = score1 > score2 ? 'text-blue-400' : 'text-red-400';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center px-6">
      <Trophy className={`w-20 h-20 mb-4 ${tie ? 'text-yellow-400' : winColor}`} />
      <h2 className="text-4xl font-black mb-2">{tie ? "It's a Tie!" : `${winner} Wins!`}</h2>
      <div className="flex gap-10 mt-8 bg-slate-800 p-8 rounded-3xl border border-slate-700">
        <div className="text-center">
          <div className="text-sm text-blue-400 uppercase tracking-widest mb-1">{p1Name}</div>
          <div className="text-5xl font-black">{score1}</div>
        </div>
        <div className="self-center text-slate-600 text-2xl font-bold">VS</div>
        <div className="text-center">
          <div className="text-sm text-red-400 uppercase tracking-widest mb-1">{p2Name}</div>
          <div className="text-5xl font-black">{score2}</div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={onReplay} className="h-13 text-lg rounded-2xl font-bold flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600">
          <RotateCcw className="w-5 h-5" /> Play Again
        </Button>
        <Button onClick={onExit} variant="outline" className="h-12 text-lg rounded-2xl border-slate-700 text-slate-300 hover:bg-slate-800">
          Exit
        </Button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// GAME 1: Word Translation Duel
// ─────────────────────────────────────────────
function WordDuel({ onBack, wordBank }: HubProps) {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'over'>('setup');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [p1Flash, setP1Flash] = useState<'correct' | 'wrong' | null>(null);
  const [p2Flash, setP2Flash] = useState<'correct' | 'wrong' | null>(null);

  const meanings = wordBank.map(w => w.meaning || w.english).filter(Boolean);
  const [round, setRound] = useState(() => {
    const words = shuffle(wordBank);
    const correct = words[0].meaning || words[0].english;
    return { target: words[0], options: makeOptions(correct, meanings) };
  });

  const nextRound = useCallback(() => {
    const words = shuffle(wordBank);
    const correct = words[0].meaning || words[0].english;
    setRound({ target: words[0], options: makeOptions(correct, meanings) });
  }, [wordBank, meanings]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('over'); return; }
    const t = setTimeout(() => setTimeLeft(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const answer = useCallback((player: 1 | 2, opt: string) => {
    if (phase !== 'playing') return;
    const correct = round.target.meaning || round.target.english;
    if (opt === correct) {
      if (player === 1) { setScore1(s => s + 1); setP1Flash('correct'); }
      else { setScore2(s => s + 1); setP2Flash('correct'); }
      setTimeout(() => { setP1Flash(null); setP2Flash(null); }, 300);
      nextRound();
    } else {
      if (player === 1) { setP1Flash('wrong'); setTimeout(() => setP1Flash(null), 500); }
      else { setP2Flash('wrong'); setTimeout(() => setP2Flash(null), 500); }
    }
  }, [phase, round, nextRound]);

  const start = (p1: string, p2: string) => {
    setP1Name(p1); setP2Name(p2);
    setScore1(0); setScore2(0); setTimeLeft(60);
    nextRound(); setPhase('playing');
  };

  if (phase === 'setup') return (
    <SetupScreen title="Word Translation Duel" description="See a Japanese word. First player to tap the correct English meaning scores!" accentColor="bg-purple-100 text-purple-500" icon={<BookOpen className="w-10 h-10" />} onBack={onBack} onStart={start} />
  );
  if (phase === 'over') return (
    <GameOverScreen score1={score1} score2={score2} p1Name={p1Name} p2Name={p2Name} onReplay={() => start(p1Name, p2Name)} onExit={onBack} />
  );

  const btnClass = (flash: 'correct' | 'wrong' | null) =>
    `h-16 text-base font-bold rounded-2xl border-2 transition-all ${flash === 'correct' ? 'bg-green-700 border-green-500' : flash === 'wrong' ? 'bg-red-900 border-red-700 scale-95' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`;

  return (
    <SplitShell onBack={onBack} p1Name={p1Name} p2Name={p2Name} score1={score1} score2={score2} timeLeft={timeLeft}>
      {/* P2 grid */}
      <div className="space-y-3">
        <div className="text-center mb-4 text-5xl font-black text-white">{round.target.word}</div>
        <div className="grid grid-cols-2 gap-3">{round.options.map((o, i) => <Button key={i} onClick={() => answer(2, o)} className={btnClass(p2Flash)}>{o}</Button>)}</div>
      </div>
      {/* P1 grid */}
      <div className="space-y-3">
        <div className="text-center mb-4 text-5xl font-black text-white">{round.target.word}</div>
        <div className="grid grid-cols-2 gap-3">{round.options.map((o, i) => <Button key={i} onClick={() => answer(1, o)} className={btnClass(p1Flash)}>{o}</Button>)}</div>
      </div>
    </SplitShell>
  );
}

// ─────────────────────────────────────────────
// GAME 2: Hiragana Blitz
// ─────────────────────────────────────────────
function HiraganaBlitz({ onBack }: HubProps) {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'over'>('setup');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const romajiPool = HIRAGANA.map(h => h.romaji);
  const [round, setRound] = useState(() => {
    const h = shuffle(HIRAGANA)[0];
    return { target: h, options: makeOptions(h.romaji, romajiPool) };
  });
  const [p1Flash, setP1Flash] = useState<'correct' | 'wrong' | null>(null);
  const [p2Flash, setP2Flash] = useState<'correct' | 'wrong' | null>(null);

  const nextRound = useCallback(() => {
    const h = shuffle(HIRAGANA)[0];
    setRound({ target: h, options: makeOptions(h.romaji, romajiPool) });
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('over'); return; }
    const t = setTimeout(() => setTimeLeft(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const answer = useCallback((player: 1 | 2, opt: string) => {
    if (phase !== 'playing') return;
    if (opt === round.target.romaji) {
      if (player === 1) { setScore1(s => s + 1); setP1Flash('correct'); }
      else { setScore2(s => s + 1); setP2Flash('correct'); }
      setTimeout(() => { setP1Flash(null); setP2Flash(null); }, 300);
      nextRound();
    } else {
      if (player === 1) { setP1Flash('wrong'); setTimeout(() => setP1Flash(null), 500); }
      else { setP2Flash('wrong'); setTimeout(() => setP2Flash(null), 500); }
    }
  }, [phase, round, nextRound]);

  const start = (p1: string, p2: string) => {
    setP1Name(p1); setP2Name(p2);
    setScore1(0); setScore2(0); setTimeLeft(60); nextRound(); setPhase('playing');
  };

  if (phase === 'setup') return (
    <SetupScreen title="Hiragana Blitz" description="A hiragana character appears. Fastest to tap the correct romaji wins the point!" accentColor="bg-pink-100 text-pink-500" icon={<Zap className="w-10 h-10" />} onBack={onBack} onStart={start} />
  );
  if (phase === 'over') return (
    <GameOverScreen score1={score1} score2={score2} p1Name={p1Name} p2Name={p2Name} onReplay={() => start(p1Name, p2Name)} onExit={onBack} />
  );

  const btnClass = (flash: 'correct' | 'wrong' | null) =>
    `h-16 text-base font-bold rounded-2xl border-2 transition-all ${flash === 'correct' ? 'bg-green-700 border-green-500' : flash === 'wrong' ? 'bg-red-900 border-red-700 scale-95' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`;

  return (
    <SplitShell onBack={onBack} p1Name={p1Name} p2Name={p2Name} score1={score1} score2={score2} timeLeft={timeLeft}>
      <div className="space-y-3">
        <div className="text-center text-8xl font-black text-white mb-4">{round.target.char}</div>
        <div className="grid grid-cols-2 gap-3">{round.options.map((o, i) => <Button key={i} onClick={() => answer(2, o)} className={btnClass(p2Flash)}>{o}</Button>)}</div>
      </div>
      <div className="space-y-3">
        <div className="text-center text-8xl font-black text-white mb-4">{round.target.char}</div>
        <div className="grid grid-cols-2 gap-3">{round.options.map((o, i) => <Button key={i} onClick={() => answer(1, o)} className={btnClass(p1Flash)}>{o}</Button>)}</div>
      </div>
    </SplitShell>
  );
}

// ─────────────────────────────────────────────
// GAME 3: Romaji Typeoff (type the romaji first)
// ─────────────────────────────────────────────
function RomajiTypeoff({ onBack }: HubProps) {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'over'>('setup');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [round, setRound] = useState(() => shuffle(HIRAGANA)[0]);
  const [p1Input, setP1Input] = useState('');
  const [p2Input, setP2Input] = useState('');
  const [flash, setFlash] = useState<{ p: 1 | 2, type: 'correct' | 'wrong' } | null>(null);

  const nextRound = () => { setRound(shuffle(HIRAGANA)[0]); setP1Input(''); setP2Input(''); };

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('over'); return; }
    const t = setTimeout(() => setTimeLeft(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const trySubmit = (player: 1 | 2, val: string) => {
    if (val.toLowerCase().trim() === round.romaji) {
      if (player === 1) setScore1(s => s + 1); else setScore2(s => s + 1);
      setFlash({ p: player, type: 'correct' });
      setTimeout(() => { setFlash(null); nextRound(); }, 400);
    }
  };

  const start = (p1: string, p2: string) => {
    setP1Name(p1); setP2Name(p2); setScore1(0); setScore2(0);
    setTimeLeft(60); nextRound(); setPhase('playing');
  };

  if (phase === 'setup') return (
    <SetupScreen title="Romaji Typeoff" description="See the hiragana — type its romaji first to score! No multiple choice — pure typing speed." accentColor="bg-amber-100 text-amber-600" icon={<Keyboard className="w-10 h-10" />} onBack={onBack} onStart={start} />
  );
  if (phase === 'over') return (
    <GameOverScreen score1={score1} score2={score2} p1Name={p1Name} p2Name={p2Name} onReplay={() => start(p1Name, p2Name)} onExit={onBack} />
  );

  return (
    <SplitShell onBack={onBack} p1Name={p1Name} p2Name={p2Name} score1={score1} score2={score2} timeLeft={timeLeft}>
      {/* P2 */}
      <div className="space-y-3">
        <div className={`text-center text-8xl font-black mb-4 transition-colors ${flash?.p === 2 && flash.type === 'correct' ? 'text-green-400' : 'text-white'}`}>{round.char}</div>
        <Input
          value={p2Input}
          onChange={e => { setP2Input(e.target.value); trySubmit(2, e.target.value); }}
          className="h-14 text-center text-xl font-bold bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
          placeholder="type romaji…"
          autoComplete="off"
        />
      </div>
      {/* P1 */}
      <div className="space-y-3">
        <div className={`text-center text-8xl font-black mb-4 transition-colors ${flash?.p === 1 && flash.type === 'correct' ? 'text-green-400' : 'text-white'}`}>{round.char}</div>
        <Input
          value={p1Input}
          onChange={e => { setP1Input(e.target.value); trySubmit(1, e.target.value); }}
          className="h-14 text-center text-xl font-bold bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
          placeholder="type romaji…"
          autoComplete="off"
        />
      </div>
    </SplitShell>
  );
}

// ─────────────────────────────────────────────
// GAME 4: Sentence Scramble
// ─────────────────────────────────────────────
const SENTENCES = [
  { words: ['わたし', 'は', 'がくせい', 'です'], answer: 'わたし は がくせい です', meaning: 'I am a student.' },
  { words: ['これ', 'は', 'ほん', 'です'], answer: 'これ は ほん です', meaning: 'This is a book.' },
  { words: ['あなた', 'は', 'せんせい', 'です'], answer: 'あなた は せんせい です', meaning: 'You are a teacher.' },
  { words: ['ここ', 'は', 'にほん', 'です'], answer: 'ここ は にほん です', meaning: 'This place is Japan.' },
  { words: ['わたし', 'は', 'たべます'], answer: 'わたし は たべます', meaning: 'I eat.' },
  { words: ['かれ', 'は', 'みず', 'を', 'のみます'], answer: 'かれ は みず を のみます', meaning: 'He drinks water.' },
];

function SentenceScramble({ onBack }: HubProps) {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'over'>('setup');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

  const pickSentence = () => shuffle(SENTENCES)[0];
  const [sentence, setSentence] = useState(pickSentence);
  const [p1Sel, setP1Sel] = useState<string[]>([]);
  const [p2Sel, setP2Sel] = useState<string[]>([]);
  const [p1Options, setP1Options] = useState<string[]>([]);
  const [p2Options, setP2Options] = useState<string[]>([]);
  const [p1Flash, setP1Flash] = useState<'correct' | 'wrong' | null>(null);
  const [p2Flash, setP2Flash] = useState<'correct' | 'wrong' | null>(null);

  const setupRound = (s = sentence) => {
    const opts = shuffle([...s.words]);
    setP1Options(opts); setP2Options(opts);
    setP1Sel([]); setP2Sel([]);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('over'); return; }
    const t = setTimeout(() => setTimeLeft(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const tapWord = (player: 1 | 2, word: string) => {
    if (player === 1) {
      const next = [...p1Sel, word];
      setP1Sel(next);
      setP1Options(o => { const arr = [...o]; arr.splice(arr.indexOf(word), 1); return arr; });
      if (next.length === sentence.words.length) {
        if (next.join(' ') === sentence.answer) {
          setScore1(s => s + 1); setP1Flash('correct');
          setTimeout(() => { setP1Flash(null); const ns = pickSentence(); setSentence(ns); setupRound(ns); }, 600);
        } else {
          setP1Flash('wrong');
          setTimeout(() => { setP1Flash(null); setP1Sel([]); setP1Options(shuffle([...sentence.words])); }, 600);
        }
      }
    } else {
      const next = [...p2Sel, word];
      setP2Sel(next);
      setP2Options(o => { const arr = [...o]; arr.splice(arr.indexOf(word), 1); return arr; });
      if (next.length === sentence.words.length) {
        if (next.join(' ') === sentence.answer) {
          setScore2(s => s + 1); setP2Flash('correct');
          setTimeout(() => { setP2Flash(null); const ns = pickSentence(); setSentence(ns); setupRound(ns); }, 600);
        } else {
          setP2Flash('wrong');
          setTimeout(() => { setP2Flash(null); setP2Sel([]); setP2Options(shuffle([...sentence.words])); }, 600);
        }
      }
    }
  };

  const start = (p1: string, p2: string) => {
    setP1Name(p1); setP2Name(p2); setScore1(0); setScore2(0); setTimeLeft(90);
    const s = pickSentence(); setSentence(s); setupRound(s); setPhase('playing');
  };

  if (phase === 'setup') return (
    <SetupScreen title="Sentence Scramble" description="Tap the words in the correct order to form a Japanese sentence. First to finish scores!" accentColor="bg-teal-100 text-teal-600" icon={<AlignJustify className="w-10 h-10" />} onBack={onBack} onStart={start} />
  );
  if (phase === 'over') return (
    <GameOverScreen score1={score1} score2={score2} p1Name={p1Name} p2Name={p2Name} onReplay={() => start(p1Name, p2Name)} onExit={onBack} />
  );

  const wordBtn = (word: string, onClick: () => void, disabled = false) => (
    <button key={word} onClick={onClick} disabled={disabled}
      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-30">
      {word}
    </button>
  );

  const flashBg = (f: 'correct' | 'wrong' | null) => f === 'correct' ? 'bg-green-900/40' : f === 'wrong' ? 'bg-red-900/40' : '';

  return (
    <SplitShell onBack={onBack} p1Name={p1Name} p2Name={p2Name} score1={score1} score2={score2} timeLeft={timeLeft}>
      {/* P2 */}
      <div className={`space-y-3 rounded-2xl p-2 transition-colors ${flashBg(p2Flash)}`}>
        <p className="text-center text-slate-400 text-xs mb-2">{sentence.meaning}</p>
        <div className="min-h-10 bg-slate-800 rounded-xl p-2 flex flex-wrap gap-2 justify-center">
          {p2Sel.map((w, i) => <span key={i} className="px-3 py-1 bg-indigo-700 text-white rounded-lg text-sm font-bold">{w}</span>)}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">{p2Options.map(w => wordBtn(w, () => tapWord(2, w)))}</div>
      </div>
      {/* P1 */}
      <div className={`space-y-3 rounded-2xl p-2 transition-colors ${flashBg(p1Flash)}`}>
        <p className="text-center text-slate-400 text-xs mb-2">{sentence.meaning}</p>
        <div className="min-h-10 bg-slate-800 rounded-xl p-2 flex flex-wrap gap-2 justify-center">
          {p1Sel.map((w, i) => <span key={i} className="px-3 py-1 bg-indigo-700 text-white rounded-lg text-sm font-bold">{w}</span>)}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">{p1Options.map(w => wordBtn(w, () => tapWord(1, w)))}</div>
      </div>
    </SplitShell>
  );
}

// ─────────────────────────────────────────────
// GAME HUB
// ─────────────────────────────────────────────
const GAMES: { id: GameId; title: string; desc: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: 'wordDuel', title: 'Word Translation Duel', desc: 'Tap the correct English meaning first', icon: <BookOpen className="w-7 h-7" />, color: 'text-purple-500', bg: 'bg-purple-50 group-hover:bg-purple-500 group-hover:text-white' },
  { id: 'hiraganaBlitz', title: 'Hiragana Blitz', desc: 'Identify the hiragana character fastest', icon: <Zap className="w-7 h-7" />, color: 'text-pink-500', bg: 'bg-pink-50 group-hover:bg-pink-500 group-hover:text-white' },
  { id: 'romajiTypeoff', title: 'Romaji Typeoff', desc: 'Type the romaji before your opponent does', icon: <Keyboard className="w-7 h-7" />, color: 'text-amber-600', bg: 'bg-amber-50 group-hover:bg-amber-500 group-hover:text-white' },
  { id: 'sentenceScramble', title: 'Sentence Scramble', desc: 'Arrange words into the correct sentence first', icon: <AlignJustify className="w-7 h-7" />, color: 'text-teal-600', bg: 'bg-teal-50 group-hover:bg-teal-500 group-hover:text-white' },
];

export function Local1v1Hub({ onBack, wordBank }: HubProps) {
  const [selected, setSelected] = useState<GameId | null>(null);

  if (selected === 'wordDuel') return <WordDuel onBack={() => setSelected(null)} wordBank={wordBank} />;
  if (selected === 'hiraganaBlitz') return <HiraganaBlitz onBack={() => setSelected(null)} wordBank={wordBank} />;
  if (selected === 'romajiTypeoff') return <RomajiTypeoff onBack={() => setSelected(null)} wordBank={wordBank} />;
  if (selected === 'sentenceScramble') return <SentenceScramble onBack={() => setSelected(null)} wordBank={wordBank} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-50 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-slate-800 tracking-tight">1v1 Game Hub</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Hero */}
        <div className="text-center py-6 mb-4">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-3xl bg-red-100 text-red-500 mb-4 shadow-sm border border-red-200">
            <Swords className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Choose Your Battle</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">4 games to challenge a friend side-by-side</p>
        </div>

        {/* Game cards */}
        <div className="space-y-3 max-w-sm mx-auto">
          {GAMES.map(g => (
            <motion.button
              key={g.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(g.id)}
              className="w-full p-5 bg-white rounded-3xl shadow-sm border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group text-left flex items-center gap-4"
            >
              <div className={`p-3 rounded-2xl transition-colors ${g.bg} ${g.color} shrink-0`}>
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{g.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5 leading-snug">{g.desc}</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-slate-300 rotate-180 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>

        {/* Player hint */}
        <div className="mt-6 mx-auto max-w-sm bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-slate-500">
          <User className="w-5 h-5 shrink-0 text-slate-400" />
          <p className="text-sm">Each game is split-screen so both players use the same device.</p>
        </div>
      </div>
    </motion.div>
  );
}
