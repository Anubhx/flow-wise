import { MOOD, BUDGET } from '@/constants';

export interface DaySpend {
  date: string; // ISO date YYYY-MM-DD
  totalPaise: number;
}

/**
 * Calculate the Money Mood Score for a week.
 * Max 100 points:
 *  - 70pts: 10 pts per day under daily budget
 *  - 10pts: bonus for no spike day (no day > 2x daily average)
 *  - 10pts: bonus for making a goal deposit this week
 *  - 10pts: self-report modifier (-10 to +10)
 */
export function calculateMoodScore({
  dailySpends,
  monthlyBudgetPaise,
  madeGoalDeposit,
  selfReport,
}: {
  dailySpends: DaySpend[];
  monthlyBudgetPaise: number;
  madeGoalDeposit: boolean;
  selfReport: string | null; // 'rough' | 'okay' | 'good' | 'great'
}): number {
  const dailyBudget = monthlyBudgetPaise / 30;

  // --- Days in budget (70 pts max) ---
  const daysInBudget = dailySpends.filter(d => d.totalPaise <= dailyBudget).length;
  const budgetScore = daysInBudget * 10; // 10 per day, max 70 (7 days)

  // --- No spike day (10 pts) ---
  const totalSpend = dailySpends.reduce((s, d) => s + d.totalPaise, 0);
  const avgDaily = dailySpends.length > 0 ? totalSpend / dailySpends.length : 0;
  const hasSpike = dailySpends.some(d => d.totalPaise > avgDaily * MOOD.spikeDayMultiplier);
  const spikeScore = hasSpike ? 0 : 10;

  // --- Goal deposit bonus (10 pts) ---
  const goalScore = madeGoalDeposit ? 10 : 0;

  // --- Self-report (up to ±10) ---
  const selfReportOption = MOOD.selfReportOptions.find(o => o.id === selfReport);
  const selfScore = selfReportOption ? selfReportOption.scoreModifier : 0;

  const raw = budgetScore + spikeScore + goalScore + selfScore;
  return Math.max(0, Math.min(100, raw));
}

/**
 * Get score range label and color.
 */
export function getMoodScoreRange(score: number) {
  return MOOD.scoreRanges.find(r => score >= r.min && score <= r.max) ?? MOOD.scoreRanges[0];
}

/**
 * Get the Monday of the current week (ISO format YYYY-MM-DD).
 */
export function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

/**
 * Generate a 7-element array for the current Mon–Sun week,
 * each item having a date and whether it falls in the future.
 */
export function getWeekDays(): { date: string; label: string; isFuture: boolean }[] {
  const weekStart = getWeekStart();
  const start = new Date(weekStart);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().toISOString().split('T')[0];

  return labels.map((label, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return { date: dateStr, label, isFuture: dateStr > today };
  });
}
