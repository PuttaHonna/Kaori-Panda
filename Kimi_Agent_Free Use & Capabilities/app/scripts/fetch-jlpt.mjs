import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = [5, 4, 3, 2, 1];
const outDir = path.resolve(__dirname, '../public/jlpt');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

console.log('Fetching JLPT vocabulary from wkei API...');

async function fetchLevel(level) {
    return new Promise((resolve, reject) => {
        const url = `https://jlpt-vocab-api.vercel.app/api/words?level=${level}&limit=5000`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);

                    if (json.words && json.words.length > 0) {
                        const filePath = path.join(outDir, `n${level}.json`);
                        fs.writeFileSync(filePath, JSON.stringify(json.words, null, 2));
                        console.log(`Saved ${json.words.length} words to n${level}.json`);
                        resolve();
                    } else {
                        console.error(`Received 0 words for N${level}`);
                        resolve();
                    }
                } catch (e) {
                    console.error(`Failed parsing N${level}:`, e.message);
                    resolve();
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    for (const level of levels) {
        await fetchLevel(level);
    }
    console.log('Finished downloading all JLPT datasets!');
}

run();
