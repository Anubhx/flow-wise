import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, MOOD, STRINGS, BUDGET } from '@/constants';
import { calculateMoodScore, getMoodScoreRange, getWeekStart, getWeekDays } from '@/utils/mood';
import { getGeminiNudges, type WeeklySummary } from '@/services/gemini';

export default function InsightsScreen() {
  const db = useSQLiteContext();
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [selfReport, setSelfReport] = useState<string | null>(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [daySpends, setDaySpends] = useState<Record<string, number>>({});
  const [nudges, setNudges] = useState<string[]>([]);
  const [nudgesLoading, setNudgesLoading] = useState(false);
  const [budgetPaise, setBudgetPaise] = useState(BUDGET.defaultMonthlyBudget);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function load() {
        try {
          const weekStart = getWeekStart();

          // 1. Load this week's transactions to compute daily spends
          const days = getWeekDays();
          const txs = await db.getAllAsync<{ transaction_date: string; amount: number }>(
            `SELECT transaction_date, amount FROM transactions WHERE type='expense' AND transaction_date >= ?`,
            [`${weekStart}T00:00:00.000Z`]
          );

          const dayMap: Record<string, number> = {};
          txs.forEach(tx => {
            const date = tx.transaction_date.split('T')[0];
            dayMap[date] = (dayMap[date] ?? 0) + tx.amount;
          });

          // 2. Load budget
          const budgetRow = await db.getFirstAsync<{ monthly_limit: number }>(
            `SELECT SUM(monthly_limit) as monthly_limit FROM budget_categories`
          );
          const budget = budgetRow?.monthly_limit ?? BUDGET.defaultMonthlyBudget;

          // 3. Load goals
          const goals = await db.getAllAsync<{ saved_amount: number; target_amount: number; status: string }>(
            `SELECT saved_amount, target_amount, status FROM goals`
          );

          // 4. Load this week's mood entry (for self_report)
          const moodEntry = await db.getFirstAsync<{ score: number; self_report: string }>(
            `SELECT score, self_report FROM mood_entries WHERE week_start = ? ORDER BY created_at DESC LIMIT 1`,
            [weekStart]
          );

          if (!isMounted) return;

          setBudgetPaise(budget);
          setDaySpends(dayMap);

          if (moodEntry) {
            setMoodScore(moodEntry.score);
            setSelfReport(moodEntry.self_report);
            setCheckInSubmitted(!!moodEntry.self_report);
          } else {
            // Calculate partial score without self-report
            const dailySpendArr = days.map(d => ({ date: d.date, totalPaise: dayMap[d.date] ?? 0 }));
            const score = calculateMoodScore({
              dailySpends: dailySpendArr.filter(d => !days.find(day => day.date === d.date)?.isFuture),
              monthlyBudgetPaise: budget,
              madeGoalDeposit: false,
              selfReport: null,
            });
            setMoodScore(score);
          }

          // 5. Fetch Gemini nudges
          setNudgesLoading(true);
          const totalSpent = Object.values(dayMap).reduce((s, v) => s + v, 0);
          const onTrack = goals.filter(g => g.saved_amount / g.target_amount >= 0.5).length;
          const summary: WeeklySummary = {
            totalSpent: Math.round(totalSpent / 100),
            percentUsed: Math.round((totalSpent / budget) * 100),
            topCategory: 'Food',
            topCategoryAmount: 0,
            daysInBudget: days.filter(d => (dayMap[d.date] ?? 0) <= budget / 30).length,
            goalsOnTrack: onTrack,
            totalGoals: goals.length,
          };
          const fetched = await getGeminiNudges(summary);
          if (isMounted) {
            setNudges(fetched);
            setNudgesLoading(false);
          }
        } catch (e) {
          console.error('Insights load error:', e);
          if (isMounted) setNudgesLoading(false);
        }
      }
      load();
      return () => { isMounted = false; };
    }, [])
  );

  const handleCheckIn = async (reportId: string) => {
    setSelfReport(reportId);
    setCheckInSubmitted(true);

    const weekStart = getWeekStart();
    const days = getWeekDays();
    const dailySpendArr = days.map(d => ({ date: d.date, totalPaise: daySpends[d.date] ?? 0 }));
    const score = calculateMoodScore({
      dailySpends: dailySpendArr.filter(d => !days.find(day => day.date === d.date)?.isFuture),
      monthlyBudgetPaise: budgetPaise,
      madeGoalDeposit: false,
      selfReport: reportId,
    });
    setMoodScore(score);

    await db.runAsync(
      `INSERT INTO mood_entries (week_start, score, self_report) VALUES (?, ?, ?)`,
      [weekStart, score, reportId]
    );
  };

  const scoreRange = moodScore !== null ? getMoodScoreRange(moodScore) : null;
  const weekDays = getWeekDays();

  const getDayMood = (date: string) => {
    const spend = daySpends[date] ?? 0;
    const daily = budgetPaise / 30;
    if (spend === 0) return null;
    if (spend <= daily * 0.7) return 'great';
    if (spend <= daily) return 'good';
    if (spend <= daily * 1.3) return 'okay';
    return 'rough';
  };

  const MOOD_EMOJIS: Record<string, string> = { great: '😊', good: '🙂', okay: '😐', rough: '😬' };
  const MOOD_BG: Record<string, string> = {
    great: COLORS.mood.greatBg,
    good: COLORS.mood.goodBg,
    okay: COLORS.mood.okayBg,
    rough: COLORS.mood.roughBg,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.insights.title}</Text>
        <Text style={styles.subtitle}>{STRINGS.insights.subtitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Money Mood Score Card */}
        <View style={styles.moodScoreCard}>
          <Text style={styles.cardLabel}>{STRINGS.insights.moodScore}</Text>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreCircle, { borderColor: scoreRange?.color ?? COLORS.info }]}>
              <Text style={[styles.scoreNumber, { color: scoreRange?.color ?? COLORS.info }]}>
                {moodScore ?? '—'}
              </Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <View style={styles.scoreInfo}>
              {scoreRange && <Text style={[styles.scoreLabel, { color: scoreRange.color }]}>{scoreRange.label}</Text>}
              <Text style={styles.scoreDesc}>
                {moodScore !== null
                  ? `You stayed within budget ${weekDays.filter(d => !d.isFuture && getDayMood(d.date) && getDayMood(d.date) !== 'rough').length} days this week.`
                  : 'Start tracking to see your score.'}
              </Text>
            </View>
          </View>

          {/* 7-day strip */}
          <View style={styles.dayStrip}>
            {weekDays.map(day => {
              const mood = getDayMood(day.date);
              return (
                <View key={day.date} style={styles.dayItem}>
                  <View style={[
                    styles.dayDot,
                    { backgroundColor: mood ? MOOD_BG[mood] : COLORS.surfaceHover }
                  ]}>
                    <Text style={styles.dayEmoji}>{mood ? MOOD_EMOJIS[mood] : day.isFuture ? '·' : '·'}</Text>
                  </View>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weekly Check-In */}
        {!checkInSubmitted ? (
          <View style={styles.checkInCard}>
            <Text style={styles.checkInTitle}>{STRINGS.insights.weeklyCheckIn}</Text>
            <Text style={styles.checkInQuestion}>{STRINGS.insights.checkInQuestion}</Text>
            <View style={styles.moodSelector}>
              {MOOD.selfReportOptions.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.moodBtn}
                  onPress={() => handleCheckIn(m.id)}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={styles.moodLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.checkInDoneCard}>
            <Text style={styles.checkInDoneText}>{STRINGS.insights.checkInDone}</Text>
          </View>
        )}

        {/* Gemini Nudges */}
        <Text style={styles.sectionTitle}>{STRINGS.insights.smartNudges}</Text>
        {nudgesLoading ? (
          <View style={styles.nudgeLoading}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.nudgeLoadingText}>Generating insights…</Text>
          </View>
        ) : (
          nudges.map((nudge, i) => (
            <View key={i} style={styles.nudgeCard}>
              <Text style={styles.nudgeIcon}>✨</Text>
              <Text style={styles.nudgeText}>{nudge}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  title: { fontFamily: FONTS.displayMedium, fontSize: FONT_SIZE.h2, color: COLORS.textPrimary },
  subtitle: { fontFamily: FONTS.body, fontSize: FONT_SIZE.bodySmall, color: COLORS.textSecondary, marginTop: 2 },
  scrollContent: { paddingHorizontal: SPACING.screenHorizontal, paddingBottom: SPACING.huge },
  moodScoreCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  cardLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  scoreNumber: { fontFamily: FONTS.displayBold, fontSize: FONT_SIZE.h1, lineHeight: 34 },
  scoreOutOf: { fontFamily: FONTS.body, fontSize: FONT_SIZE.caption, color: COLORS.textSecondary },
  scoreInfo: { flex: 1 },
  scoreLabel: { fontFamily: FONTS.displayMedium, fontSize: FONT_SIZE.h3, marginBottom: SPACING.xs },
  scoreDesc: { fontFamily: FONTS.body, fontSize: FONT_SIZE.bodySmall, color: COLORS.textSecondary, lineHeight: 20 },
  dayStrip: { flexDirection: 'row', justifyContent: 'space-between' },
  dayItem: { alignItems: 'center' },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxs,
  },
  dayEmoji: { fontSize: 16 },
  dayLabel: { fontFamily: FONTS.body, fontSize: FONT_SIZE.label, color: COLORS.textSecondary },
  checkInCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  checkInTitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  checkInQuestion: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  moodSelector: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { alignItems: 'center', padding: SPACING.xs },
  moodEmoji: { fontSize: 36, marginBottom: SPACING.xxs },
  moodLabel: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.caption, color: COLORS.textSecondary },
  checkInDoneCard: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
  },
  checkInDoneText: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.primary },
  sectionTitle: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  nudgeLoading: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
  nudgeLoadingText: { fontFamily: FONTS.body, fontSize: FONT_SIZE.body, color: COLORS.textSecondary },
  nudgeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    alignItems: 'flex-start',
  },
  nudgeIcon: { fontSize: 18, marginRight: SPACING.sm, marginTop: 1 },
  nudgeText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
});
