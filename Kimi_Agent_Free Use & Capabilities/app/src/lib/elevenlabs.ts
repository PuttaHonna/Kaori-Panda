export const hasElevenLabsKey = !!import.meta.env.VITE_ELEVENLABS_API_KEY;

export const ELEVENLABS_VOICES = [
    { id: 'wcs09USXSN5Bl7FXohVZ', name: 'User Custom Voice', gender: 'female' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (American)', gender: 'female' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (American)', gender: 'female' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (American)', gender: 'female' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (American)', gender: 'male' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (American)', gender: 'male' }
];

/**
 * Fetches an audio blob from ElevenLabs Text-to-Speech API
 * @param text The Japanese text to speak
 * @param voiceId The ElevenLabs voice ID to use (defaults to the user's requested voice)
 */
export async function getElevenLabsAudio(text: string, voiceId = 'wcs09USXSN5Bl7FXohVZ'): Promise<Blob> {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ElevenLabs API Key is missing");

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
            'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2', // v2 supports Japanese perfectly
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs TTS failed: ${response.status} ${response.statusText} - ${errText}`);
    }

    return await response.blob();
}
