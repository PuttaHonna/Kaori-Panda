import type { N5Lesson, Vocabulary, ChapterGrammar } from './lesson';
export type { N5Lesson, Vocabulary, ChapterGrammar };

export interface User {
  name: string;
  email: string;
  createdAt: string;
}

export interface Stats {
  messagesSpoken: number;
  flashcardsRevised: number;
  lessonsCompleted: number;
  secondsSpoken: number;
  wordsLearned: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  color: 'green' | 'orange' | 'blue';
}

export interface LearningMode {
  id: string;
  title: string;
  description: string;
  actionText: string;
  illustration: string;
  locked?: boolean;
  lockMessage?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  japanese: string;
  romaji: string;
  english: string;
  timestamp: Date;
}

export interface GrammarPoint {
  id: string;
  japanese: string;
  romaji: string;
  meaning: string;
  exampleJapanese: string;
  exampleEnglish: string;
  kanjiExplanation?: string;
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  structures: number;
}

export interface Word {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  learned: boolean;
  // SRS (Spaced Repetition System)
  level: number;           // 0-5: intervals 1, 3, 7, 14, 30, 60 days
  nextReviewDate: string;  // ISO date string — when this card is next due
  reviewCount: number;     // total number of review sessions
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'reading' | 'conjugation';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  englishTranslation?: string;
}

export interface Lesson {
  id: string;
  unit: string;
  title: string;
  description: string;
  level: string;
  exercises?: Exercise[];
}

export interface AppState {
  user: User;
  stats: Stats;
  goals: Goal[];
  messages: Message[];
  words: Word[];
  lastActiveDate: string;
  settings: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    voiceGender: 'male' | 'female';
    displayMode: 'romaji' | 'furigana' | 'both';
    dailyReminders?: boolean;
  };
  currentN5Lesson: N5Lesson | null;
  progress: {
    completedLessons: number[];
  };
  fullN5Vocab: Record<number, Vocabulary[]>;
  targetJlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'; // User's selected goal level
}

export type TabType = 'speak' | 'knowledge' | 'compete' | 'progress';

export type KnowledgeSubTab = 'wordbank' | 'dictionary' | 'grammar' | 'te-form';
