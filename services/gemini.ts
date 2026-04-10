import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API } from '@/constants';

export interface GeminiNudge {
  nudges: string[];
}

export interface WeeklySummary {
  totalSpent: number;        // in rupees
  percentUsed: number;       // 0-100
  topCategory: string;
  topCategoryAmount: number; // in rupees
  daysInBudget: number;      // 0-7
  goalsOnTrack: number;
  totalGoals: number;
}

/** Fallback nudges shown when AI is unavailable or errors out */
const FALLBACK_NUDGES = [
  'Keep logging your expenses — insights get smarter with more data.',
  "You're building a great financial habit by tracking daily!",
];

/**
 * Safely extracts the text string from a Gemini API response.
 * Handles both Gemini 1.5 and 2.5 response shapes defensively.
 *
 * Gemini 2.5 Flash can return:
 *   - candidates[0].content.parts[0].text  (standard)
 *   - candidates[0].content.parts          (array with no .text if empty)
 *   - finishReason: "MAX_TOKENS" with partial output
 *   - No candidates at all on safety block
 */
function extractText(data: any): string {
  // Log the full raw structure in dev so you can see what Gemini actually sent
  if (__DEV__) {
    console.log('[Gemini] Raw response:', JSON.stringify(data, null, 2));
  }

  // No candidates = safety block or quota error
  if (!data?.candidates || data.candidates.length === 0) {
    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
      console.warn('[Gemini] Blocked:', blockReason);
    }
    return '';
  }

  const candidate = data.candidates[0];

  // Check finish reason — SAFETY or RECITATION means no usable text
  const finishReason = candidate?.finishReason;
  if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
    console.warn('[Gemini] Finish reason:', finishReason);
    return '';
  }
  // MAX_TOKENS = output was cut off — text will be incomplete/unparseable
  if (finishReason === 'MAX_TOKENS') {
    console.warn('[Gemini] MAX_TOKENS hit — response truncated. Increase maxOutputTokens or disable thinking.');
    return ''; // return empty so fallback kicks in cleanly
  }

  // Standard path
  const text = candidate?.content?.parts?.[0]?.text;
  if (typeof text === 'string' && text.trim().length > 0) {
    return text.trim();
  }

  // Parts array exists but no .text — Gemini 2.5 sometimes does this
  const parts = candidate?.content?.parts;
  if (Array.isArray(parts) && parts.length > 0) {
    const joined = parts
      .map((p: any) => p?.text ?? '')
      .join('')
      .trim();
    if (joined.length > 0) return joined;
  }

  return '';
}

/**
 * Parses the raw Gemini text into a nudges array.
 * Handles 3 formats Gemini 2.5 might return:
 *   1. Clean JSON:        { "nudges": ["...", "..."] }
 *   2. Markdown fenced:   ```json\n{ "nudges": [...] }\n```
 *   3. Plain text lines:  nudge one\nnudge two\nnudge three
 */
function parseNudges(raw: string, maxNudges: number): string[] | null {
  if (!raw || raw.length === 0) return null;

  // Step 1: strip markdown fences (handles ```json, ```JSON, plain ```)
  const stripped = raw
    .replace(/^```[a-zA-Z]*\n?/gm, '')
    .replace(/```$/gm, '')
    .trim();

  // Step 2: try JSON parse
  try {
    const parsed = JSON.parse(stripped);

    // Expected shape: { nudges: string[] }
    if (Array.isArray(parsed?.nudges)) {
      return parsed.nudges
        .filter((n: any) => typeof n === 'string' && n.trim().length > 0)
        .slice(0, maxNudges);
    }

    // Sometimes Gemini returns just an array: ["nudge1", "nudge2"]
    if (Array.isArray(parsed)) {
      return parsed
        .filter((n: any) => typeof n === 'string' && n.trim().length > 0)
        .slice(0, maxNudges);
    }
  } catch (_jsonError) {
    // Not valid JSON — try plain text fallback below
  }

  // Step 3: plain text fallback — split by newlines, filter empty lines
  const lines = stripped
    .split('\n')
    .map((l) => l.replace(/^[-•*\d.)\s]+/, '').trim()) // strip bullet/number prefixes
    .filter((l) => l.length > 10); // ignore very short lines

  if (lines.length > 0) {
    return lines.slice(0, maxNudges);
  }

  return null;
}

