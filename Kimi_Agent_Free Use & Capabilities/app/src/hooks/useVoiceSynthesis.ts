import { useCallback, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export function useVoiceSynthesis() {
    const { state } = useApp();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const speak = useCallback(
        (text: string, lang = 'ja-JP') => {
            if (!window.speechSynthesis) return;

            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.85;
            utterance.pitch = state.settings.voiceGender === 'female' ? 1.2 : 0.8;

            // Try to find a matching voice
            const voices = window.speechSynthesis.getVoices();
            const langVoices = voices.filter(v => v.lang.startsWith('ja'));
            if (langVoices.length > 0) {
                const genderHint = state.settings.voiceGender === 'female' ? ['female', 'woman', 'Kyoko', 'Haruka'] : ['male', 'man', 'Otoya'];
                const matched = langVoices.find(v => genderHint.some(h => v.name.toLowerCase().includes(h.toLowerCase())));
                utterance.voice = matched ?? langVoices[0];
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        [state.settings.voiceGender]
    );

    const stop = useCallback(() => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking };
}
