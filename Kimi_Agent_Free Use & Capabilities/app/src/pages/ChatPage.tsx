import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, X, Send, Loader2, Zap } from 'lucide-react';
import { VoiceInput } from '@/components/speak/VoiceInput';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useVoiceSynthesis } from '@/hooks/useVoiceSynthesis';
import { useGeminiChat } from '@/hooks/useGeminiChat';
import { useWanakana } from '@/hooks/useWanakana';
import { FuriganaText } from '@/components/shared/FuriganaText';
import { useApp } from '@/contexts/AppContext';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatPageProps {
  onBack: () => void;
  lessonTitle?: string;
  lessonContext?: string;
}

const hintVocabulary = [
  { japanese: '面白い', romaji: 'omoshiroi', english: 'interesting' },
  { japanese: '楽しい', romaji: 'tanoshii', english: 'fun / enjoyable' },
  { japanese: '難しい', romaji: 'muzukashii', english: 'difficult' },
  { japanese: '簡単', romaji: 'kantan', english: 'easy' },
  { japanese: '好き', romaji: 'suki', english: 'like / favourite' },
  { japanese: 'でも', romaji: 'demo', english: 'but / however' },
  { japanese: '思います', romaji: 'omoimasu', english: 'I think' },
  { japanese: 'どうして', romaji: 'doushite', english: 'why?' },
  { japanese: 'どこ', romaji: 'doko', english: 'where?' },
  { japanese: 'いつ', romaji: 'itsu', english: 'when?' },
];

const initialAiMessage: Message = {
  id: '1',
  type: 'ai',
  japanese: 'こんにちは！今日はどんなことを話したいですか？🌸',
  romaji: 'Konnichiwa! Kyou wa donna koto wo hanashitai desu ka?',
  english: "Hello! What would you like to talk about today?",
  timestamp: new Date(),
};

