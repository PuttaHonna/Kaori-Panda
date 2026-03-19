import { useState, useEffect } from 'react';
import { getKuroshiro } from '@/lib/kuroshiro';

export function useFurigana(text: string) {
    const [furiganaHtml, setFuriganaHtml] = useState(text);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function parse() {
            setIsLoading(true);
            try {
                const kuroshiro = await getKuroshiro();
                if (!active) return;

                const html = await kuroshiro.convert(text, {
                    to: 'hiragana',
                    mode: 'furigana',
                });

                if (active) {
                    setFuriganaHtml(html);
                }
            } catch (err) {
                console.error('Kuroshiro conversion failed:', err);
                // Fallback to raw text if it fails
                if (active) setFuriganaHtml(text);
            } finally {
                if (active) setIsLoading(false);
            }
        }

        parse();

        return () => {
            active = false;
        };
    }, [text]);

    return { furiganaHtml, isLoading };
}
