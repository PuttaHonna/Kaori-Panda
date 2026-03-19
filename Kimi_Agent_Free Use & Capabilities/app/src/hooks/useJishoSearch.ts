import { useState, useEffect, useCallback, useRef } from 'react';

export interface JishoWord {
    slug: string;
    japanese: Array<{ word?: string; reading?: string }>;
    senses: Array<{
        english_definitions: string[];
        parts_of_speech: string[];
        tags?: string[];
        info?: string[];
    }>;
    is_common: boolean;
    jlpt: string[];
}

interface UseJishoSearchReturn {
    results: JishoWord[];
    isLoading: boolean;
    error: string | null;
    search: (keyword: string) => void;
}

async function fetchJisho(keyword: string): Promise<JishoWord[]> {
    // Use Vite's built-in dev proxy: /api/jisho → https://jisho.org/api
    // This runs on Node.js locally — zero CORS issues, no external services needed
    const url = `/api/jisho/v1/search/words?keyword=${encodeURIComponent(keyword)}`;

    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data.data)) throw new Error('Unexpected response format');
    return data.data;
}

export function useJishoSearch(): UseJishoSearchReturn {
    const [results, setResults] = useState<JishoWord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((keyword: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!keyword.trim()) {
            setResults([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        debounceRef.current = setTimeout(async () => {
            try {
                const data = await fetchJisho(keyword);
                setResults(data.slice(0, 20));
                setError(null);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Search failed');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);
    }, []);

    useEffect(() => {
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, []);

    return { results, isLoading, error, search };
}
