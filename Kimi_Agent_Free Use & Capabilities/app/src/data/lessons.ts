import type { Lesson } from '@/types';

export const lessonsData: Lesson[] = [
  {
    id: '1',
    unit: 'Unit 1.1',
    title: 'Afternoon Encounters: Hello and See You!',
    description: 'Learn to greet people and say goodbye in natural Japanese.',
    level: 'A1',
    exercises: [
      {
        id: '1-1',
        type: 'reading',
        question: 'How do you say "Hello" or "Good afternoon" in Japanese?',
        correctAnswer: 'こんにちは',
        englishTranslation: 'Konnichiwa is the standard daytime greeting.',
      },
      {
        id: '1-2',
        type: 'multiple_choice',
        question: 'Which of the following means "Goodbye" in a formal setting?',
        options: ['おはよう', 'さようなら', 'ありがとう', 'すみません'],
        correctAnswer: 'さようなら',
        englishTranslation: 'Sayōnara is used when parting for a long time or formally.',
      },
      {
        id: '1-3',
        type: 'fill_blank',
        question: 'Type the Japanese word for "Hello" (Hint: type konnichiwa)',
        correctAnswer: 'こんにちは',
        englishTranslation: 'Hello / Good afternoon',
      }
    ]
  },
  {
    id: '2',
    unit: 'Unit 1.2',
    title: 'Good Evening, Good Night',
    description: 'Learn to greet your neighbors and wish them a good night.',
    level: 'A1',
    exercises: [
      {
        id: '2-1',
        type: 'reading',
        question: 'How do you say "Good evening"?',
        correctAnswer: 'こんばんは',
        englishTranslation: 'Konbanwa is the standard evening greeting.',
      },
      {
        id: '2-2',
        type: 'multiple_choice',
        question: 'What do you say when going to bed?',
        options: ['こんにちは', 'こんばんは', 'おやすみなさい', 'さようなら'],
        correctAnswer: 'おやすみなさい',
        englishTranslation: 'Oyasuminasai means "good night".',
      }
    ]
  },
  {
    id: '3',
    unit: 'Unit 1.3',
    title: 'A Small Favor: How to Ask Politely',
    description: 'Learn how to politely ask a stranger for a favor.',
    level: 'A1',
  },
  {
    id: '4',
    unit: 'Unit 1.4',
    title: 'The Politeness Cycle: Thank You and You\'re Welcome',
    description: 'You will play a customer at a shop practicing gratitude expressions.',
    level: 'A1',
  },
  {
    id: '5',
    unit: 'Unit 1.5',
    title: 'Entering and Exiting with Respect',
    description: 'Learn phrases used at workplaces and homes.',
    level: 'A1',
  },
];
