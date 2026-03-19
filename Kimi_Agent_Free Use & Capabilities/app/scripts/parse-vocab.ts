import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Save your raw PDF text of the Vocabulary Index into `raw-vocab.txt`
//    inside the `scripts` folder.
// 2. The script expects lines like: "あさ [朝] 4 morning" or "あさって 4 day after tomorrow"
// 3. Run this script using: `npx tsx scripts/parse-vocab.ts`
// ---------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Vocabulary {
    kanji: string;
    reading: string;
    english: string;
}

function parseVocabularyIndex(): void {
    const rawFilePath = path.join(__dirname, 'raw-vocab.txt');
    const outFilePath = path.join(__dirname, '../src/data/minnaVocabMap.json');

    if (!fs.existsSync(rawFilePath)) {
        console.error(`❌ Error: Could not find raw-vocab.txt at ${rawFilePath}`);
        console.error('Please create this file and paste your PDF vocabulary index text into it.');
        process.exit(1);
    }

    const rawText = fs.readFileSync(rawFilePath, 'utf-8');
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Map: lessonNumber -> Vocabulary[]
    const vocabMap = new Map<number, Vocabulary[]>();

    // This regex attempts to match common Minna no Nihongo index formats:
    // Format 1: あさ [朝] 4 morning
    // Format 2: あさって 4 day after tomorrow
    // Group 1: Reading (Kana)
    // Group 2: Kanji (Optional, inside brackets)
    // Group 3: Lesson Number
    // Group 4: English Meaning
    const regex = /^([ぁ-んァ-ンー]+)(?:\s+\[(.*?)\])?\s+(\d+)\s+(.+)$/;

    let successCount = 0;
    let failCount = 0;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const reading = match[1].trim();
            const kanji = match[2] ? match[2].trim() : reading; // Fallback to reading if no kanji
            const lessonNumber = parseInt(match[3], 10);
            const english = match[4].trim();

            const vocabObj: Vocabulary = { kanji, reading, english };

            if (!vocabMap.has(lessonNumber)) {
                vocabMap.set(lessonNumber, []);
            }
            vocabMap.get(lessonNumber)!.push(vocabObj);
            successCount++;
        } else {
            console.warn(`⚠️ Skipping unparseable line: "${line}"`);
            failCount++;
        }
    }

    // Convert Map to a standard Record/Object so it can be JSON serialized
    const outputRecord: Record<number, Vocabulary[]> = {};
    vocabMap.forEach((vocabList, lesson) => {
        outputRecord[lesson] = vocabList;
    });

    fs.writeFileSync(outFilePath, JSON.stringify(outputRecord, null, 2));

    console.log(`\n✅ Parsing Complete!`);
    console.log(`Parsed ${successCount} vocabulary words across ${vocabMap.size} lessons.`);
    if (failCount > 0) {
        console.log(`Failed to parse ${failCount} lines. Please double-check your raw-vocab.txt format.`);
    }
    console.log(`Saved structured Map to: ${outFilePath}`);
}

parseVocabularyIndex();
