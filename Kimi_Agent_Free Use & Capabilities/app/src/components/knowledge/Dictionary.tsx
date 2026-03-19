import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Wifi, WifiOff } from 'lucide-react';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { useJishoSearch, type JishoWord } from '@/hooks/useJishoSearch';
import { useWanakana } from '@/hooks/useWanakana';
import { dictionaryData } from '@/data/dictionary';
import { cn } from '@/lib/utils';

type SearchLang = 'ja' | 'en';

const POS_COLORS: Record<string, string> = {
  'Noun': 'bg-amber-100 text-amber-700',
  'Verb': 'bg-bamboo-100 text-bamboo-700',
  'Adjective': 'bg-purple-100 text-purple-700',
  'Adverb': 'bg-blue-100 text-blue-700',
  'Interjection': 'bg-green-100 text-green-700',
  'Particle': 'bg-gray-100 text-gray-600',
  'Expression': 'bg-bamboo-100 text-bamboo-700',
};

function posColor(pos: string): string {
  for (const key of Object.keys(POS_COLORS)) {
    if (pos.includes(key)) return POS_COLORS[key];
  }
  return 'bg-gray-100 text-gray-600';
}

function JLPTBadge({ jlpt }: { jlpt: string[] }) {
  if (!jlpt.length) return null;
  const level = jlpt[0].replace('jlpt-', '').toUpperCase();
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 ml-1">
      {level}
    </span>
  );
}

function JishoCard({ word, highlightHonorifics = false }: { word: JishoWord, highlightHonorifics?: boolean }) {
  const primary = word.japanese[0];
  const kanji = primary?.word ?? primary?.reading ?? '';
  const reading = primary?.word ? primary.reading : undefined;
  const mainSense = word.senses[0];
  const definitions = mainSense?.english_definitions.slice(0, 3).join('; ') ?? '';
  const pos = mainSense?.parts_of_speech[0] ?? '';

  const isHonorific = mainSense?.tags?.some(tag => typeof tag === 'string' && tag.toLowerCase().includes('honorific')) ||
    mainSense?.info?.some(info => typeof info === 'string' && info.toLowerCase().includes('honorific')) ||
    mainSense?.parts_of_speech?.some(pos => typeof pos === 'string' && pos.toLowerCase().includes('honorific'));

  const isHumble = mainSense?.tags?.some(tag => typeof tag === 'string' && tag.toLowerCase().includes('humble')) ||
    mainSense?.info?.some(info => typeof info === 'string' && info.toLowerCase().includes('humble')) ||
    mainSense?.parts_of_speech?.some(pos => typeof pos === 'string' && pos.toLowerCase().includes('humble'));

  return (
    <div className={cn(
      "p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-colors",
      highlightHonorifics && isHonorific ? "ring-2 ring-amber-400 bg-amber-50/50" : "",
      highlightHonorifics && isHumble ? "ring-2 ring-slate-400 bg-slate-50/50" : ""
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-gray-900 jp-text text-base">{kanji}</span>
          {reading && (
            <span className="text-sm text-gray-500 jp-text">{reading}</span>
          )}
          {word.is_common && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              common
            </span>
          )}
          {highlightHonorifics && isHonorific && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
              Honorific 尊敬語
            </span>
          )}
          {highlightHonorifics && isHumble && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold border border-slate-300">
              Humble 謙譲語
            </span>
          )}
          <JLPTBadge jlpt={word.jlpt} />
        </div>
        <p className="text-sm text-gray-700 leading-snug">{definitions}</p>
        {word.senses.length > 1 && (
          <p className="text-xs text-gray-400 mt-1">+{word.senses.length - 1} more meanings</p>
        )}
      </div>
      {pos && (
        <span className={cn('text-xs font-medium px-2 py-1 rounded-lg shrink-0 mt-0.5', posColor(pos))}>
          {pos.split(' ')[0]}
        </span>
      )}
    </div>
  );
}

// Static fallback with same card style
function StaticCard({ entry }: { entry: typeof dictionaryData[0] }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 jp-text">{entry.japanese}</p>
        <p className="text-sm text-gray-500">{entry.romaji}</p>
        <p className="text-sm text-gray-700 mt-0.5">{entry.english}</p>
      </div>
      <span className={cn('text-xs font-medium px-2 py-1 rounded-lg shrink-0', posColor(entry.type))}>
        {entry.type}
      </span>
    </div>
  );
}

// Language toggle pill component
function LangToggle({ lang, onChange }: { lang: SearchLang; onChange: (l: SearchLang) => void }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5 shrink-0">
      <button
        onClick={() => onChange('ja')}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
          lang === 'ja'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
        title="Search in Japanese (romaji → kana auto-conversion)"
      >
        <span className="text-sm leading-none">🇯🇵</span>
        <span>JA</span>
      </button>
      <button
        onClick={() => onChange('en')}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
          lang === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
        title="Search in English"
      >
        <span className="text-sm leading-none">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}

