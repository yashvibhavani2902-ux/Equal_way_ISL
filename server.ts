import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Gemini Flash 3-Letter MudraID Generation Endpoint
  app.post('/api/generate-mudraid', async (req, res) => {
    try {
      const { wardName, parentName, birthDate, primaryPreference } = req.body || {};

      const ai = getAiClient();
      if (!ai) {
        // Fallback generator when API key is not present
        const fallbackCode = generateFallbackMudraId(wardName || 'WARD');
        return res.json({
          mudraId: fallbackCode,
          source: 'local_fallback',
          note: 'Generated using phonetic hash algorithm (Add GEMINI_API_KEY for live AI Flash generation)'
        });
      }

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

      return res.json({
        mudraId,
        source: 'gemini_flash',
        model: 'gemini-3.7-flash'
      });
    } catch (error: any) {
      console.error('Error generating MudraID with Gemini Flash:', error);
      const fallbackCode = generateFallbackMudraId(req.body?.wardName || 'WARD');
      return res.json({
        mudraId: fallbackCode,
        source: 'local_fallback',
        error: error?.message || 'Gemini generation error'
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EqualWay server running on http://0.0.0.0:${PORT}`);
  });
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

startServer();