/**
 * Fetches AI nudges from Gemini 2.5 Flash, with 24h AsyncStorage cache.
 * Falls back gracefully when offline, key is missing, or API errors.
 */
export async function getGeminiNudges(summary: WeeklySummary): Promise<string[]> {
  // ── 1. Cache check ────────────────────────────────────────────
  try {
    const cachedTs = await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_NUDGES_TIMESTAMP);
    const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_NUDGES_CACHE);

    if (cachedTs && cachedData) {
      const ageHours = (Date.now() - parseInt(cachedTs, 10)) / (1000 * 60 * 60);
      if (ageHours < API.gemini.cacheDurationHours) {
        if (__DEV__) console.log('[Gemini] Returning cached nudges');
        return JSON.parse(cachedData);
      }
    }
  } catch (_) {
    // Cache miss — continue to fetch
  }

  // ── 2. API key check ──────────────────────────────────────────
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    console.warn('[Gemini] No API key found in EXPO_PUBLIC_GEMINI_KEY');
    return [
      'Add your Gemini key to .env to unlock personalized AI insights.',
      'Track 7 days of spending to get your first Money Mood Score.',
    ];
  }

  // ── 3. Build prompt ───────────────────────────────────────────
  // responseMimeType forces Gemini 2.5 to return clean JSON — no markdown wrapping
  const prompt = `You are a friendly, non-judgmental personal finance coach for a young Indian professional.
Based on this week's summary, give exactly 3 short, actionable insights.
Each insight must be under 30 words. Use simple language. No financial jargon.
Never be preachy or scary. Always end with one positive observation.

Weekly summary:
- Total spent: ₹${summary.totalSpent}
- Budget used: ${summary.percentUsed}%
- Highest spending category: ${summary.topCategory} (₹${summary.topCategoryAmount})
- Days within budget: ${summary.daysInBudget}/7
- Goals on track: ${summary.goalsOnTrack} of ${summary.totalGoals}

Respond ONLY with valid JSON in this exact format, no other text:
{ "nudges": ["insight one here", "insight two here", "insight three here"] }`;

  // ── 4. Fetch ──────────────────────────────────────────────────
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${API.gemini.model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: API.gemini.temperature,
        // Gemini 2.5 Flash uses ~477 tokens just for "thinking" before output.
        // 500 total = nothing left for actual response → MAX_TOKENS truncation.
        // Set to 1024 so output has room after thinking finishes.
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
      // Disable thinking for this task — nudges are simple, don't need CoT.
      // This eliminates the 477-token thinking overhead entirely.
      // Gemini 2.5 Flash supports thinkingConfig to turn it off.
      thinkingConfig: {
        thinkingBudget: 0,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // ── 5. HTTP error handling ────────────────────────────────
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Gemini] HTTP ${response.status}:`, errorBody);

      // 429 = quota exceeded — return fallback, do NOT cache
      if (response.status === 429) {
        console.warn('[Gemini] Rate limit hit — using fallback');
        return FALLBACK_NUDGES;
      }

      throw new Error(`Gemini API error: ${response.status}`);
    }

    // ── 6. Extract and parse ──────────────────────────────────
    const data = await response.json();
    const raw = extractText(data);

    if (__DEV__) {
      console.log('[Gemini] Extracted text:', raw);
    }

    if (!raw) {
      console.warn('[Gemini] Empty text from API — using fallback');
      return FALLBACK_NUDGES;
    }

    const nudges = parseNudges(raw, API.gemini.maxNudges);

    if (!nudges || nudges.length === 0) {
      console.warn('[Gemini] Could not parse nudges from:', raw);
      return FALLBACK_NUDGES;
    }

    // ── 7. Cache success ──────────────────────────────────────
    await AsyncStorage.setItem(
      STORAGE_KEYS.GEMINI_NUDGES_CACHE,
      JSON.stringify(nudges)
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.GEMINI_NUDGES_TIMESTAMP,
      Date.now().toString()
    );

    if (__DEV__) {
      console.log('[Gemini] Nudges fetched and cached:', nudges);
    }

    return nudges;
  } catch (e) {
    console.error('[Gemini] nudge error:', e);
    return FALLBACK_NUDGES;
  }
}

/**
 * Clears the Gemini nudge cache — call this when user manually refreshes.
 */
export async function clearGeminiCache(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.GEMINI_NUDGES_CACHE,
    STORAGE_KEYS.GEMINI_NUDGES_TIMESTAMP,
  ]);
}