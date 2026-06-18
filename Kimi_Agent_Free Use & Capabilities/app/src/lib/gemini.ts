import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export const hasGeminiKey = Boolean(API_KEY && API_KEY !== 'your_gemini_api_key_here');

/**
 * Sends a one-shot prompt to Gemini 1.5 Flash and returns the raw text.
 * Use this for non-chat single-request features.
 */
export async function geminiPrompt(prompt: string): Promise<string> {
  if (!hasGeminiKey) throw new Error('No Gemini API key configured.');
  const genAI = new GoogleGenerativeAI(API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Sends a multimodal prompt to Gemini 1.5 Flash using a base64 image data URL.
 */
export async function geminiVisionPrompt(prompt: string, base64Image: string): Promise<string> {
  if (!hasGeminiKey) throw new Error('No Gemini API key configured.');
  const genAI = new GoogleGenerativeAI(API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Data,
        mimeType
      }
    }
  ]);
  return result.response.text();
}
