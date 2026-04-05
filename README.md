<div align="center">
  <h1>🐼 Kaori-Panda</h1>
  <p>A comprehensive, AI-powered Japanese learning application built with React, TypeScript, and Vite.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
</div>

<hr />

## 📖 About The Project

Kaori-Panda offers an interactive and engaging way to master the Japanese language through comprehensive lessons, immersive quizzes, AI-driven coaching, and competitive mini-games. Whether you're mastering Kana, tackling JLPT grammar, or practicing your pronunciation, Kaori-Panda provides a dynamic environment for learners of all levels.

## ✨ Key Features

### 🤖 AI-Powered Learning
* **🎓 AI Tutor Mode & Sensei Check**: Get real-time feedback, sentence corrections, and explanations using Google's Gemini AI.
* **🗣️ Pronunciation Coach**: Practice speaking Japanese and receive instant, actionable feedback on your pronunciation.
* **📖 Story Mode**: Immersive reading practice with interactive, AI-generated Japanese stories tailored to your level.
* **🧠 Built-in AI Quizzes**: Dynamically generated quizzes to test your understanding of current lessons and vocabulary.

### 🎮 Gamified Practice (Dojo)
Play **Solo** or challenge a friend in **Local 1v1 Split-Screen Mode**:
* **Endless Survival (Solo)**: Race against the clock to translate vocabulary; correct answers add time!
* **Word Translation Duel**: See a Japanese word and tap the correct English meaning first.
* **Hiragana Blitz**: Identify the hiragana character fastest and tap the correct romaji.
* **Romaji Typeoff**: See a hiragana character and type its romaji before your opponent does.
* **Sentence Scramble**: Arrange scrambled words into the correct Japanese sentence first.
* **Kanji Draw**: Take turns drawing Kanji characters accurately with an interactive canvas.

### 📚 Comprehensive Curriculum
* **✍️ Kanji Handwriting Recognition**: Learn and practice Kanji stroke orders effectively.
* **🇯🇵 Te-Form Challenge & Grammar Filters**: Interactive grammar challenges and structured JLPT grammar lists (e.g., N5).
* **📖 JLPT Vocabulary Integration**: Uses comprehensive vocabulary lists based on standard JLPT levels for targeted learning.

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling & UI**: Tailwind CSS, Shadcn UI, Framer Motion (for fluid animations)
* **AI Integration**: `@google/generative-ai` (Gemini API)
* **Japanese Language Tools**: `wanakana` (Kana conversion), `kuroshiro` (Furigana generation)
* **State & Forms**: React Hook Form, Zod (validation)
* **Data Visualization**: Recharts

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js (v20 or higher recommended)
* npm (comes with Node.js)
* Google Gemini API Key (Required for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/kaori-panda.git
   cd kaori-panda/app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of the `app` directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**  
   Navigate to `http://localhost:5173` in your browser to see the application.

## 🧱 Project Structure

* `src/components/` - Reusable UI components (buttons, dialogs, cards) built with Shadcn UI.
* `src/pages/` - Main application pages and routes (e.g., Dojo, Unit Page, Story Mode).
* `src/sections/` - Page sections and complex layout elements.
* `src/hooks/` - Custom React hooks for voice synthesis, AI generation, and state management.
* `src/data/` - Dictionary data, vocabulary lists, and lesson content.
* `src/types/` - Core TypeScript type definitions used across the application.
* `src/lib/` - Utility functions for Japanese parsing (wanakana/kuroshiro) and other helpers.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
