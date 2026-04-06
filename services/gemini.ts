import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API } from '@/constants';

export interface GeminiNudge {
  nudges: string[];
}

export interface WeeklySummary {
  totalSpent: number;       // in rupees
  percentUsed: number;      // 0-100
  topCategory: string;
  topCategoryAmount: number; // in rupees
  daysInBudget: number;     // 0-7
  goalsOnTrack: number;
  totalGoals: number;
}

/**
 * Fetches AI nudges from Gemini, with 24h AsyncStorage cache.
 * Falls back gracefully when offline or key is missing.
 */
export async function getGeminiNudges(summary: WeeklySummary): Promise<string[]> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

  // --- Check cache first ---
  try {
    const cachedTs = await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_NUDGES_TIMESTAMP);
    const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_NUDGES_CACHE);
    if (cachedTs && cachedData) {
      const ageHours = (Date.now() - parseInt(cachedTs)) / (1000 * 60 * 60);
      if (ageHours < API.gemini.cacheDurationHours) {
        return JSON.parse(cachedData);
      }
    }
  } catch (_) {}

  if (!apiKey) {
    return [
      'Add your Gemini key to .env to unlock personalized AI insights.',
      'Track 7 days of spending to get your first Money Mood Score.',
    ];
  }

  const prompt = `
You are a friendly, non-judgmental personal finance coach for a young Indian professional.
Based on this week's summary, give 1-3 short, actionable insights.
Each insight must be under 30 words. Use simple language. No jargon.
Never be preachy or scary. Always end with one positive observation.

Weekly summary:
- Total spent: ₹${summary.totalSpent}
- Budget used: ${summary.percentUsed}%
- Highest category: ${summary.topCategory} (₹${summary.topCategoryAmount})
- Days within budget: ${summary.daysInBudget}/7
- Goals progress: ${summary.goalsOnTrack} of ${summary.totalGoals} on track

Respond as JSON: { "nudges": ["...", "...", "..."] }
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${API.gemini.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: API.gemini.temperature,
            maxOutputTokens: API.gemini.maxOutputTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Body:', errorBody);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip markdown code blocks if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed: GeminiNudge = JSON.parse(cleaned);
    const nudges = parsed.nudges.slice(0, API.gemini.maxNudges);

    // Cache result
    await AsyncStorage.setItem(STORAGE_KEYS.GEMINI_NUDGES_CACHE, JSON.stringify(nudges));
    await AsyncStorage.setItem(STORAGE_KEYS.GEMINI_NUDGES_TIMESTAMP, Date.now().toString());

    return nudges;
  } catch (e) {
    console.error('Gemini nudge error:', e);
    return [
      'Keep logging your expenses — insights get smarter over time.',
      'You\'re building a great financial habit by tracking daily!',
    ];
  }
}
