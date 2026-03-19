import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_MODULES_DICT = path.resolve(__dirname, '../node_modules/kuromoji/dict');
const PUBLIC_DICT = path.resolve(__dirname, '../public/dict');

async function copyDict() {
    try {
        // Check if source exists
        await fs.access(NODE_MODULES_DICT);

        // Create destination if it doesn't exist
        await fs.mkdir(PUBLIC_DICT, { recursive: true });

        // Read all files in source directory
        const files = await fs.readdir(NODE_MODULES_DICT);

        // Copy each file
        for (const file of files) {
            if (file.endsWith('.dat.gz')) {
                const src = path.join(NODE_MODULES_DICT, file);
                const dest = path.join(PUBLIC_DICT, file);
                await fs.copyFile(src, dest);
            }
        }

        console.log('✅ Successfully copied kuromoji dictionary files to public/dict/');
    } catch (error) {
        console.error('❌ Failed to copy dictionary files:', error);
        process.exit(1);
    }
}

copyDict();
