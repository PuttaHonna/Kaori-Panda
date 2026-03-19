// Removed unused wanakana imports

/**
 * Converts a Japanese verb into its て (te) form.
 * Supports both dictionary forms (e.g., 書く, およぐ) and ます (masu) forms (e.g., 書きます, およぎます).
 * Handles Group 1 exceptions like 行く/行きます -> 行って.
 * 
 * @param verb The verb as a string (kanji + kana or pure kana).
 * @param group The verb group (1, 2, or 3).
 * @returns The converted verb in te-form.
 */
export function convertToTeForm(verb: string, group: 1 | 2 | 3): string {
    // Basic sanitization
    verb = verb.trim();
    if (!verb) return '';

    // Convert input to pure hiragana for rule checking, but we also want to preserve kanji in the output loop
    // To do this simply: extract the trailing kana to determine the ending, then slice the original string.
    const isMasu = verb.endsWith('ます');

    // Group 3: Irregular verbs (する / くる)
    if (group === 3) {
        if (isMasu) {
            if (verb.endsWith('きます')) return verb.slice(0, -3) + 'きて'; // きます -> きて (or Kanji 来ます -> 来て)
            if (verb.endsWith('します')) return verb.slice(0, -3) + 'して'; // します -> して (or Kanji します -> して)
        } else {
            if (verb.endsWith('くる')) return verb.slice(0, -2) + 'きて'; // くる -> きて
            if (verb.endsWith('する')) return verb.slice(0, -2) + 'して'; // する -> して (e.g., 勉強する -> 勉強して)
        }
    }

    // Group 2: Ichidan verbs (Drop る / ます, add て)
    if (group === 2) {
        if (isMasu) {
            return verb.slice(0, -2) + 'て'; // ます -> て
        } else {
            return verb.slice(0, -1) + 'て'; // る -> て
        }
    }

    // Group 1: Godan verbs
    if (group === 1) {
        // Handle explicit exceptions first (行く -> 行って)
        if (verb === '行く' || verb === 'いく') return verb.slice(0, -1) + 'って';
        if (verb === '行きます' || verb === 'いきます') return verb.slice(0, -4) + 'って';

        if (isMasu) {
            // From Masu form: looking at the character before 'ます'
            const stemLen = verb.length - 2; // slice off ます
            const stem = verb.slice(0, stemLen);
            const lastChar = stem.slice(-1); // character before ます e.g. 'い', 'き', 'み'
            const prefix = stem.slice(0, -1);

            switch (lastChar) {
                case 'い': // 会います -> 会って
                case 'ち': // 待ちます -> 待って
                case 'り': // 帰ります -> 帰って
                    return prefix + 'って';
                case 'み': // 飲みます -> 飲んで
                case 'び': // 遊びます -> 遊んで
                case 'に': // 死にます -> 死んで
                    return prefix + 'んで';
                case 'き': // 書きます -> 書いて
                    return prefix + 'いて';
                case 'ぎ': // 泳ぎます -> 泳いで
                    return prefix + 'いで';
                case 'し': // 話します -> 話して
                    return prefix + 'して';
                default:
                    return verb; // Unrecognized format, return as is
            }
        } else {
            // From Dictionary form: looking at the last character
            const lastChar = verb.slice(-1);
            const prefix = verb.slice(0, -1);

            switch (lastChar) {
                case 'う': // 会う -> 会って
                case 'つ': // 待つ -> 待って
                case 'る': // 帰る -> 帰って
                    return prefix + 'って';
                case 'む': // 飲む -> 飲んで
                case 'ぶ': // 遊ぶ -> 遊んで
                case 'ぬ': // 死ぬ -> 死んで
                    return prefix + 'んで';
                case 'く': // 書く -> 書いて
                    return prefix + 'いて';
                case 'ぐ': // 泳ぐ -> 泳いで
                    return prefix + 'いで';
                case 'す': // 話す -> 話して
                    return prefix + 'して';
                default:
                    return verb; // Unrecognized format, return as is
            }
        }
    }

    return verb;
}
