import { motion } from 'framer-motion';
import { ChevronLeft, BookOpen, MessageCircle, Volume2 } from 'lucide-react';
import { useVoiceSynthesis } from '@/hooks/useVoiceSynthesis';
import type { N5Lesson } from '@/types';

// ---- Full Genki lesson data with grammar, examples, vocabulary meanings ---
const LESSON_CONTENT: Record<number, {
    grammarPoints: Array<{
        structure: string;
        explanation: string;
        examples: Array<{ japanese: string; romaji: string; english: string }>;
    }>;
    vocabulary: Array<{ word: string; romaji: string; meaning: string; type: string }>;
}> = {
    1: {
        grammarPoints: [
            {
                structure: 'N₁ は N₂ です',
                explanation: 'The basic sentence pattern "X is Y". は (wa) is the topic marker, and です (desu) is the polite equivalent of "is/am/are".',
                examples: [
                    { japanese: 'わたしは がくせいです。', romaji: 'Watashi wa gakusei desu.', english: 'I am a student.' },
                    { japanese: 'マリーさんは アメリカじんです。', romaji: 'Marī-san wa Amerikajin desu.', english: 'Mary is American.' },
                ],
            },
            {
                structure: 'N₁ は N₂ じゃないです',
                explanation: 'The negative form. じゃないです (ja nai desu) means "is not". Use this to deny or correct.',
                examples: [
                    { japanese: 'わたしは せんせいじゃないです。', romaji: 'Watashi wa sensei ja nai desu.', english: 'I am not a teacher.' },
                ],
            },
            {
                structure: 'N₁ の N₂',
                explanation: 'The \u306e (no) connects two nouns, like the English possessive (X\'s) or "of". The first noun modifies the second.',
                examples: [
                    { japanese: 'メアリーさんの でんわばんごうは なんですか？', romaji: 'Mearī-san no denwa bangō wa nan desu ka?', english: 'What is Mary\'s phone number?' },
                ],
            },
        ],
        vocabulary: [
            { word: 'わたし', romaji: 'watashi', meaning: 'I / Me', type: 'Pronoun' },
            { word: 'あなた', romaji: 'anata', meaning: 'You', type: 'Pronoun' },
            { word: 'がくせい', romaji: 'gakusei', meaning: 'Student', type: 'Noun' },
            { word: 'せんせい', romaji: 'sensei', meaning: 'Teacher', type: 'Noun' },
            { word: 'にほん', romaji: 'Nihon', meaning: 'Japan', type: 'Noun' },
            { word: 'だいがく', romaji: 'daigaku', meaning: 'University', type: 'Noun' },
            { word: 'にほんご', romaji: 'Nihongo', meaning: 'Japanese language', type: 'Noun' },
            { word: 'なんさい', romaji: 'nan sai', meaning: 'How old?', type: 'Expression' },
            { word: 'ですか', romaji: 'desu ka', meaning: 'Question marker', type: 'Grammar' },
            { word: 'はじめまして', romaji: 'Hajimemashite', meaning: 'Nice to meet you', type: 'Expression' },
            { word: 'よろしくおねがいします', romaji: 'Yoroshiku onegai shimasu', meaning: 'Please treat me well', type: 'Expression' },
        ],
    },
    2: {
        grammarPoints: [
            {
                structure: 'これ / それ / あれ',
                explanation: 'Demonstrative pronouns. これ (kore) = this; それ (sore) = that (near listener); あれ (are) = that over there.',
                examples: [
                    { japanese: 'これは ほんです。', romaji: 'Kore wa hon desu.', english: 'This is a book.' },
                    { japanese: 'それは なんですか？', romaji: 'Sore wa nan desu ka?', english: 'What is that?' },
                ],
            },
            {
                structure: 'この / その / あの + Noun',
                explanation: 'Demonstrative adjectives used before nouns. この (this ~), その (that ~), あの (that ~ over there).',
                examples: [
                    { japanese: 'このほんは たかいです。', romaji: 'Kono hon wa takai desu.', english: 'This book is expensive.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'これ', romaji: 'kore', meaning: 'This', type: 'Pronoun' },
            { word: 'それ', romaji: 'sore', meaning: 'That (near you)', type: 'Pronoun' },
            { word: 'あれ', romaji: 'are', meaning: 'That over there', type: 'Pronoun' },
            { word: 'ほん', romaji: 'hon', meaning: 'Book', type: 'Noun' },
            { word: 'じしょ', romaji: 'jisho', meaning: 'Dictionary', type: 'Noun' },
            { word: 'とけい', romaji: 'tokei', meaning: 'Watch / Clock', type: 'Noun' },
            { word: 'かさ', romaji: 'kasa', meaning: 'Umbrella', type: 'Noun' },
            { word: 'かばん', romaji: 'kaban', meaning: 'Bag', type: 'Noun' },
            { word: 'いくら', romaji: 'ikura', meaning: 'How much?', type: 'Expression' },
            { word: 'たかい', romaji: 'takai', meaning: 'Expensive / Tall', type: 'Adjective' },
        ],
    },
    3: {
        grammarPoints: [
            {
                structure: 'Verb (ます form)',
                explanation: 'The polite form of verbs. Add ます to the verb stem for affirmative present/future, and ません for negative.',
                examples: [
                    { japanese: 'まいにち にほんごを べんきょうします。', romaji: 'Mainichi Nihongo o benkyō shimasu.', english: 'I study Japanese every day.' },
                    { japanese: 'コーヒーを のみません。', romaji: 'Kōhī o nomimasen.', english: 'I do not drink coffee.' },
                ],
            },
            {
                structure: 'Particles: を, に, で, へ',
                explanation: 'を (o) marks the direct object. に (ni) marks direction/time. で (de) marks location of action/means. へ (e) marks direction.',
                examples: [
                    { japanese: 'えきに いきます。', romaji: 'Eki ni ikimasu.', english: 'I go to the station.' },
                    { japanese: 'としょかんで ほんを よみます。', romaji: 'Toshokan de hon o yomimasu.', english: 'I read a book at the library.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'いきます', romaji: 'ikimasu', meaning: 'Go', type: 'Verb' },
            { word: 'きます', romaji: 'kimasu', meaning: 'Come', type: 'Verb' },
            { word: 'かえります', romaji: 'kaerimasu', meaning: 'Return home', type: 'Verb' },
            { word: 'のみます', romaji: 'nomimasu', meaning: 'Drink', type: 'Verb' },
            { word: 'はなします', romaji: 'hanashimasu', meaning: 'Speak / Talk', type: 'Verb' },
            { word: 'よみます', romaji: 'yomimasu', meaning: 'Read', type: 'Verb' },
            { word: 'ききます', romaji: 'kikimasu', meaning: 'Listen / Ask', type: 'Verb' },
            { word: 'えき', romaji: 'eki', meaning: 'Train station', type: 'Noun' },
            { word: 'コンビニ', romaji: 'konbini', meaning: 'Convenience store', type: 'Noun' },
            { word: 'まいにち', romaji: 'mainichi', meaning: 'Every day', type: 'Adverb' },
        ],
    },
    4: {
        grammarPoints: [
            {
                structure: 'N が あります / います',
                explanation: 'あります (arimasu) is used for inanimate objects. います (imasu) is used for living things (people, animals).',
                examples: [
                    { japanese: 'つくえの うえに ほんが あります。', romaji: 'Tsukue no ue ni hon ga arimasu.', english: 'There is a book on the desk.' },
                    { japanese: 'きょうしつに がくせいが います。', romaji: 'Kyōshitsu ni gakusei ga imasu.', english: 'There are students in the classroom.' },
                ],
            },
            {
                structure: 'Location Words',
                explanation: 'うえ (above), した (below), なか (inside), まえ (front), うしろ (behind), みぎ (right), ひだり (left), となり (next to), ちかく (near).',
                examples: [
                    { japanese: 'いぬは いすの したに います。', romaji: 'Inu wa isu no shita ni imasu.', english: 'The dog is under the chair.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'あります', romaji: 'arimasu', meaning: 'There is/are (things)', type: 'Verb' },
            { word: 'います', romaji: 'imasu', meaning: 'There is/are (living)', type: 'Verb' },
            { word: 'みぎ', romaji: 'migi', meaning: 'Right', type: 'Noun' },
            { word: 'ひだり', romaji: 'hidari', meaning: 'Left', type: 'Noun' },
            { word: 'まえ', romaji: 'mae', meaning: 'Front / Before', type: 'Noun' },
            { word: 'うしろ', romaji: 'ushiro', meaning: 'Behind / Back', type: 'Noun' },
            { word: 'うえ', romaji: 'ue', meaning: 'On top / Above', type: 'Noun' },
            { word: 'した', romaji: 'shita', meaning: 'Below / Under', type: 'Noun' },
            { word: 'なか', romaji: 'naka', meaning: 'Inside', type: 'Noun' },
            { word: 'となり', romaji: 'tonari', meaning: 'Next to', type: 'Noun' },
        ],
    },
    5: {
        grammarPoints: [
            {
                structure: 'い-adjective / な-adjective + です',
                explanation: 'い-adjectives end in い (e.g., たかい = expensive). な-adjectives need な before a noun (e.g., きれいな = beautiful). Both add です for politeness.',
                examples: [
                    { japanese: 'このとけいは たかいです。', romaji: 'Kono tokei wa takai desu.', english: 'This watch is expensive.' },
                    { japanese: 'えは きれいです。', romaji: 'E wa kirei desu.', english: 'The painting is beautiful.' },
                ],
            },
            {
                structure: 'N が すきです / きらいです',
                explanation: 'Expresses likes and dislikes. すき (suki) = like, きらい (kirai) = dislike. Use the particle が.',
                examples: [
                    { japanese: 'わたしは すしが すきです。', romaji: 'Watashi wa sushi ga suki desu.', english: 'I like sushi.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'あたらしい', romaji: 'atarashii', meaning: 'New', type: 'い-Adjective' },
            { word: 'ふるい', romaji: 'furui', meaning: 'Old (not for people)', type: 'い-Adjective' },
            { word: 'あつい', romaji: 'atsui', meaning: 'Hot', type: 'い-Adjective' },
            { word: 'さむい', romaji: 'samui', meaning: 'Cold (weather)', type: 'い-Adjective' },
            { word: 'たのしい', romaji: 'tanoshii', meaning: 'Fun / Enjoyable', type: 'い-Adjective' },
            { word: 'むずかしい', romaji: 'muzukashii', meaning: 'Difficult', type: 'い-Adjective' },
            { word: 'きれい', romaji: 'kirei', meaning: 'Beautiful / Clean', type: 'な-Adjective' },
            { word: 'にぎやか', romaji: 'nigiyaka', meaning: 'Lively / Bustling', type: 'な-Adjective' },
            { word: 'しずか', romaji: 'shizuka', meaning: 'Quiet', type: 'な-Adjective' },
            { word: 'すき', romaji: 'suki', meaning: 'Like / Fond of', type: 'な-Adjective' },
        ],
    },
    6: {
        grammarPoints: [
            {
                structure: 'Te-form (〜て / 〜で)',
                explanation: 'The Te-form connects verbs and adjectives. It is essential for many grammar patterns. Formation varies by verb group.',
                examples: [
                    { japanese: 'まどを あけてください。', romaji: 'Mado o akete kudasai.', english: 'Please open the window.' },
                    { japanese: 'ここで たべてもいいですか？', romaji: 'Koko de tabete mo ii desu ka?', english: 'May I eat here?' },
                ],
            },
            {
                structure: 'Te-form + ください',
                explanation: 'Use Te-form + ください (kudasai) to politely ask someone to do something.',
                examples: [
                    { japanese: 'ちょっと まってください。', romaji: 'Chotto matte kudasai.', english: 'Please wait a moment.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'あける', romaji: 'akeru', meaning: 'Open', type: 'Verb' },
            { word: 'しめる', romaji: 'shimeru', meaning: 'Close / Shut', type: 'Verb' },
            { word: 'つける', romaji: 'tsukeru', meaning: 'Turn on', type: 'Verb' },
            { word: 'けす', romaji: 'kesu', meaning: 'Turn off / Erase', type: 'Verb' },
            { word: 'すわる', romaji: 'suwaru', meaning: 'Sit down', type: 'Verb' },
            { word: 'たつ', romaji: 'tatsu', meaning: 'Stand up', type: 'Verb' },
            { word: 'まつ', romaji: 'matsu', meaning: 'Wait', type: 'Verb' },
            { word: 'ください', romaji: 'kudasai', meaning: 'Please give me / Please do', type: 'Expression' },
            { word: 'まど', romaji: 'mado', meaning: 'Window', type: 'Noun' },
            { word: 'ちょっと', romaji: 'chotto', meaning: 'A little / Excuse me', type: 'Adverb' },
        ],
    },
    7: {
        grammarPoints: [
            {
                structure: '〜ています',
                explanation: 'Te-form + います describes an ongoing action (like English "-ing") OR a resulting state. Context determines which meaning.',
                examples: [
                    { japanese: 'いまなにを していますか？', romaji: 'Ima nani o shite imasu ka?', english: 'What are you doing right now?' },
                    { japanese: 'ははは びょういんで はたらいています。', romaji: 'Haha wa byōin de hataraite imasu.', english: 'My mother works at a hospital.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'うたう', romaji: 'utau', meaning: 'Sing', type: 'Verb' },
            { word: 'はたらく', romaji: 'hataraku', meaning: 'Work', type: 'Verb' },
            { word: 'すむ', romaji: 'sumu', meaning: 'Live / Reside', type: 'Verb' },
            { word: 'しる', romaji: 'shiru', meaning: 'Know / Find out', type: 'Verb' },
            { word: 'かぞく', romaji: 'kazoku', meaning: 'Family', type: 'Noun' },
            { word: 'りょうしん', romaji: 'ryōshin', meaning: 'Parents', type: 'Noun' },
            { word: 'ちち / おとうさん', romaji: 'chichi / otōsan', meaning: 'Father (own / someone else\'s)', type: 'Noun' },
            { word: 'はは / おかあさん', romaji: 'haha / okāsan', meaning: 'Mother (own / other)', type: 'Noun' },
            { word: 'あに / おにいさん', romaji: 'ani / onīsan', meaning: 'Older brother', type: 'Noun' },
            { word: 'いま', romaji: 'ima', meaning: 'Now', type: 'Adverb' },
        ],
    },
    8: {
        grammarPoints: [
            {
                structure: 'Plain / Short Forms',
                explanation: 'Short forms are used in casual speech and many grammar patterns. Verbs have four short forms: present affirmative (dictionary form), present negative, past affirmative, past negative.',
                examples: [
                    { japanese: 'あした あめが ふる？', romaji: 'Ashita ame ga furu?', english: 'Will it rain tomorrow? (casual)' },
                ],
            },
            {
                structure: '〜と おもいます',
                explanation: 'Short form + と おもいます means "I think that...". Use the short form (plain form) of the verb/adjective before と.',
                examples: [
                    { japanese: 'メアリーさんは くるとおもいます。', romaji: 'Mearī-san wa kuru to omoimasu.', english: 'I think Mary will come.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'あらう', romaji: 'arau', meaning: 'Wash', type: 'Verb' },
            { word: 'おもう', romaji: 'omou', meaning: 'Think', type: 'Verb' },
            { word: 'いう', romaji: 'iu', meaning: 'Say', type: 'Verb' },
            { word: 'でる', romaji: 'deru', meaning: 'Go out / Leave', type: 'Verb' },
            { word: 'おそい', romaji: 'osoi', meaning: 'Late / Slow', type: 'い-Adjective' },
            { word: 'すごい', romaji: 'sugoi', meaning: 'Amazing / Wow', type: 'い-Adjective' },
            { word: 'バーベキュ', romaji: 'bābekyu', meaning: 'Barbecue', type: 'Noun' },
            { word: 'たぶん', romaji: 'tabun', meaning: 'Perhaps / Maybe', type: 'Adverb' },
            { word: 'でも', romaji: 'demo', meaning: 'But / However', type: 'Conjunction' },
            { word: 'もちろん', romaji: 'mochiron', meaning: 'Of course', type: 'Adverb' },
        ],
    },
    9: {
        grammarPoints: [
            {
                structure: '〜たことがあります',
                explanation: 'Ta-form + ことがあります means "I have had the experience of...". Use this to talk about things you have done before.',
                examples: [
                    { japanese: 'すしを たべたことが あります。', romaji: 'Sushi o tabeta koto ga arimasu.', english: 'I have eaten sushi before.' },
                    { japanese: 'にほんへ いったことが ありません。', romaji: 'Nihon e itta koto ga arimasen.', english: 'I have never been to Japan.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'おどる', romaji: 'odoru', meaning: 'Dance', type: 'Verb' },
            { word: 'のぼる', romaji: 'noboru', meaning: 'Climb', type: 'Verb' },
            { word: 'はじまる', romaji: 'hajimaru', meaning: 'Begin / Start', type: 'Verb' },
            { word: 'おわる', romaji: 'owaru', meaning: 'End / Finish', type: 'Verb' },
            { word: 'かぶき', romaji: 'kabuki', meaning: 'Kabuki theater', type: 'Noun' },
            { word: 'にんき', romaji: 'ninki', meaning: 'Popularity', type: 'Noun' },
            { word: 'にんきがある', romaji: 'ninki ga aru', meaning: 'Popular', type: 'Expression' },
            { word: 'ことがある', romaji: 'koto ga aru', meaning: 'Have experience of', type: 'Grammar' },
            { word: 'いちど', romaji: 'ichido', meaning: 'Once / One time', type: 'Adverb' },
            { word: 'じかん', romaji: 'jikan', meaning: 'Time', type: 'Noun' },
        ],
    },
    10: {
        grammarPoints: [
            {
                structure: 'N₁ と N₂ と どちらが〜',
                explanation: 'Comparing two items: "Which is more ~, A or B?" Use どちら (dochira) for formal speech or どっち (docchi) for casual.',
                examples: [
                    { japanese: 'すしと てんぷら どちらが すきですか？', romaji: 'Sushi to tenpura, dochira ga suki desu ka?', english: 'Which do you like better, sushi or tempura?' },
                ],
            },
            {
                structure: 'N₁ は N₂ より〜',
                explanation: 'Comparing that one thing is more ~ than another. より (yori) means "than".',
                examples: [
                    { japanese: 'バスよりでんしゃのほうが はやいです。', romaji: 'Basu yori densha no hō ga hayai desu.', english: 'The train is faster than the bus.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'きせつ', romaji: 'kisetsu', meaning: 'Season', type: 'Noun' },
            { word: 'はる', romaji: 'haru', meaning: 'Spring', type: 'Noun' },
            { word: 'なつ', romaji: 'natsu', meaning: 'Summer', type: 'Noun' },
            { word: 'あき', romaji: 'aki', meaning: 'Autumn / Fall', type: 'Noun' },
            { word: 'ふゆ', romaji: 'fuyu', meaning: 'Winter', type: 'Noun' },
            { word: 'どちら', romaji: 'dochira', meaning: 'Which (of two)', type: 'Question' },
            { word: 'より', romaji: 'yori', meaning: 'Than', type: 'Particle' },
            { word: 'はやい', romaji: 'hayai', meaning: 'Fast / Early', type: 'い-Adjective' },
            { word: 'おそい', romaji: 'osoi', meaning: 'Slow / Late', type: 'い-Adjective' },
            { word: 'いちばん', romaji: 'ichiban', meaning: 'Most / Best / Number one', type: 'Adverb' },
        ],
    },
    11: {
        grammarPoints: [
            {
                structure: '〜たい',
                explanation: 'Verb stem + たい (tai) means "want to do...". It is conjugated like an い-adjective.',
                examples: [
                    { japanese: 'にほんへ いきたいです。', romaji: 'Nihon e ikitai desu.', english: 'I want to go to Japan.' },
                    { japanese: 'なにが たべたいですか？', romaji: 'Nani ga tabetai desu ka?', english: 'What do you want to eat?' },
                ],
            },
            {
                structure: '〜たり〜たりします',
                explanation: 'List of representative actions from a larger set. Ta-form + たり repeated, then します. Means "do things like ~ and ~".',
                examples: [
                    { japanese: 'しゅうまつは えいがをみたり、ほんをよんだり します。', romaji: 'Shūmatsu wa eiga o mitari, hon o yondari shimasu.', english: 'On weekends, I do things like watch movies and read books.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'おまつり', romaji: 'omatsuri', meaning: 'Festival', type: 'Noun' },
            { word: 'おしょうがつ', romaji: 'Oshōgatsu', meaning: 'New Year', type: 'Noun' },
            { word: 'おかし', romaji: 'okashi', meaning: 'Sweets / Snacks', type: 'Noun' },
            { word: 'おもちゃ', romaji: 'omocha', meaning: 'Toy', type: 'Noun' },
            { word: 'アルバイト', romaji: 'arubaito', meaning: 'Part-time job', type: 'Noun' },
            { word: 'きもの', romaji: 'kimono', meaning: 'Kimono', type: 'Noun' },
            { word: 'ゆき', romaji: 'yuki', meaning: 'Snow', type: 'Noun' },
            { word: 'たい', romaji: 'tai', meaning: 'Want to (do)', type: 'Grammar' },
            { word: 'みんな', romaji: 'minna', meaning: 'Everybody', type: 'Pronoun' },
            { word: 'ほしい', romaji: 'hoshii', meaning: 'Want (object)', type: 'い-Adjective' },
        ],
    },
    12: {
        grammarPoints: [
            {
                structure: '〜んです',
                explanation: '〜んです (n desu) explains the reason or background of a situation. It conveys "The thing is..." or "You see...". It creates a sense of shared understanding.',
                examples: [
                    { japanese: 'あたまが いたいんです。', romaji: 'Atama ga itain desu.', english: 'The thing is, I have a headache.' },
                    { japanese: 'どうして きませんでしたか？ ─ びょうきだったんです。', romaji: 'Dōshite kimasen deshita ka? — Byōki dattan desu.', english: 'Why didn\'t you come? — It\'s because I was sick.' },
                ],
            },
            {
                structure: '〜すぎる',
                explanation: 'Verb/Adjective stem + すぎる means "too much / excessively ~".',
                examples: [
                    { japanese: 'たべすぎました。', romaji: 'Tabesugimashita.', english: 'I ate too much.' },
                    { japanese: 'このもんだいは むずかしすぎます。', romaji: 'Kono mondai wa muzukashi sugimasu.', english: 'This problem is too difficult.' },
                ],
            },
            {
                structure: '〜ほうがいいです',
                explanation: 'Ta-form of verb + ほうがいいです means "You had better do...". Used to give advice.',
                examples: [
                    { japanese: 'くすりをのんだほうが いいですよ。', romaji: 'Kusuri o nonda hō ga ii desu yo.', english: 'You had better take medicine.' },
                ],
            },
        ],
        vocabulary: [
            { word: 'おなか', romaji: 'onaka', meaning: 'Stomach / Belly', type: 'Noun' },
            { word: 'あし', romaji: 'ashi', meaning: 'Leg / Foot', type: 'Noun' },
            { word: 'のど', romaji: 'nodo', meaning: 'Throat', type: 'Noun' },
            { word: 'は', romaji: 'ha', meaning: 'Tooth', type: 'Noun' },
            { word: 'びょうき', romaji: 'byōki', meaning: 'Illness / Sick', type: 'Noun' },
            { word: 'かぜ', romaji: 'kaze', meaning: 'Cold (illness)', type: 'Noun' },
            { word: 'インフルエンザ', romaji: 'infuruenza', meaning: 'Influenza / Flu', type: 'Noun' },
            { word: 'くすり', romaji: 'kusuri', meaning: 'Medicine', type: 'Noun' },
            { word: 'いたい', romaji: 'itai', meaning: 'Painful / It hurts', type: 'い-Adjective' },
            { word: 'たいへん', romaji: 'taihen', meaning: 'Tough / Serious situation', type: 'な-Adjective' },
        ],
    },
};

const typeColors: Record<string, string> = {
    'Verb': 'bg-blue-50 text-blue-700 border-blue-200',
    'Noun': 'bg-gray-50 text-gray-700 border-gray-200',
    'Pronoun': 'bg-purple-50 text-purple-700 border-purple-200',
    'い-Adjective': 'bg-orange-50 text-orange-700 border-orange-200',
    'な-Adjective': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Adjective': 'bg-amber-50 text-amber-700 border-amber-200',
    'Adverb': 'bg-teal-50 text-teal-700 border-teal-200',
    'Particle': 'bg-rose-50 text-rose-700 border-rose-200',
    'Expression': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Grammar': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Question': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Conjunction': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
};

interface LessonReaderPageProps {
    lesson: N5Lesson;
    onBack: () => void;
    onPractice: () => void;
}

export function LessonReaderPage({ lesson, onBack, onPractice }: LessonReaderPageProps) {
    const { speak, isSpeaking } = useVoiceSynthesis();
    const content = LESSON_CONTENT[lesson.lessonNumber];

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden"
        >
            {/* Header */}
            <header className="flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-bamboo-600 uppercase tracking-widest">LESSON {lesson.lessonNumber}</p>
                    <h1 className="text-base font-bold text-gray-900 leading-tight truncate">{lesson.title}</h1>
                </div>
                <button
                    onClick={onPractice}
                    className="flex items-center gap-2 px-4 py-2 bg-bamboo-500 hover:bg-bamboo-600 text-white rounded-full text-sm font-semibold transition-colors"
                >
                    <MessageCircle className="w-4 h-4" />
                    Practice
                </button>
            </header>

            <div className="flex-1 overflow-y-auto">
                {content ? (
                    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-10">

                        {/* Grammar Points */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-5 h-5 text-bamboo-600" />
                                <h2 className="text-lg font-bold text-gray-900">Grammar Points</h2>
                            </div>
                            <div className="space-y-4">
                                {content.grammarPoints.map((gp, i) => (
                                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        {/* Structure header */}
                                        <div className="bg-bamboo-50 border-b border-bamboo-100 px-4 py-3">
                                            <h3 className="font-bold text-bamboo-800 text-base jp-text">{gp.structure}</h3>
                                        </div>
                                        {/* Explanation */}
                                        <div className="px-4 pt-3 pb-2">
                                            <p className="text-gray-700 text-sm leading-relaxed">{gp.explanation}</p>
                                        </div>
                                        {/* Examples */}
                                        <div className="px-4 pb-4 space-y-3 mt-1">
                                            {gp.examples.map((ex, j) => (
                                                <div key={j} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="jp-text text-gray-900 font-semibold text-base leading-relaxed flex-1">{ex.japanese}</p>
                                                        <button
                                                            onClick={() => speak(ex.japanese)}
                                                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-bamboo-50 transition-colors"
                                                        >
                                                            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-bamboo-500' : 'text-gray-500'}`} />
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-500 text-sm mt-1">{ex.romaji}</p>
                                                    <p className="text-gray-700 text-sm mt-0.5 font-medium">{ex.english}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Vocabulary */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3">📚 Vocabulary</h2>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                                {content.vocabulary.map((v, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                                        <button
                                            onClick={() => speak(v.word)}
                                            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-bamboo-50 transition-colors flex-shrink-0"
                                        >
                                            <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <span className="jp-text font-bold text-gray-900 text-base">{v.word}</span>
                                            <span className="text-gray-400 text-sm ml-2">{v.romaji}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-gray-700 text-sm font-medium">{v.meaning}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeColors[v.type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {v.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Practice CTA */}
                        <button
                            onClick={onPractice}
                            className="w-full py-4 bg-bamboo-500 hover:bg-bamboo-600 text-white font-bold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 text-base"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Practice this Lesson with Kaori
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
                        <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                        <p className="font-semibold">Content coming soon!</p>
                        <p className="text-sm mt-1">Practice with Kaori to learn this lesson.</p>
                        <button
                            onClick={onPractice}
                            className="mt-6 px-6 py-3 bg-bamboo-500 text-white rounded-full font-semibold hover:bg-bamboo-600 transition-colors"
                        >
                            Practice with AI
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
