import csv
import json
import os

CSV_PATH = r"C:\Users\user\.cache\kagglehub\datasets\robinpourtaud\jlpt-words-by-level\versions\1\jlpt_vocab.csv"
OUTPUT_PATH = r"c:\Users\user\projects\sakura japa\Kimi_Agent_Free Use & Capabilities\app\src\data\jlptVocab.ts"

# Data schema: JLPTLevel -> chapters -> words
levels_data = {
    "N5": [],
    "N4": [],
    "N3": [],
    "N2": [],
    "N1": []
}

with open(CSV_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        original = row.get("Original", "").strip()
        furigana = row.get("Furigana", "").strip()
        english = row.get("English", "").strip()
        level = row.get("JLPT Level", "").strip()
        
        # If any of these are missing and it's not a header row
        # (Though some words might not have kanji, Original might contain hiragana. If Furigana is empty, we just use Original as reading)
        if original and level in levels_data:
            levels_data[level].append({
                "word": original,
                "reading": furigana if furigana else original,
                "meaning": english
            })

# Reorder N5 to N1 (Kaggle might have them in N1 to N5 order)
jlpt_levels = []
for level in ["N5", "N4", "N3", "N2", "N1"]:
    words = levels_data[level]
    chapters = []
    
    CHUNK_SIZE = 50
    for i in range(0, len(words), CHUNK_SIZE):
        chunk = words[i:i + CHUNK_SIZE]
        chapter_title = f"{level} Set {(i // CHUNK_SIZE) + 1}"
        chapters.append({
            "title": chapter_title,
            "words": chunk
        })
        
    jlpt_levels.append({
        "level": f"JLPT {level} (Kaggle)",
        "chapters": chapters
    })

# Write to TypeScript file
ts_content = f"""export interface JLPTWord {{
    word: string;
    reading: string;
    meaning: string;
}}

export interface JLPTChapter {{
    title: string;
    words: JLPTWord[];
}}

export interface JLPTLevel {{
    level: string; // Course/Textbook Name
    chapters: JLPTChapter[];
}}

export const JLPT_DATA: JLPTLevel[] = {json.dumps(jlpt_levels, ensure_ascii=False, indent=4)};
"""

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully converted dataset and wrote to {OUTPUT_PATH}")
