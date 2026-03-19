import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI, type ChatSession } from '@google/generative-ai';
import { useApp } from '@/contexts/AppContext';
import { genkiFallbacks } from '@/data/genkiFallbacks';
import type { Message } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// System prompt tuning the AI to be a Japanese language tutor
const buildSystemPrompt = (difficulty: string, userName: string, hasUnlockedN4: boolean, lessonTitle?: string, lessonContext?: string) => `
You are Kaori, a warm and encouraging Japanese language tutor in the Kaori-Panda app.
User's name: ${userName || 'language learner'}
Their level: ${difficulty}
${lessonTitle ? `\nCURRENT LESSON CONTEXT: You are currently teaching a structured lesson on: "${lessonTitle}" (${lessonContext || ''}).
IMPORTANT: Act as a structured teacher for this specific topic. Break down the grammar concept clearly, provide 1-2 practical examples, and conclude with a specific challenge or question for the user to answer to test their understanding of this lesson.` : ''}

Rules you MUST follow on EVERY response:
1. Always respond in Japanese first, then provide romaji on the next line, then English translation.
2. Keep responses SHORT — 1-2 sentences max, unless explaining a grammar point for a lesson where you can use 3-4 sentences.
3. Be encouraging and react to what the user said.
4. Ask a simple follow-up question to keep the conversation going.
5. Match difficulty: beginner = simple grammar (は、です), intermediate = て-form/past, advanced = casual speech/keigo.
${hasUnlockedN4 ? '6. CRITICAL: The user has unlocked N4 grammar! You MUST specifically employ N4 patterns in your responses, such as "～んです" (explaining situations) and Potential verbs ("行けます", "話せます", etc) to challenge them.' : ''}

Format your response EXACTLY like this (use these exact labels):
日本語: [Japanese sentence(s). If in a lesson, include examples and the challenge question here.]
ローマ字: [romaji of the Japanese text]
English: [English translation. If in a lesson, you may include a brief grammar explanation in English here before the translation.]

Do NOT include anything outside this format.
`.trim();

// Fallback responses when API key is missing or request fails
const FALLBACK_RESPONSES: Message[] = [
    { id: 'f1', type: 'ai', japanese: 'なるほど！もっと教えてください。', romaji: 'Naruhodo! Motto oshiete kudasai.', english: 'I see! Please tell me more.', timestamp: new Date() },
    { id: 'f2', type: 'ai', japanese: '面白いですね！日本語が上手ですよ。', romaji: 'Omoshiroi desu ne! Nihongo ga jouzu desu yo.', english: "That's interesting! Your Japanese is great.", timestamp: new Date() },
    { id: 'f3', type: 'ai', japanese: 'それはいいですね！毎日練習しましょう。', romaji: 'Sore wa ii desu ne! Mainichi renshuu shimashou.', english: "That's great! Let's practice every day.", timestamp: new Date() },
    { id: 'f4', type: 'ai', japanese: 'どうしてそう思いますか？', romaji: 'Doushite sou omoimasu ka?', english: 'Why do you think so?', timestamp: new Date() },
    { id: 'f5', type: 'ai', japanese: '日本の文化が好きですか？', romaji: 'Nihon no bunka ga suki desu ka?', english: 'Do you like Japanese culture?', timestamp: new Date() },
];

function parseKaoriResponse(text: string): { japanese: string; romaji: string; english: string } {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const get = (prefix: string) => lines.find(l => l.startsWith(prefix))?.replace(prefix, '').trim() ?? '';
    return {
        japanese: get('日本語:') || get('Japanese:') || lines[0] || text,
        romaji: get('ローマ字:') || get('Romaji:') || lines[1] || '',
        english: get('English:') || lines[2] || '',
    };
}

interface UseGeminiChatReturn {
    sendMessage: (userText: string) => Promise<Message | null>;
    isThinking: boolean;
    error: string | null;
    clearError: () => void;
    hasApiKey: boolean;
}

interface UseGeminiChatOptions {
    lessonTitle?: string;
    lessonContext?: string;
}

export function useGeminiChat(options?: UseGeminiChatOptions): UseGeminiChatReturn {
    const { state } = useApp();
    const [isThinking, setIsThinking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<ChatSession | null>(null);
    const fallbackIndexRef = useRef(0);

    const hasApiKey = Boolean(API_KEY && API_KEY !== 'your_gemini_api_key_here');

    // Lazy-init Gemini chat session
    const getChat = useCallback((): ChatSession | null => {
        if (!hasApiKey) return null;
        if (!chatRef.current) {
            try {
                const hasUnlockedN4 = state.progress.completedLessons.some(l => l > 25);
                const genAI = new GoogleGenerativeAI(API_KEY!);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-1.5-flash',
                    systemInstruction: buildSystemPrompt(state.settings.difficulty, state.user.name, hasUnlockedN4, options?.lessonTitle, options?.lessonContext),
                });
                chatRef.current = model.startChat({ history: [] });
            } catch {
                return null;
            }
        }
        return chatRef.current;
    }, [hasApiKey, state.settings.difficulty, state.user.name, state.progress.completedLessons]);

    const sendMessage = useCallback(async (userText: string): Promise<Message | null> => {
        setIsThinking(true);
        setError(null);

        const chat = getChat();

        if (!chat) {
            // No API key — use fallback
            await new Promise(r => setTimeout(r, 900));

            // Check if we are initializing a structured lesson
            if (options?.lessonTitle && userText.includes("Please start our lesson on")) {
                const fbLesson = genkiFallbacks[options.lessonTitle];
                if (fbLesson) {
                    setIsThinking(false);
                    return { ...fbLesson, type: 'ai', id: Date.now().toString(), timestamp: new Date() };
                }
            }

            const fb = FALLBACK_RESPONSES[fallbackIndexRef.current % FALLBACK_RESPONSES.length];
            fallbackIndexRef.current += 1;
            setIsThinking(false);
            return { ...fb, id: Date.now().toString(), timestamp: new Date() };
        }

        try {
            const result = await chat.sendMessage(userText);
            const text = result.response.text();
            const parsed = parseKaoriResponse(text);
            setIsThinking(false);
            return {
                id: Date.now().toString(),
                type: 'ai',
                ...parsed,
                timestamp: new Date(),
            };
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Gemini request failed';
            setError(msg);
            // Graceful fallback
            if (options?.lessonTitle && userText.includes("Please start our lesson on")) {
                const fbLesson = genkiFallbacks[options.lessonTitle];
                if (fbLesson) {
                    setIsThinking(false);
                    return { ...fbLesson, type: 'ai', id: Date.now().toString(), timestamp: new Date() };
                }
            }

            const fb = FALLBACK_RESPONSES[fallbackIndexRef.current % FALLBACK_RESPONSES.length];
            fallbackIndexRef.current += 1;
            setIsThinking(false);
            return { ...fb, id: Date.now().toString(), timestamp: new Date() };
        }
    }, [getChat]);

    return { sendMessage, isThinking, error, clearError: () => setError(null), hasApiKey };
}
