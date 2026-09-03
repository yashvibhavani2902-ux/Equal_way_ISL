export interface GenerateMudraIdResult {
  mudraId: string;
  source: 'gemini_flash' | 'local_fallback';
  model?: string;
  note?: string;
}

export async function generate3LetterMudraId(params: {
  wardName: string;
  parentName?: string;
  birthDate?: string;
  primaryPreference?: string;
}): Promise<GenerateMudraIdResult> {
  try {
    const response = await fetch('/api/generate-mudraid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.mudraId && /^[A-Z]{3}$/.test(data.mudraId)) {
        return {
          mudraId: data.mudraId,
          source: data.source || 'gemini_flash',
          model: data.model,
          note: data.note,
        };
      }
    }
  } catch (error) {
    console.warn('Gemini Flash API route error, using client-side fallback algorithm:', error);
  }

  // Robust client-side phonetic fallback
  const fallback = computeFallback3LetterCode(params.wardName);
  return {
    mudraId: fallback,
    source: 'local_fallback',
    note: 'Generated locally',
  };
}

export function computeFallback3LetterCode(name: string): string {
  const clean = (name || 'WARD').trim().replace(/[^A-Za-z]/g, '').toUpperCase();
  if (clean.length >= 3) {
    const first = clean[0];
    const mid = clean[Math.floor(clean.length / 2)] || 'A';
    const last = clean[clean.length - 1] || 'Z';
    return `${first}${mid}${last}`;
  }
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = clean;
  while (result.length < 3) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result.slice(0, 3).toUpperCase();
}
