export interface DictionaryEntry {
    id: string;
    japanese: string;
    romaji: string;
    english: string;
    type: string;
}

export const dictionaryData: DictionaryEntry[] = [
    // Greetings
    { id: 'd1', japanese: 'こんにちは', romaji: 'Konnichiwa', english: 'Hello / Good afternoon', type: 'greeting' },
    { id: 'd2', japanese: 'おはようございます', romaji: 'Ohayou gozaimasu', english: 'Good morning', type: 'greeting' },
    { id: 'd3', japanese: 'こんばんは', romaji: 'Konbanwa', english: 'Good evening', type: 'greeting' },
    { id: 'd4', japanese: 'さようなら', romaji: 'Sayounara', english: 'Goodbye', type: 'greeting' },
    { id: 'd5', japanese: 'ありがとうございます', romaji: 'Arigatou gozaimasu', english: 'Thank you very much', type: 'phrase' },
    { id: 'd6', japanese: 'すみません', romaji: 'Sumimasen', english: 'Excuse me / Sorry', type: 'phrase' },
    { id: 'd7', japanese: 'はじめまして', romaji: 'Hajimemashite', english: 'Nice to meet you', type: 'phrase' },
    { id: 'd8', japanese: 'よろしくおねがいします', romaji: 'Yoroshiku onegaishimasu', english: 'Please treat me well', type: 'phrase' },

    // Common verbs
    { id: 'd9', japanese: '食べる', romaji: 'taberu', english: 'to eat', type: 'verb' },
    { id: 'd10', japanese: '飲む', romaji: 'nomu', english: 'to drink', type: 'verb' },
    { id: 'd11', japanese: '行く', romaji: 'iku', english: 'to go', type: 'verb' },
    { id: 'd12', japanese: '来る', romaji: 'kuru', english: 'to come', type: 'verb' },
    { id: 'd13', japanese: '見る', romaji: 'miru', english: 'to see / watch', type: 'verb' },
    { id: 'd14', japanese: '聞く', romaji: 'kiku', english: 'to listen / ask', type: 'verb' },
    { id: 'd15', japanese: '話す', romaji: 'hanasu', english: 'to speak', type: 'verb' },
    { id: 'd16', japanese: '読む', romaji: 'yomu', english: 'to read', type: 'verb' },
    { id: 'd17', japanese: '書く', romaji: 'kaku', english: 'to write', type: 'verb' },

    // Adjectives
    { id: 'd18', japanese: '大きい', romaji: 'ookii', english: 'big', type: 'adjective' },
    { id: 'd19', japanese: '小さい', romaji: 'chiisai', english: 'small', type: 'adjective' },
    { id: 'd20', japanese: 'いい / よい', romaji: 'ii / yoi', english: 'good', type: 'adjective' },
    { id: 'd21', japanese: '悪い', romaji: 'warui', english: 'bad', type: 'adjective' },
    { id: 'd22', japanese: '新しい', romaji: 'atarashii', english: 'new', type: 'adjective' },
    { id: 'd23', japanese: '古い', romaji: 'furui', english: 'old', type: 'adjective' },

    // Nouns
    { id: 'd24', japanese: '日本語', romaji: 'nihongo', english: 'Japanese language', type: 'noun' },
    { id: 'd25', japanese: '友達', romaji: 'tomodachi', english: 'friend', type: 'noun' },
    { id: 'd26', japanese: '学校', romaji: 'gakkou', english: 'school', type: 'noun' },
    { id: 'd27', japanese: '仕事', romaji: 'shigoto', english: 'work / job', type: 'noun' },
    { id: 'd28', japanese: '時間', romaji: 'jikan', english: 'time', type: 'noun' },
    { id: 'd29', japanese: '水', romaji: 'mizu', english: 'water', type: 'noun' },
    { id: 'd30', japanese: 'お金', romaji: 'okane', english: 'money', type: 'noun' },
];