export function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLang, setSearchLang] = useState<SearchLang>('en');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [highlightHonorifics, setHighlightHonorifics] = useState(false);

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const { results, isLoading, error, search } = useJishoSearch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Only bind WanaKana romanization when in Japanese mode
  const searchInputRef = useWanakana<HTMLInputElement>(searchLang === 'ja');

  // Track online status
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // Clear query when switching language so users start fresh
  const handleLangChange = (lang: SearchLang) => {
    setSearchLang(lang);
    setSearchQuery('');
  };

  // Trigger live search whenever query changes
  useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  const showStatic = !searchQuery.trim();
  const staticFiltered = dictionaryData.filter(e => {
    // Static fallback words do not have JLPT tags locally mapped
    const levelMatch = !selectedLevel;
    const searchMatch = showStatic ? true :
      e.japanese.includes(searchQuery) ||
      e.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.english.toLowerCase().includes(searchQuery.toLowerCase());
    return levelMatch && searchMatch;
  });

  const jishoFiltered = results.filter(w => {
    if (!selectedLevel) return true;
    return w.jlpt.some(j => j.toLowerCase().includes(selectedLevel.toLowerCase()));
  });

  return (
    <div className="space-y-4">
      {/* Language selector + search bar row */}
      <div className="flex items-center gap-2">
        <LangToggle lang={searchLang} onChange={handleLangChange} />
        <div className="relative flex-1">
          <SearchBar
            inputRef={searchInputRef}
            placeholder={
              searchLang === 'ja'
                ? 'Search in Japanese…'
                : 'Search in English…'
            }
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : isOnline ? (
              <span title="Online - Live Search Active"><Wifi className="w-5 h-5 text-green-500" /></span>
            ) : (
              <span title="Offline - Using Built-in Words"><WifiOff className="w-5 h-5 text-gray-400" /></span>
            )}
          </div>
        </div>
      </div>

      {/* JLPT Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
            className={`
              shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all
              ${selectedLevel === level
                ? 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'
              }
            `}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pb-2">
        {/* Language hint */}
        {!searchQuery.trim() ? (
          <p className="text-xs text-gray-400 px-1">
            {searchLang === 'ja'
              ? '🇯🇵 Japanese mode — romaji auto-converts to kana as you type'
              : '🇬🇧 English mode — type any English word to find its Japanese meaning'}
          </p>
        ) : <div />}

        {/* Keigo Toggle */}
        <button
          onClick={() => setHighlightHonorifics(!highlightHonorifics)}
          className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-full transition-colors",
            highlightHonorifics
              ? "bg-amber-100 text-amber-800 border border-amber-200"
              : "bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
          )}
        >
          {highlightHonorifics ? '✨ Keigo Highlights On' : 'Keigo Highlights Off'}
        </button>
      </div>

      {/* Source tag */}
      {!showStatic && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-gray-400">
            {error ? '⚠️ Offline fallback' : `Live results from `}
            {!error && (
              <a href="https://jisho.org" target="_blank" rel="noreferrer"
                className="text-bamboo-500 hover:underline font-medium">
                jisho.org
              </a>
            )}
          </span>
          {results.length > 0 && !error && (
            <span className="text-xs text-gray-400">· {results.length} results</span>
          )}
        </div>
      )}

      {/* Error notice */}
      {error && !showStatic && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          ⚠️ {error} — showing built-in words instead.
        </div>
      )}

      {/* Results */}
      {showStatic ? (
        /* No search: show all built-in words */
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-400">Built-in starter words · Type to search Jisho live</p>
            <p className="text-xs font-semibold text-gray-500">
              {staticFiltered.length} {staticFiltered.length === 1 ? 'word' : 'words'}
            </p>
          </div>
          {staticFiltered.length > 0 ? (
            staticFiltered.map(e => <StaticCard key={e.id} entry={e} />)
          ) : (
            <EmptyState icon={BookOpen} title="No local words found" subtitle={`Try searching without the ${selectedLevel} filter`} />
          )}
        </div>
      ) : isLoading ? (
        /* Loading skeleton */
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-white rounded-xl shadow-sm animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : results.length > 0 && !error ? (
        /* Live Jisho results */
        <div className="space-y-2">
          <div className="flex justify-end px-1 mb-1">
            <p className="text-xs font-semibold text-gray-500">
              {jishoFiltered.length} matching {jishoFiltered.length === 1 ? 'word' : 'words'}
            </p>
          </div>
          {jishoFiltered.length > 0 ? (
            jishoFiltered.map(w => <JishoCard key={w.slug} word={w} highlightHonorifics={highlightHonorifics} />)
          ) : (
            <EmptyState icon={BookOpen} title={`No ${selectedLevel} words found`} subtitle="Try removing the JLPT filter for more results" />
          )}
        </div>
      ) : error ? (
        /* Error — show static fallback */
        <div className="space-y-2">
          {dictionaryData.map(e => <StaticCard key={e.id} entry={e} />)}
        </div>
      ) : (
        /* No results */
        <EmptyState icon={BookOpen} title="No results found" subtitle="Try a different word or romaji" />
      )}
    </div>
  );
}
