# 🐼 Kaori-Panda

Kaori-Panda is a comprehensive, AI-powered Japanese learning application built with React, TypeScript, and Vite. It offers an interactive and engaging way to master the Japanese language through interactive lessons, quizzes, and AI-driven coaching.

## ✨ Features

- **🎓 AI Tutor Mode & Sensei Check**: Get real-time feedback and corrections on your Japanese sentences using Google's Gemini AI.
- **🗣️ Pronunciation Coach**: Practice speaking Japanese and get instant feedback on your pronunciation.
- **📖 Story Mode**: Immersive reading practice with interactive Japanese stories.
- **✍️ Kanji Handwriting Recognition**: Learn and practice Kanji stroke orders with actual handwriting recognition.
- **🧠 Te-Form Challenge & Grammar Filters**: Interactive grammar challenges (like the Te-form) and comprehensive JLPT grammar lists (e.g., N5).
- **🥋 Dojo Games**: Fun, gamified exercises to test your vocabulary, kana, and grammar knowledge.
- **🤖 Built-in AI Quizzes**: Dynamically generated quizzes to test your understanding of current lessons.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion for animations
- **AI Integration**: `@google/generative-ai` (Gemini API)
- **Japanese Language Tools**: `wanakana` for Kana conversion, `kuroshiro` for Furigana generation
- **State & Forms**: React Hook Form, Zod for validation
- **Charts & Data**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Navigate to the project `app` directory:
   ```bash
   cd app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

To use the AI features (Sensei Check, Story Mode, etc.), you need a Google Gemini API Key.
Create a `.env.local` file in the `app` directory and add your API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Then, open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

## 🧱 Project Structure

- `src/components/`: Reusable UI components (buttons, dialogs, cards, etc.) built with Shadcn.
- `src/pages/`: Main application pages and routes (Dojo, Unit Page, Story Mode).
- `src/sections/`: Page sections and layout elements.
- `src/hooks/`: Custom React hooks, including hooks for voice synthesis and AI generation.
- `src/data/`: Dictionary data and lesson content.
- `src/types/`: TypeScript type definitions.
