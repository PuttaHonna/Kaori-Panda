import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, User, Stats, Message, Word, Vocabulary } from '@/types';

// SRS interval schedule (days per level)
const SRS_INTERVALS = [1, 3, 7, 14, 30, 60];

import genkiVocabMap from '@/data/genkiVocabMap.json';

import { getDateString } from '@/lib/utils';

function getNextReviewDate(level: number): string {
  const days = SRS_INTERVALS[Math.min(level, SRS_INTERVALS.length - 1)];
  const next = new Date();
  next.setDate(next.getDate() + days);
  return getDateString(next);
}



type Action =
  | { type: 'SET_USER'; payload: Partial<User> }
  | { type: 'UPDATE_STATS'; payload: Partial<Stats> }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'ADD_WORD'; payload: Word }
  | { type: 'TOGGLE_WORD_LEARNED'; payload: string }
  | { type: 'REVIEW_WORD'; payload: { wordId: string; correct: boolean } }
  | { type: 'UPDATE_GOAL'; payload: { id: string; current: number } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'MARK_ACTIVE' }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_PROGRESS' }
  | { type: 'SET_CURRENT_N5_LESSON'; payload: AppState['currentN5Lesson'] }
  | { type: 'MARK_LESSON_COMPLETED'; payload: number }
  | { type: 'SET_TARGET_JLPT'; payload: AppState['targetJlpt'] };

const initialState: AppState = {
  user: {
    name: '',
    email: 'user@kaori-panda.com',
    createdAt: new Date().toISOString(),
  },
  stats: {
    messagesSpoken: 0,
    flashcardsRevised: 0,
    lessonsCompleted: 0,
    secondsSpoken: 0,
    wordsLearned: 0,
  },
  goals: [
    { id: '1', title: 'Speak Japanese 5 times', target: 5, current: 0, color: 'green' },
    { id: '2', title: 'Speak 100 seconds total', target: 100, current: 0, color: 'orange' },
    { id: '3', title: 'Speak 5 new words', target: 5, current: 0, color: 'blue' },
  ],
  messages: [],
  words: [],
  lastActiveDate: '',
  settings: {
    difficulty: 'beginner',
    voiceGender: 'female',
    displayMode: 'romaji',
  },
  currentN5Lesson: null,
  progress: {
    completedLessons: []
  },
  fullN5Vocab: genkiVocabMap as Record<number, Vocabulary[]>,
  targetJlpt: 'N5',
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'UPDATE_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        stats: { ...state.stats, messagesSpoken: state.stats.messagesSpoken + 1 },
      };
    case 'ADD_WORD':
      return {
        ...state,
        words: [...state.words, action.payload],
        stats: { ...state.stats, wordsLearned: state.stats.wordsLearned + 1 },
      };
    case 'TOGGLE_WORD_LEARNED': {
      const updatedWords = state.words.map(w =>
        w.id === action.payload ? { ...w, learned: !w.learned } : w
      );
      return {
        ...state,
        words: updatedWords,
        stats: { ...state.stats, wordsLearned: updatedWords.filter(w => w.learned).length },
      };
    }
    case 'REVIEW_WORD': {
      const { wordId, correct } = action.payload;
      const updatedWords = state.words.map(w => {
        if (w.id !== wordId) return w;
        const newLevel = correct ? Math.min((w.level ?? 0) + 1, 5) : 0;
        return {
          ...w,
          level: newLevel,
          nextReviewDate: getNextReviewDate(newLevel),
          reviewCount: (w.reviewCount ?? 0) + 1,
          learned: newLevel >= 3, // auto-mark as learned at level 3+
        };
      });
      return {
        ...state,
        words: updatedWords,
        stats: {
          ...state.stats,
          flashcardsRevised: state.stats.flashcardsRevised + 1,
          wordsLearned: updatedWords.filter(w => w.learned).length,
        },
      };
    }
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id
            ? { ...goal, current: Math.min(action.payload.current, goal.target) }
            : goal
        ),
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'MARK_ACTIVE': {
      const today = getDateString(new Date());
      return { ...state, lastActiveDate: today };
    }
    case 'SET_CURRENT_N5_LESSON':
      return { ...state, currentN5Lesson: action.payload };
    case 'MARK_LESSON_COMPLETED':
      return {
        ...state,
        progress: {
          ...state.progress,
          completedLessons: state.progress.completedLessons.includes(action.payload)
            ? state.progress.completedLessons
            : [...state.progress.completedLessons, action.payload]
        }
      };
    case 'SET_TARGET_JLPT':
      return { ...state, targetJlpt: action.payload };
    case 'LOAD_STATE':
      // Migrate legacy words that don't have SRS fields
      return {
        ...initialState,
        ...action.payload,
        words: (action.payload.words ?? []).map(w => ({
          ...w,
          level: w.level ?? 0,
          nextReviewDate: w.nextReviewDate ?? getDateString(new Date()),
          reviewCount: w.reviewCount ?? 0,
        })),
        progress: action.payload.progress ?? { completedLessons: [] },
        fullN5Vocab: genkiVocabMap as Record<number, Vocabulary[]>,
      };
    case 'RESET_PROGRESS':
      return {
        ...state,
        stats: initialState.stats,
        goals: initialState.goals,
        messages: [],
        words: [],
        lastActiveDate: '',
        currentN5Lesson: null,
        progress: { completedLessons: [] },
        fullN5Vocab: genkiVocabMap as Record<number, Vocabulary[]>,
        targetJlpt: 'N5',
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('sakuraspeak_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sakuraspeak_state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}
