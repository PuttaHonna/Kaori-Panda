export interface Example {
    jp: string;
    en: string;
}

export interface ChapterGrammar {
    rule: string;
    explanation: string;
    examples: Example[];
}

export interface Vocabulary {
    kanji: string;
    reading: string;
    english: string;
}

export interface N5Lesson {
    lessonNumber: number;
    title: string;
    grammar: ChapterGrammar[];
    vocabulary: Vocabulary[];
}
