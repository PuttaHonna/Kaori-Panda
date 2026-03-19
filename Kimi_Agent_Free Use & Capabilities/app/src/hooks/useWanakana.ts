import { useEffect, useRef } from 'react';
import * as wanakana from 'wanakana';

export function useWanakana<T extends HTMLInputElement | HTMLTextAreaElement>(enabled = true) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled) return; // skip entirely if disabled — never call unbind without a prior bind
        wanakana.bind(el, { IMEMode: true });
        return () => {
            wanakana.unbind(el); // only runs if we actually bound above
        };
    }, [enabled]);

    return ref;
}

