import { useState, useCallback } from 'react';
import { geminiPrompt } from '@/lib/gemini';
import { useApp } from '@/contexts/AppContext';

export interface AIQuizQuestion {
  question: string;    // English e.g. "How do you say 'to eat' in Japanese?"
  options: string[];   // 4 options in Japanese or English
  answer: string;      // correct option
  explanation: string; // brief grammar note
}

interface UseAIQuizReturn {
  questions: AIQuizQuestion[];
  loading: boolean;
  error: string | null;
  generate: () => Promise<void>;
}

export function useAIQuiz(): UseAIQuizReturn {
  const { state } = useApp();
  const [questions, setQuestions] = useState<AIQuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Get words the user struggles with (SRS level 0 or 1)
    const weakWords = state.words
      .filter(w => (w.level ?? 0) <= 1)
      .slice(0, 8)
      .map(w => w.japanese || w.romaji);

    const wordList = weakWords.length >= 4 ? weakWords : [
      '食べる', '飲む', '行く', '来る', '見る', '話す', '書く', '読む',
    ];

    const prompt = `Create 5 Japanese vocabulary quiz questions for a ${state.settings.difficulty} learner.
Focus on these words: ${wordList.join(', ')}

Return ONLY valid JSON array:
[
  {
    "question": "What is the meaning of 食べる?",
    "options": ["To eat", "To drink", "To sleep", "To walk"],
    "answer": "To eat",
    "explanation": "食べる (taberu) is a Group 2 verb meaning 'to eat'."
  }
]

Rules:
- Mix question types: meaning, reading, usage in sentence
- 4 options each, only one correct
- Brief explanation for the correct answer
- Return ONLY the JSON array, no other text.`;

    try {
      const raw = await geminiPrompt(prompt);
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned) as AIQuizQuestion[];
      setQuestions(parsed);
    } catch {
      setError('Could not generate quiz questions. Check your API key.');
    } finally {
      setLoading(false);
    }
  }, [state.words, state.settings.difficulty]);

  return { questions, loading, error, generate };
}
