import type { Lesson, Exercise } from '@/types';
import minnaData from '@/data/minnaN5.json';

// In a real app we'd map over minnaData.lessons.
// Since we only have a partial JSON currently, we'll cast it to unknown to avoid strict type errors for now.
const data: unknown = minnaData;

interface MinnaDataLesson {
    lessonNumber: number;
    topic: string;
    grammar: string;
    key_vocab?: string[];
}

export function getMinnaLessons(): Lesson[] {
    const typedData = data as { lessons: MinnaDataLesson[], level: string };
    return typedData.lessons.map((lesson: MinnaDataLesson) => {

        const exercises: Exercise[] = [];

        // 1. Grammar reading exercise
        exercises.push({
            id: `minna-${lesson.lessonNumber}-grammar`,
            type: 'reading',
            question: `Grammar Focus: ${lesson.topic}`,
            correctAnswer: lesson.grammar,
            englishTranslation: lesson.topic,
        });

        // 2. Vocabulary exercises (mix of reading and fill-in-blank)
        if (lesson.key_vocab && Array.isArray(lesson.key_vocab)) {
            lesson.key_vocab.forEach((word: string, i: number) => {
                if (i % 2 === 0) {
                    exercises.push({
                        id: `minna-${lesson.lessonNumber}-vocab-${i}`,
                        type: 'reading',
                        question: `New Vocabulary`,
                        correctAnswer: word,
                        englishTranslation: 'Practice reading this word out loud.'
                    });
                } else {
                    exercises.push({
                        id: `minna-${lesson.lessonNumber}-vocab-${i}`,
                        type: 'fill_blank',
                        question: `Type the hiragana for: ${word}`,
                        correctAnswer: word,
                        englishTranslation: `Correct answer was ${word}`
                    });
                }
            });
        }

        return {
            id: `MINNA-L${lesson.lessonNumber}`,
            unit: `Lesson ${lesson.lessonNumber}`,
            title: lesson.topic,
            description: `Grammar Point: ${lesson.grammar}`,
            level: typedData.level,
            exercises,
        };
    });
}
