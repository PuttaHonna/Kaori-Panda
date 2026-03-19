import type { Lesson, Exercise } from '@/types';

export interface JLPTWord {
    word: string;
    meaning: string;
    furigana: string;
    romaji: string;
    level: number;
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function generateJLPTChapters(level: number, words: JLPTWord[]): Lesson[] {
    const WORDS_PER_CHAPTER = 20;
    const chapters: Lesson[] = [];

    for (let i = 0; i < words.length; i += WORDS_PER_CHAPTER) {
        const chunk = words.slice(i, i + WORDS_PER_CHAPTER);
        const chapterNumber = Math.floor(i / WORDS_PER_CHAPTER) + 1;

        // Generate exercises for this chunk
        const exercises: Exercise[] = chunk.map((wordObj, idx) => {
            // Randomly pick exercise type based on index to ensure variety
            const typeRand = idx % 3;
            const vocabWord = wordObj.word || wordObj.furigana; // fallback if it's kana-only

            if (typeRand === 0) {
                // Reading
                return {
                    id: `n${level}-ch${chapterNumber}-${idx}`,
                    type: 'reading',
                    question: `New Word: ${vocabWord}`,
                    correctAnswer: wordObj.furigana || vocabWord,
                    englishTranslation: `${wordObj.meaning}`,
                };
            } else if (typeRand === 1) {
                // Multiple Choice: English -> Japanese
                // Pick 3 random wrong options from the SAME chapter
                const wrongOptions = shuffle(chunk.filter(w => w.word !== wordObj.word)).slice(0, 3);
                const options = shuffle([wordObj, ...wrongOptions]).map(w => w.word || w.furigana);

                return {
                    id: `n${level}-ch${chapterNumber}-${idx}`,
                    type: 'multiple_choice',
                    question: `Select the Japanese for: "${wordObj.meaning}"`,
                    options,
                    correctAnswer: vocabWord,
                    englishTranslation: `${vocabWord} (${wordObj.furigana || wordObj.romaji})`,
                };
            } else {
                // Fill in the blank: Type the hiragana reading
                return {
                    id: `n${level}-ch${chapterNumber}-${idx}`,
                    type: 'fill_blank',
                    question: `Type the reading for: ${vocabWord} (${wordObj.meaning})`,
                    correctAnswer: wordObj.furigana || vocabWord,
                    englishTranslation: `Correct reading is ${wordObj.furigana || vocabWord}`,
                };
            }
        });

        chapters.push({
            id: `N${level}-CH${chapterNumber}`,
            unit: `N${level}`,
            level: `Chapter ${chapterNumber}`,
            title: `JLPT N${level} Vocabulary - Part ${chapterNumber}`,
            description: `Learn ${chunk.length} words from the JLPT N${level} syllabus. Contains reading tests, multiple choice, and fill-in-the-blank typing.`,
            exercises
        });
    }

    return chapters;
}
