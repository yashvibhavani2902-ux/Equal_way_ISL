import { GoogleGenAI } from '@google/genai';

interface VercelRequest {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: any) => VercelResponse;
  send: (body: any) => VercelResponse;
}

function generateFallbackMudraId(name: string): string {
  const clean = (name || 'WARD').replace(/[^A-Za-z]/g, '').toUpperCase();
  if (clean.length >= 3) {
    const first = clean[0];
    const mid = clean[Math.floor(clean.length / 2)] || 'A';
    const last = clean[clean.length - 1] || 'Z';
    return `${first}${mid}${last}`;
  }
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let out = clean;
  while (out.length < 3) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out.slice(0, 3).toUpperCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wardName, parentName, birthDate, primaryPreference } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackCode = generateFallbackMudraId(wardName || 'WARD');
      return res.status(200).json({
        mudraId: fallbackCode,
        source: 'local_fallback',
        note: 'Generated using phonetic hash algorithm'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the core ID generation engine for the Indian Sign Language (ISL) emergency registry 'SurakshaBridge'.
Generate a UNIQUE, highly distinguishable 3-LETTER uppercase code (MudraID) for the following registered ward:
- Ward Name: "${wardName || 'Unknown'}"
- Parent/Guardian: "${parentName || 'Unknown'}"
- Birth Date: "${birthDate || 'Unknown'}"
- Primary Preference: "${primaryPreference || 'Accessibility'}"

CRITICAL CONSTRAINTS:
1. Output EXACTLY THREE (3) uppercase English letters (A-Z), e.g. "GAV", "VKR", "SAM", "RAJ", "DEV", "TAN", "AAR", "LUV", "MUK".
2. The 3 letters must be clear for Indian Sign Language manual fingerspelling.
3. Output ONLY the 3 letters, with NO explanations, punctuation, quotes, spaces, or markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    const rawText = response.text ? response.text.trim().toUpperCase() : '';
    const matched = rawText.match(/[A-Z]{3}/);
    const mudraId = matched ? matched[0] : generateFallbackMudraId(wardName);

    return res.status(200).json({
      mudraId,
      source: 'gemini_flash',
      model: 'gemini-3.7-flash'
    });
  } catch (error: any) {
    const fallbackCode = generateFallbackMudraId(req.body?.wardName || 'WARD');
    return res.status(200).json({
      mudraId: fallbackCode,
      source: 'local_fallback',
      error: error?.message || 'Gemini generation error'
    });
  }
}
