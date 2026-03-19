# SakuraSpeak - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| State Management | React Context + useReducer |
| Storage | localStorage |
| Animation | Framer Motion |
| Icons | Lucide React |
| Voice Recognition | Web Speech API |

## 2. Tailwind Configuration

```javascript
// tailwind.config.js extensions
{
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FEF2F2',
          100: '#FECACA',
          200: '#FCA5A5',
          300: '#F87171',
          400: '#EF4444',
          500: '#DC2626',
        },
        jlpt: {
          n1: '#93C5FD',
          n2: '#C4B5FD',
          n3: '#86EFAC',
          n4: '#FDE047',
          n5: '#FCA5A5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-subtle 0.3s ease-in-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    }
  }
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button
- Card
- Input
- Tabs
- Badge
- Dialog
- Dropdown Menu
- Scroll Area
- Separator
- Switch
- Select

### Custom Components

#### Layout Components
| Component | Props | Description |
|-----------|-------|-------------|
| `AppLayout` | `children: ReactNode` | Main app wrapper with bottom nav |
| `BottomNav` | `activeTab: string` | Bottom navigation bar |
| `Header` | `title?: string, showBack?: boolean` | App header with logo/actions |

#### Tab Components
| Component | Props | Description |
|-----------|-------|-------------|
| `SpeakTab` | - | Main speak/learn tab |
| `KnowledgeTab` | - | Word bank, dictionary, grammar |
| `CompeteTab` | - | Leaderboard |
| `ProgressTab` | - | Stats and progress |

#### Speak Tab Components
| Component | Props | Description |
|-----------|-------|-------------|
| `DailyGoals` | `goals: Goal[]` | Daily goal cards |
| `StatsGrid` | `stats: Stats` | 2x2 stats grid |
| `LearningModeCard` | `mode: LearningMode` | Lesson/FreeSpeak/Revision card |
| `ChatInterface` | `messages: Message[]` | Full chat view |
| `VoiceInput` | `onRecord: () => void` | Mic button with hold |

#### Knowledge Tab Components
| Component | Props | Description |
|-----------|-------|-------------|
| `WordBank` | `words: Word[]` | Word list with empty state |
| `Dictionary` | `entries: DictEntry[]` | Dictionary search |
| `GrammarList` | `grammar: GrammarPoint[]` | Grammar cards list |
| `GrammarCard` | `point: GrammarPoint` | Single grammar item |
| `JLPTBadge` | `level: N1-N5` | JLPT level badge |

#### Progress Components
| Component | Props | Description |
|-----------|-------|-------------|
| `ProfileCard` | `user: User` | Name input card |
| `StreakCounter` | `days: number` | Large streak display |
| `StatRow` | `icon, label, value` | Single stat row |
| `HistoryList` | `history: HistoryItem[]` | Conversation history |

#### Shared Components
| Component | Props | Description |
|-----------|-------|-------------|
| `FloatingActionButton` | `onClick, icon` | Pink FAB |
| `EmptyState` | `icon, title, subtitle` | Empty state view |
| `SearchBar` | `placeholder, onSearch` | Search input |

## 4. Animation Implementation Plan

| Interaction | Tech | Implementation |
|-------------|------|----------------|
| Page Load | Framer Motion | `initial={{ opacity: 0, y: 10 }}` `animate={{ opacity: 1, y: 0 }}` |
| Tab Switch | Framer Motion | `AnimatePresence` with fade + slide |
| Card Hover | Tailwind | `hover:scale-[1.02] hover:shadow-lg transition-all duration-200` |
| Button Tap | Tailwind | `active:scale-[0.98] transition-transform duration-100` |
| Mic Recording | Framer Motion | `animate={{ scale: [1, 1.2, 1] }}` pulse animation |
| Message Appear | Framer Motion | `initial={{ opacity: 0, y: 20 }}` stagger children |
| Progress Bar | CSS | `transition: width 0.5s ease-out` |
| FAB Hover | Tailwind | `hover:scale-110 hover:shadow-xl transition-all duration-200` |
| List Items | Framer Motion | Stagger animation with `delayChildren: 0.1` |

## 5. Project File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn components
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── BottomNav.tsx
│   │   └── Header.tsx
│   ├── speak/
│   │   ├── DailyGoals.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── LearningModeCard.tsx
│   │   ├── ChatInterface.tsx
│   │   └── VoiceInput.tsx
│   ├── knowledge/
│   │   ├── WordBank.tsx
│   │   ├── Dictionary.tsx
│   │   ├── GrammarList.tsx
│   │   ├── GrammarCard.tsx
│   │   └── JLPTBadge.tsx
│   ├── compete/
│   │   └── Leaderboard.tsx
│   ├── progress/
│   │   ├── ProfileCard.tsx
│   │   ├── StreakCounter.tsx
│   │   ├── StatRow.tsx
│   │   └── HistoryList.tsx
│   └── shared/
│       ├── FloatingActionButton.tsx
│       ├── EmptyState.tsx
│       └── SearchBar.tsx
├── contexts/
│   └── AppContext.tsx         # Global state
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useSpeechRecognition.ts
│   └── useVoiceSynthesis.ts
├── types/
│   └── index.ts               # TypeScript types
├── data/
│   ├── grammar.ts             # Grammar data
│   ├── lessons.ts             # Lesson data
│   └── leaderboard.ts         # Mock leaderboard
├── pages/
│   ├── SpeakTab.tsx
│   ├── KnowledgeTab.tsx
│   ├── CompeteTab.tsx
│   ├── ProgressTab.tsx
│   ├── ChatPage.tsx
│   ├── UnitPage.tsx
│   └── SettingsPage.tsx
├── utils/
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 6. Data Types

```typescript
// types/index.ts