export function ChatPage({ onBack, lessonTitle, lessonContext }: ChatPageProps) {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardText, setKeyboardText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingStartRef = useRef<number | null>(null);
  const initializedRef = useRef<boolean>(false);

  const keyboardInputRef = useWanakana<HTMLInputElement>();

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { speak, isSpeaking } = useVoiceSynthesis();
  const { sendMessage: askGemini, isThinking, hasApiKey } = useGeminiChat({ lessonTitle, lessonContext });

  useEffect(() => { dispatch({ type: 'MARK_ACTIVE' }); }, [dispatch]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking]);
  useEffect(() => { if (showKeyboard) setTimeout(() => keyboardInputRef.current?.focus(), 100); }, [showKeyboard, keyboardInputRef]);

  useEffect(() => {
    async function initChat() {
      if (initializedRef.current) return;
      initializedRef.current = true;

      if (lessonTitle) {
        // Automatically trigger AI to start the lesson
        const prompt = `Please start our lesson on: ${lessonTitle} ${lessonContext ? `(${lessonContext})` : ''}. Give me a brief explanation and one or two clear example sentences, then ask me a specific question to test my understanding.`;
        const initialMsg = await askGemini(prompt);
        if (initialMsg) {
          setMessages([initialMsg]);
        } else {
          setMessages([initialAiMessage]);
        }
      } else {
        setMessages([initialAiMessage]);
      }
    }
    initChat();
  }, [lessonTitle, lessonContext, askGemini]);

  const handleStartListening = useCallback(() => {
    recordingStartRef.current = Date.now();
    startListening();
  }, [startListening]);

  const sendUserMessage = useCallback(async (japanese: string) => {
    if (!japanese.trim()) return;

    const speakSeconds = recordingStartRef.current
      ? Math.floor((Date.now() - recordingStartRef.current) / 1000)
      : 0;
    recordingStartRef.current = null;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      japanese: japanese.trim(),
      romaji: japanese.trim(),
      english: '',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });

    // Track stats
    if (speakSeconds > 0) {
      dispatch({ type: 'UPDATE_STATS', payload: { secondsSpoken: state.stats.secondsSpoken + speakSeconds } });
      const g2 = state.goals.find(g => g.id === '2')?.current ?? 0;
      dispatch({ type: 'UPDATE_GOAL', payload: { id: '2', current: g2 + speakSeconds } });
    }
    const g1 = state.goals.find(g => g.id === '1')?.current ?? 0;
    dispatch({ type: 'UPDATE_GOAL', payload: { id: '1', current: g1 + 1 } });

    resetTranscript();

    // Get Gemini response
    const aiMsg = await askGemini(japanese.trim());
    if (aiMsg) setMessages(prev => [...prev, aiMsg]);
  }, [dispatch, state.stats.secondsSpoken, state.goals, resetTranscript, askGemini]);

  useEffect(() => {
    if (!isListening && transcript) setTimeout(() => sendUserMessage(transcript), 0);
  }, [isListening, transcript, sendUserMessage]);

  const handleKeyboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyboardText.trim()) {
      sendUserMessage(keyboardText);
      setKeyboardText('');
      setShowKeyboard(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="w-8 h-8 rounded-full bg-bamboo-100 flex items-center justify-center">
            <span className="text-lg">🌸</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 block leading-tight">
              {lessonTitle || 'Kaori-Panda'}
            </span>
            {lessonContext && <span className="text-xs text-gray-400">{lessonContext}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* AI mode indicator */}
          <span className={cn(
            'text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1',
            hasApiKey ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
          )}>
            <Zap className="w-3 h-3" />
            {hasApiKey ? 'Gemini AI' : 'Basic'}
          </span>

        </div>
      </header>

      <div className="flex items-center justify-center py-2 border-b border-gray-100">
        <span className="text-sm text-gray-400">
          {lessonTitle ? lessonTitle : 'Free Conversation'}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex flex-col', message.type === 'user' ? 'items-end' : 'items-start')}
            >
              <div className={cn(
                'max-w-[90%] rounded-2xl p-4',
                message.type === 'user'
                  ? 'bg-stat-blue rounded-br-md'
                  : 'bg-white border border-gray-100 rounded-bl-md shadow-sm'
              )}>
                {['furigana', 'both'].includes(state.settings.displayMode) && message.type === 'ai' ? (
                  <p className="jp-text text-gray-900 text-base leading-relaxed mb-1">
                    <FuriganaText text={message.japanese} />
                  </p>
                ) : (
                  <p className="jp-text text-gray-900 text-base leading-relaxed mb-1">{message.japanese}</p>
                )}
                {message.romaji && message.romaji !== message.japanese && state.settings.displayMode !== 'furigana' && (
                  <p className="text-gray-500 text-sm mb-1">{message.romaji}</p>
                )}
                {message.english && <p className="text-gray-600 text-sm">{message.english}</p>}
                <button
                  onClick={() => speak(message.japanese)}
                  className={cn(
                    'mt-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    isSpeaking ? 'bg-bamboo-200 text-bamboo-700 animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                  )}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400 mt-1 px-2">{formatTime(message.timestamp)}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* "Thinking" bubble */}
        <AnimatePresence>
          {(isThinking || messages.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start mt-4"
            >
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md shadow-sm px-5 py-4">
                <div className="flex gap-1 items-center">
                  <Loader2 className="w-4 h-4 text-bamboo-400 animate-spin" />
                  <span className="text-sm text-gray-400 ml-1">Kaori is preparing your lesson…</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Hint Panel */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">💡 Vocabulary Hints</h3>
              <button onClick={() => setShowHint(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {hintVocabulary.map((hint) => (
                <button
                  key={hint.japanese}
                  onClick={() => { setKeyboardText(prev => prev + hint.japanese); setShowHint(false); setShowKeyboard(true); }}
                  className="text-left p-2 rounded-xl bg-gray-50 hover:bg-bamboo-50 transition-colors"
                >
                  <p className="jp-text text-sm font-medium text-gray-900">{hint.japanese}</p>
                  <p className="text-xs text-gray-500">{hint.romaji} · {hint.english}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Input */}
      <AnimatePresence>
        {showKeyboard && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onSubmit={handleKeyboardSubmit}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100"
          >
            <input
              ref={keyboardInputRef}
              type="text"
              value={keyboardText}
              onChange={e => setKeyboardText(e.target.value)}
              placeholder="Type in Japanese or English…"
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bamboo-200 jp-text text-sm"
              disabled={isThinking}
            />
            <button type="button" onClick={() => setShowKeyboard(false)} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!keyboardText.trim() || isThinking}
              className="w-10 h-10 rounded-full bg-bamboo-400 hover:bg-bamboo-500 text-white flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {!showKeyboard && (
        <VoiceInput
          isListening={isListening}
          onStartListening={handleStartListening}
          onStopListening={stopListening}
          onHint={() => { setShowHint(prev => !prev); }}
          onKeyboard={() => { setShowHint(false); setShowKeyboard(true); }}
        />
      )}
    </div>
  );
}