export interface User {
  name: string;
  email: string;
  createdAt: string;
}

export interface Stats {
  messagesSpoken: number;
  flashcardsRevised: number;
  lessonsCompleted: number;
  secondsSpoken: number;
  wordsLearned: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  color: 'green' | 'orange' | 'blue';
}

export interface LearningMode {
  id: string;
  title: string;
  description: string;
  actionText: string;
  illustration: string;
  locked?: boolean;
  lockMessage?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  japanese: string;
  romaji: string;
  english: string;
  timestamp: Date;
}

export interface GrammarPoint {
  id: string;
  japanese: string;
  romaji: string;
  meaning: string;
  description: string;
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  structures: number;
}

export interface Word {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  learned: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export interface Lesson {
  id: string;
  unit: string;
  title: string;
  description: string;
  level: string;
}

export interface AppState {
  user: User;
  stats: Stats;
  goals: Goal[];
  messages: Message[];
  words: Word[];
  settings: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    voiceGender: 'male' | 'female';
    displayMode: 'romaji' | 'furigana' | 'both';
  };
}
```

## 7. State Management

```typescript
// contexts/AppContext.tsx

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

// Actions
type Action =
  | { type: 'SET_USER'; payload: Partial<User> }
  | { type: 'UPDATE_STATS'; payload: Partial<Stats> }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'ADD_WORD'; payload: Word }
  | { type: 'UPDATE_GOAL'; payload: { id: string; current: number } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'RESET_PROGRESS' };

// Initial state with localStorage persistence
const initialState: AppState = {
  user: { name: '', email: '', createdAt: new Date().toISOString() },
  stats: { messagesSpoken: 0, flashcardsRevised: 0, lessonsCompleted: 0, secondsSpoken: 0, wordsLearned: 0 },
  goals: [
    { id: '1', title: 'Speak Japanese 5 times', target: 5, current: 0, color: 'green' },
    { id: '2', title: 'Speak 100 seconds total', target: 100, current: 0, color: 'orange' },
    { id: '3', title: 'Speak 5 new words', target: 5, current: 0, color: 'blue' },
  ],
  messages: [],
  words: [],
  settings: {
    difficulty: 'beginner',
    voiceGender: 'female',
    displayMode: 'romaji',
  },
};
```

## 8. Voice Recognition Implementation

```typescript
// hooks/useSpeechRecognition.ts

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startListening = () => {
    // Web Speech API implementation
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };
    
    recognition.start();
  };
  
  return { isListening, transcript, startListening };
};
```

## 9. Package Installation

```bash
# Animation
npm install framer-motion

# Icons
npm install lucide-react

# Japanese font
npm install @fontsource/noto-sans-jp

# Utilities
npm install clsx tailwind-merge
```

## 10. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile (default) | < 640px | Primary target, full mobile UI |
| Tablet (sm) | 640px+ | Adjusted spacing |
| Desktop (md) | 768px+ | Centered content, max-width container |
| Large (lg) | 1024px+ | Side-by-side layouts where applicable |

## 11. Performance Considerations

1. **Lazy Loading**: Chat interface loaded on demand
2. **Virtualization**: Long lists (grammar, leaderboard)
3. **Image Optimization**: Illustrations as SVG or optimized PNG
4. **State Persistence**: localStorage with debounced writes
5. **Animation**: Use `transform` and `opacity` only for 60fps
